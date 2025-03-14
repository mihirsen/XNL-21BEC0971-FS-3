"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

// Using environment variable for Mapbox token
const MAPBOX_TOKEN =
  typeof process !== "undefined" && process.env.NEXT_PUBLIC_MAPBOX_TOKEN
    ? process.env.NEXT_PUBLIC_MAPBOX_TOKEN
    : "pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw";

// Interface for sensor data
interface SensorData {
  _id: string;
  type: string;
  value: number;
  status: "normal" | "warning" | "critical";
  coordinates: [number, number];
  timestamp: string;
  metadata: {
    deviceId: string;
    batteryLevel: number;
    manufacturer?: string;
    model?: string;
    firmwareVersion?: string;
    lastMaintenance?: string;
  };
}

interface CityMapProps {
  activeFilters?: string[];
  centerCoordinates?: [number, number];
  onMapReady?: () => void;
}

const CityMap = ({
  activeFilters = ["air-quality", "weather", "traffic", "water", "noise"],
  centerCoordinates,
  onMapReady,
}: CityMapProps): JSX.Element => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [sensorData, setSensorData] = useState<SensorData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);

  // Add a ref that external components can use to call functions on this component
  const mapInstanceRef = useRef<{
    flyToLocation: (coordinates: [number, number], zoom?: number) => void;
  }>({
    flyToLocation: () => {},
  });

  // Function to fly to a specific location
  const flyToLocation = useCallback(
    (coordinates: [number, number], zoom = 14) => {
      if (map.current) {
        console.log("Flying to location:", coordinates);
        map.current.flyTo({
          center: coordinates,
          zoom,
          essential: true,
          duration: 1000,
        });
      }
    },
    []
  );

  // Store the function in the ref so it's accessible externally
  useEffect(() => {
    mapInstanceRef.current = {
      flyToLocation,
    };
  }, [flyToLocation]);

  // Use provided center coordinates if available
  useEffect(() => {
    if (map.current && centerCoordinates && mapLoaded) {
      flyToLocation(centerCoordinates);
    }
  }, [centerCoordinates, mapLoaded, flyToLocation]);

  // Fetch sensor data from API or use mock data
  useEffect(() => {
    const fetchSensorData = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log("Fetching sensor data from API...");
        const response = await fetch("http://localhost:3001/iot/sensor-data");

        if (!response.ok) {
          throw new Error(`API responded with status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Received sensor data:", data);

        if (!data || data.length === 0) {
          console.log("No sensor data available, using mock data");
          setError("No sensor data available. Using mock data.");
          const mockData = generateMockSensorData();
          console.log("Generated mock data:", mockData);
          setSensorData(mockData);
        } else {
          setSensorData(data);
        }
      } catch (error) {
        console.error("Error fetching sensor data:", error);
        setError("Failed to load sensor data. Using mock data instead.");
        // Using mock data as fallback
        const mockData = generateMockSensorData();
        console.log("Using mock data due to error:", mockData);
        setSensorData(mockData);
      } finally {
        setLoading(false);
      }
    };

    fetchSensorData();
  }, []);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current) return;

    try {
      console.log("Initializing map with token:", MAPBOX_TOKEN);
      mapboxgl.accessToken = MAPBOX_TOKEN;

      // Check if WebGL is supported
      if (!mapboxgl.supported()) {
        throw new Error("WebGL is not supported in your browser");
      }

      // Use a try-catch to ensure the map initialization doesn't fail silently
      try {
        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: "mapbox://styles/mapbox/light-v11", // Using light style for better visibility
          center: [-74.006, 40.7128], // Default to New York City
          zoom: 11,
          attributionControl: false,
          minZoom: 9,
          maxZoom: 15,
          failIfMajorPerformanceCaveat: false, // Allow map to render despite performance issues
        });

        // Add map controls with mobile-friendly positioning
        map.current.addControl(
          new mapboxgl.NavigationControl({ showCompass: false }),
          "bottom-right"
        );

        // Add responsive attribution - compact on mobile
        map.current.addControl(
          new mapboxgl.AttributionControl({ compact: true }),
          "bottom-left"
        );

        // Try to get user's location and center map
        navigator.geolocation.getCurrentPosition(
          (position) => {
            console.log("Got user position:", position.coords);
            if (map.current) {
              map.current.flyTo({
                center: [position.coords.longitude, position.coords.latitude],
                zoom: 12,
                essential: true,
              });

              // Add a marker for current location
              new mapboxgl.Marker({
                color: "#3B82F6",
                scale: 0.8,
              })
                .setLngLat([
                  position.coords.longitude,
                  position.coords.latitude,
                ])
                .setPopup(
                  new mapboxgl.Popup().setHTML("<h3>Your Location</h3>")
                )
                .addTo(map.current);
            }
          },
          (error) => {
            console.warn("Error getting location:", error);
            // Continue with default location
          },
          {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
          }
        );

        map.current.on("load", () => {
          console.log("Map loaded successfully");
          setMapLoaded(true);
          // Notify parent component when map is ready
          onMapReady?.();
        });

        map.current.on("error", (e) => {
          console.error("Mapbox error:", e);
          setMapError(`Mapbox error: ${e.error?.message || "Unknown error"}`);
        });
      } catch (mapInitError: unknown) {
        console.error("Map initialization error:", mapInitError);
        setMapError(
          `Map initialization error: ${
            mapInitError instanceof Error
              ? mapInitError.message
              : String(mapInitError)
          }`
        );
      }

      return () => {
        console.log("Cleaning up map");
        if (map.current) {
          map.current.remove();
        }
      };
    } catch (error) {
      console.error("Error initializing map:", error);
      setMapError(
        `Failed to initialize map: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
      return () => {};
    }
  }, [onMapReady]);

  // Generate mock sensor data for fallback
  const generateMockSensorData = (): SensorData[] => {
    console.log("Generating mock sensor data");
    const mockData: SensorData[] = [];
    const types = ["air_quality", "traffic", "energy", "water", "noise"];
    const statuses: ("normal" | "warning" | "critical")[] = [
      "normal",
      "normal",
      "normal",
      "warning",
      "critical",
    ];

    // Default to New York if no location
    let baseLatitude = 40.7128;
    let baseLongitude = -74.006;

    // Try to use current location if available
    if (navigator.geolocation) {
      try {
        navigator.geolocation.getCurrentPosition((position) => {
          baseLatitude = position.coords.latitude;
          baseLongitude = position.coords.longitude;
        });
      } catch (e) {
        console.warn("Could not get current location:", e);
      }
    }

    // Generate at least 30 data points for better visualization
    for (let i = 0; i < 30; i++) {
      const type = types[Math.floor(Math.random() * types.length)];
      // Weight the statuses to have more normals
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      let value = 0;

      // Generate realistic values based on sensor type
      switch (type) {
        case "air_quality":
          value = Math.floor(Math.random() * 300); // AQI value
          break;
        case "traffic":
          value = Math.floor(Math.random() * 1000) + 100; // vehicles per hour
          break;
        case "energy":
          value = Math.floor(Math.random() * 500) + 50; // kWh
          break;
        case "water":
          value = Math.floor(Math.random() * 100) + 10; // L/min
          break;
        case "noise":
          value = Math.floor(Math.random() * 40) + 50; // dB
          break;
        default:
          value = Math.floor(Math.random() * 1000);
      }

      // Generate random coordinates within the city area - more spread out
      // Use different spreads for different sensor types for more interesting visualization
      const spread = 0.05 + Math.random() * 0.05;
      const latitude = baseLatitude + (Math.random() * spread - spread / 2);
      const longitude = baseLongitude + (Math.random() * spread - spread / 2);

      mockData.push({
        _id: `sensor-${i}`,
        type,
        value,
        status,
        coordinates: [longitude, latitude],
        timestamp: new Date(
          Date.now() - Math.random() * 86400000
        ).toISOString(), // Random time in the last 24 hours
        metadata: {
          deviceId: `device-${i}`,
          batteryLevel: Math.floor(Math.random() * 100),
          manufacturer: ["Siemens", "Bosch", "ABB", "Honeywell"][
            Math.floor(Math.random() * 4)
          ],
          model: ["SM100", "IoT-3000", "SmartSense"][
            Math.floor(Math.random() * 3)
          ],
          firmwareVersion: `v${Math.floor(Math.random() * 5)}.${Math.floor(
            Math.random() * 10
          )}`,
          lastMaintenance: new Date(Date.now() - Math.random() * 30 * 86400000)
            .toISOString()
            .split("T")[0],
        },
      });
    }

    return mockData;
  };

  // Function to add/update sensor markers
  const updateMarkers = useCallback(() => {
    if (!map.current || !mapLoaded) return;

    try {
      console.log("Updating markers with sensor data");

      // Create markers for sensor data
      if (sensorData?.length) {
        // Remove existing markers if any
        const existingMarkers = document.querySelectorAll(".sensor-marker");
        existingMarkers.forEach((marker) => marker.remove());

        sensorData.forEach((sensor) => {
          // Skip if no coordinates
          if (!sensor.coordinates || sensor.coordinates.length !== 2) return;

          // Determine marker color based on status
          let color;
          switch (sensor.status) {
            case "critical":
              color = "#ef4444"; // red-500
              break;
            case "warning":
              color = "#f59e0b"; // amber-500
              break;
            default:
              color = "#22c55e"; // green-500
          }

          // Different size based on type for visual distinction
          const scale =
            sensor.type === "traffic"
              ? 0.9
              : sensor.type === "air_quality"
              ? 0.8
              : sensor.type === "energy"
              ? 0.7
              : sensor.type === "water"
              ? 0.75
              : 0.65;

          // Create the marker element with a custom DOM element
          const markerEl = document.createElement("div") as HTMLDivElement;
          markerEl.className = "sensor-marker";
          markerEl.style.width = "20px";
          markerEl.style.height = "20px";
          markerEl.style.borderRadius = "50%";
          markerEl.style.backgroundColor = color;
          markerEl.style.border = "2px solid white";
          markerEl.style.boxShadow = "0 0 10px rgba(0,0,0,0.3)";
          markerEl.style.cursor = "pointer";
          markerEl.style.transition = "transform 0.2s ease";

          // Create popup content
          const popupContent = `
            <div class="sensor-popup">
              <h3 class="text-lg font-semibold">${sensor.type
                .replace("_", " ")
                .toUpperCase()}</h3>
              <div class="flex items-center my-1">
                <div class="w-3 h-3 rounded-full mr-2" style="background-color: ${color}"></div>
                <span class="text-sm">Status: ${sensor.status}</span>
              </div>
              <div class="my-1">
                <span class="font-bold text-lg">${sensor.value}</span>
                <span class="text-xs ml-1">${
                  sensor.type === "air_quality"
                    ? "AQI"
                    : sensor.type === "traffic"
                    ? "vehicles/h"
                    : sensor.type === "energy"
                    ? "kWh"
                    : sensor.type === "water"
                    ? "L/min"
                    : "dB"
                }</span>
              </div>
              <div class="text-xs text-gray-500 mt-2">
                Last updated: ${new Date(sensor.timestamp).toLocaleString()}
              </div>
              <div class="text-xs text-gray-500">
                Device: ${sensor.metadata.manufacturer} ${sensor.metadata.model}
              </div>
            </div>
          `;

          // Create popup
          const popup = new mapboxgl.Popup({
            offset: 25,
            closeButton: false,
            closeOnClick: true,
            className: "sensor-popup-container",
            maxWidth: "300px",
          }).setHTML(popupContent);

          // Create marker with popup
          const marker = new mapboxgl.Marker({
            element: markerEl,
            scale,
            anchor: "center",
          })
            .setLngLat(sensor.coordinates as [number, number])
            .setPopup(popup);

          // Add the marker to the map with a null check to fix the linter error
          if (map.current) {
            marker.addTo(map.current);
          }

          // Add hover effect directly to the marker element
          markerEl.addEventListener("mouseenter", () => {
            markerEl.style.transform = "scale(1.2)";
            marker.togglePopup();
          });

          markerEl.addEventListener("mouseleave", () => {
            markerEl.style.transform = "scale(1)";
            // Don't close the popup on mouse leave to improve UX
          });

          // Store marker for later removal
          const markers = document.querySelectorAll(".sensor-marker");
          const markerArray = Array.from(markers);
          markerArray.forEach((m) => {
            m.addEventListener("mouseenter", () => {
              (m as HTMLDivElement).style.transform = "scale(1.2)";
              marker.togglePopup();
            });
            m.addEventListener("mouseleave", () => {
              (m as HTMLDivElement).style.transform = "scale(1)";
              // Don't close the popup on mouse leave to improve UX
            });
          });
        });

        console.log(`Created ${sensorData.length} markers`);
      }
    } catch (error) {
      console.error("Error updating markers:", error);
    }
  }, [sensorData, mapLoaded]);

  useEffect(() => {
    updateMarkers();
  }, [updateMarkers]);

  return (
    <div className="relative w-full h-full">
      {/* Map container */}
      <div ref={mapContainer} className="w-full h-full" />

      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 bg-gray-700/50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center shadow-lg">
            <div className="w-12 h-12 border-4 border-t-primary-500 border-r-primary-500 border-b-gray-200 border-l-gray-200 rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-gray-700 dark:text-gray-200">
              Loading map data...
            </p>
          </div>
        </div>
      )}

      {/* Error message */}
      {(error || mapError) && (
        <div className="absolute inset-0 bg-gray-700/50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md text-center shadow-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-amber-500 mx-auto mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              {mapError ? "Map Error" : "Data Loading Error"}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {mapError || error}
            </p>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Using mock data to display approximate city metrics. Real-time
              data is currently unavailable.
            </div>
          </div>
        </div>
      )}

      {/* Fallback display when map can't be loaded */}
      {!loading && mapError && !map.current && (
        <div className="absolute inset-0 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
          <div className="max-w-md text-center p-8">
            <h3 className="text-xl font-bold text-primary-600 dark:text-primary-400 mb-4">
              Interactive Map Unavailable
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              We're unable to load the interactive map due to browser
              limitations or connectivity issues.
            </p>
            <div className="grid grid-cols-2 gap-4 mb-6">
              {[
                "Energy Usage",
                "Traffic Flow",
                "Air Quality",
                "Water Quality",
              ].map((metric, i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-gray-700 rounded-lg p-4 shadow"
                >
                  <div className="text-3xl font-bold text-primary-500">
                    {Math.floor(Math.random() * 30) + 70}%
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {metric}
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CityMap;
