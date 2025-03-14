"use client";

import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Play,
  Pause,
  Camera,
  Video,
  Map,
  Crosshair,
  RotateCcw,
  Thermometer,
  ZoomIn,
  ZoomOut,
  RefreshCw,
  AlertTriangle,
  Info,
  Lock,
  Layers,
  Send,
  Minimize,
  Maximize,
  Eye,
  Plane,
} from "lucide-react";

type DroneStatus = "active" | "idle" | "mission" | "charging" | "offline";

interface DroneData {
  id: string;
  name: string;
  status: DroneStatus;
  battery: number;
  location: {
    lat: number;
    lng: number;
  };
}

// Mock drone data
const DRONES: DroneData[] = [
  {
    id: "drone-1",
    name: "Patrol Drone 1",
    status: "active",
    battery: 78,
    location: { lat: 40.712, lng: -74.006 },
  },
  {
    id: "drone-2",
    name: "Traffic Drone 1",
    status: "idle",
    battery: 92,
    location: { lat: 40.718, lng: -74.012 },
  },
  {
    id: "drone-3",
    name: "Emergency Drone",
    status: "mission",
    battery: 45,
    location: { lat: 40.722, lng: -74.001 },
  },
  {
    id: "drone-4",
    name: "Surveillance Drone 2",
    status: "charging",
    battery: 23,
    location: { lat: 40.708, lng: -74.008 },
  },
];

export default function DroneSurveillance() {
  const [activeDrone, setActiveDrone] = useState<DroneData | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [view, setView] = useState<"normal" | "thermal" | "infrared">("normal");
  const [availableDrones, setAvailableDrones] = useState<DroneData[]>(DRONES);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [streamQuality, setStreamQuality] = useState<"low" | "medium" | "high">(
    "medium"
  );
  const [isRecording, setIsRecording] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Auto-select first active drone
    const firstActive = availableDrones.find((d) => d.status === "active");
    if (firstActive && !activeDrone) {
      setActiveDrone(firstActive);
    }

    // Setup fullscreen change event listener
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, [availableDrones, activeDrone]);

  const toggleStream = () => {
    if (!activeDrone) return;

    setIsStreaming(!isStreaming);

    // Reset recording when stopping stream
    if (isStreaming && isRecording) {
      setIsRecording(false);
    }
  };

  const toggleRecording = () => {
    if (!isStreaming) return;
    setIsRecording(!isRecording);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  const increaseZoom = () => setZoomLevel((prev) => Math.min(prev + 0.5, 4));
  const decreaseZoom = () => setZoomLevel((prev) => Math.max(prev - 0.5, 1));

  const cycleView = () => {
    const views: ("normal" | "thermal" | "infrared")[] = [
      "normal",
      "thermal",
      "infrared",
    ];
    const currentIndex = views.indexOf(view);
    const nextIndex = (currentIndex + 1) % views.length;
    setView(views[nextIndex]);
  };

  const getStatusColor = (status: DroneStatus) => {
    switch (status) {
      case "active":
        return "text-green-500";
      case "idle":
        return "text-blue-500";
      case "mission":
        return "text-amber-500";
      case "charging":
        return "text-purple-500";
      case "offline":
        return "text-gray-500";
    }
  };

  const getBatteryColor = (level: number) => {
    if (level > 70) return "text-green-500";
    if (level > 30) return "text-amber-500";
    return "text-red-500";
  };

  const getVideoOverlay = () => {
    if (!isStreaming) {
      return (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 text-white">
          <Plane className="mb-2 h-12 w-12 text-primary-500" />
          <p className="text-lg font-semibold">Stream Not Active</p>
          <p className="text-sm text-gray-400">
            Select a drone and press play to start streaming
          </p>
        </div>
      );
    }
    return null;
  };

  // Apply visual filter based on view type
  const getVideoFilter = () => {
    switch (view) {
      case "thermal":
        return "sepia(50%) hue-rotate(180deg) saturate(200%)";
      case "infrared":
        return "grayscale(100%) brightness(120%) contrast(120%)";
      default:
        return "none";
    }
  };

  return (
    <div className="space-y-4" ref={containerRef}>
      <Card
        className={`transition-all duration-300 ${
          isFullscreen ? "rounded-none" : ""
        }`}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="text-xl">Drone Surveillance</CardTitle>
            <p className="text-sm text-gray-500">Real-time aerial monitoring</p>
          </div>
          {activeDrone && (
            <div className="flex flex-col items-end">
              <span className="text-sm font-medium">{activeDrone.name}</span>
              <span className={`text-xs ${getStatusColor(activeDrone.status)}`}>
                {activeDrone.status.charAt(0).toUpperCase() +
                  activeDrone.status.slice(1)}
              </span>
            </div>
          )}
        </CardHeader>
        <CardContent>
          <div className="relative">
            {/* Video Feed */}
            <div
              className={`relative aspect-video w-full overflow-hidden rounded-md bg-black ${
                isFullscreen ? "h-screen" : ""
              }`}
            >
              <video
                ref={videoRef}
                className="h-full w-full object-cover transition-transform"
                style={{
                  transform: `scale(${zoomLevel})`,
                  filter: getVideoFilter(),
                }}
                autoPlay={isStreaming}
                muted
                loop
                poster="/assets/drone-standby.jpg"
                src={isStreaming ? "/assets/demo-drone-feed.mp4" : undefined}
              />

              {getVideoOverlay()}

              {/* Overlay HUD Elements */}
              {isStreaming && (
                <>
                  {/* Crosshair */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <Crosshair className="h-16 w-16 text-white/50" />
                  </div>

                  {/* Recording Indicator */}
                  {isRecording && (
                    <div className="absolute top-4 right-4 flex items-center space-x-2 rounded-full bg-red-600/80 px-3 py-1 text-white">
                      <div className="h-2 w-2 animate-pulse rounded-full bg-red-100"></div>
                      <span className="text-xs font-medium">REC</span>
                    </div>
                  )}

                  {/* Stream Quality */}
                  <div className="absolute top-4 left-4 rounded-md bg-black/60 px-2 py-1 text-xs text-white">
                    {view.toUpperCase()} • {streamQuality.toUpperCase()} •{" "}
                    {Math.round(zoomLevel * 100)}%
                  </div>

                  {/* Coordinates */}
                  <div className="absolute bottom-4 left-4 rounded-md bg-black/60 px-2 py-1 text-xs text-white">
                    LAT: {activeDrone?.location.lat.toFixed(4)} • LNG:{" "}
                    {activeDrone?.location.lng.toFixed(4)}
                  </div>

                  {/* Battery */}
                  <div className="absolute bottom-4 right-4 flex items-center space-x-1 rounded-md bg-black/60 px-2 py-1 text-xs">
                    <div
                      className={`font-mono ${getBatteryColor(
                        activeDrone?.battery || 0
                      )}`}
                    >
                      {activeDrone?.battery}%
                    </div>
                    <div className="h-3 w-5 rounded-sm border border-white/50 text-white">
                      <div
                        className={`h-full rounded-sm ${
                          activeDrone && activeDrone.battery > 70
                            ? "bg-green-500"
                            : activeDrone && activeDrone.battery > 30
                            ? "bg-amber-500"
                            : "bg-red-500"
                        }`}
                        style={{ width: `${activeDrone?.battery || 0}%` }}
                      ></div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Controls */}
            <div
              className={`mt-4 grid grid-cols-2 gap-4 ${
                isFullscreen ? "px-4 pb-4" : ""
              } sm:grid-cols-4`}
            >
              <div className="space-y-1">
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  Drones
                </div>
                <select
                  value={activeDrone?.id || ""}
                  onChange={(e) => {
                    const selected = availableDrones.find(
                      (d) => d.id === e.target.value
                    );
                    if (selected) {
                      setActiveDrone(selected);
                      // Stop streaming when changing drones
                      if (isStreaming) setIsStreaming(false);
                    }
                  }}
                  className="w-full rounded-md border border-gray-300 bg-white px-2 py-1 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                >
                  <option value="" disabled>
                    Select Drone
                  </option>
                  {availableDrones.map((drone) => (
                    <option
                      key={drone.id}
                      value={drone.id}
                      disabled={
                        drone.status === "offline" ||
                        drone.status === "charging"
                      }
                    >
                      {drone.name} ({drone.status})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  Quality
                </div>
                <select
                  value={streamQuality}
                  onChange={(e) => setStreamQuality(e.target.value as any)}
                  disabled={!isStreaming}
                  className="w-full rounded-md border border-gray-300 bg-white px-2 py-1 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                >
                  <option value="low">Low (360p)</option>
                  <option value="medium">Medium (720p)</option>
                  <option value="high">High (1080p)</option>
                </select>
              </div>

              <div className="col-span-2 grid grid-cols-5 gap-2">
                <button
                  onClick={toggleStream}
                  disabled={
                    !activeDrone ||
                    activeDrone.status === "offline" ||
                    activeDrone.status === "charging"
                  }
                  className="flex items-center justify-center rounded-md bg-primary-600 p-2 text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label={isStreaming ? "Stop stream" : "Start stream"}
                >
                  {isStreaming ? (
                    <Pause className="h-5 w-5" />
                  ) : (
                    <Play className="h-5 w-5" />
                  )}
                </button>

                <button
                  onClick={toggleRecording}
                  disabled={!isStreaming}
                  className={`flex items-center justify-center rounded-md p-2 text-white focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 ${
                    isRecording
                      ? "bg-red-600 hover:bg-red-700 focus:ring-red-500"
                      : "bg-gray-600 hover:bg-gray-700 focus:ring-gray-500"
                  }`}
                  aria-label={
                    isRecording ? "Stop recording" : "Start recording"
                  }
                >
                  <Video className="h-5 w-5" />
                </button>

                <button
                  onClick={() => {
                    if (isStreaming && activeDrone) {
                      // Simulate taking a snapshot
                      alert("Snapshot captured from " + activeDrone.name);
                    }
                  }}
                  disabled={!isStreaming}
                  className="flex items-center justify-center rounded-md bg-gray-600 p-2 text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label="Take snapshot"
                >
                  <Camera className="h-5 w-5" />
                </button>

                <button
                  onClick={cycleView}
                  disabled={!isStreaming}
                  className="flex items-center justify-center rounded-md bg-gray-600 p-2 text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label="Change view mode"
                >
                  {view === "normal" ? (
                    <Layers className="h-5 w-5" />
                  ) : view === "thermal" ? (
                    <Thermometer className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>

                <button
                  onClick={toggleFullscreen}
                  disabled={!isStreaming}
                  className="flex items-center justify-center rounded-md bg-gray-600 p-2 text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label={
                    isFullscreen ? "Exit fullscreen" : "Enter fullscreen"
                  }
                >
                  {isFullscreen ? (
                    <Minimize className="h-5 w-5" />
                  ) : (
                    <Maximize className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Secondary Controls (shown only when not fullscreen) */}
            {!isFullscreen && (
              <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div className="col-span-2 flex items-center justify-center space-x-2 rounded-md border border-gray-200 py-2 dark:border-gray-700">
                  <button
                    onClick={decreaseZoom}
                    disabled={!isStreaming || zoomLevel <= 1}
                    className="rounded-full p-1 text-gray-700 hover:bg-gray-200 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:text-gray-300 dark:hover:bg-gray-700"
                    aria-label="Zoom out"
                  >
                    <ZoomOut className="h-5 w-5" />
                  </button>

                  <div className="w-32 text-center text-sm">
                    Zoom: {Math.round(zoomLevel * 100)}%
                  </div>

                  <button
                    onClick={increaseZoom}
                    disabled={!isStreaming || zoomLevel >= 4}
                    className="rounded-full p-1 text-gray-700 hover:bg-gray-200 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:text-gray-300 dark:hover:bg-gray-700"
                    aria-label="Zoom in"
                  >
                    <ZoomIn className="h-5 w-5" />
                  </button>
                </div>

                <div className="col-span-2 flex items-center justify-center space-x-4 rounded-md border border-gray-200 p-2 dark:border-gray-700">
                  <button
                    onClick={() => {
                      if (isStreaming && activeDrone) {
                        alert(
                          "Dispatching emergency responders to drone location"
                        );
                      }
                    }}
                    disabled={!isStreaming}
                    className="flex items-center space-x-1 rounded-md bg-red-600 px-2 py-1 text-xs text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <AlertTriangle className="h-3 w-3" />
                    <span>Alert</span>
                  </button>

                  <button
                    onClick={() => {
                      if (isStreaming && activeDrone) {
                        alert("Opening map view of drone's location");
                      }
                    }}
                    disabled={!isStreaming}
                    className="flex items-center space-x-1 rounded-md bg-blue-600 px-2 py-1 text-xs text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Map className="h-3 w-3" />
                    <span>Map</span>
                  </button>

                  <button
                    onClick={() => {
                      if (isStreaming && activeDrone) {
                        alert("Following target with drone");
                      }
                    }}
                    disabled={!isStreaming}
                    className="flex items-center space-x-1 rounded-md bg-amber-600 px-2 py-1 text-xs text-white hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Crosshair className="h-3 w-3" />
                    <span>Follow</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Active Drone Status (only when not fullscreen) */}
      {!isFullscreen && activeDrone && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Drone Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Battery
                  </span>
                  <span
                    className={`text-sm font-medium ${getBatteryColor(
                      activeDrone.battery
                    )}`}
                  >
                    {activeDrone.battery}%
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                  <div
                    className={`h-full ${
                      activeDrone.battery > 70
                        ? "bg-green-500"
                        : activeDrone.battery > 30
                        ? "bg-amber-500"
                        : "bg-red-500"
                    }`}
                    style={{ width: `${activeDrone.battery}%` }}
                  ></div>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Status
                  </span>
                  <span
                    className={`text-sm font-medium ${getStatusColor(
                      activeDrone.status
                    )}`}
                  >
                    {activeDrone.status.charAt(0).toUpperCase() +
                      activeDrone.status.slice(1)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Signal
                  </span>
                  <span className="text-sm font-medium text-green-500">
                    Strong
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Altitude
                  </span>
                  <span className="text-sm font-medium">120 meters</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Speed
                  </span>
                  <span className="text-sm font-medium">15 km/h</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Flight Time
                  </span>
                  <span className="text-sm font-medium">24 minutes</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Distance
                  </span>
                  <span className="text-sm font-medium">1.2 km</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
