"use client";

import { useState, useEffect } from "react";
import {
  Play,
  Pause,
  RotateCw,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Camera,
  Video,
  MapPin,
  AlertTriangle,
  Wifi,
  Battery,
  Thermometer,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Mock drone data
const DRONES = [
  {
    id: "drone-1",
    name: "Drone Alpha",
    status: "active",
    battery: 78,
    location: "Downtown",
    temperature: 32,
  },
  {
    id: "drone-2",
    name: "Drone Beta",
    status: "idle",
    battery: 92,
    location: "North District",
    temperature: 29,
  },
  {
    id: "drone-3",
    name: "Drone Gamma",
    status: "maintenance",
    battery: 45,
    location: "Industrial Zone",
    temperature: 34,
  },
  {
    id: "drone-4",
    name: "Drone Delta",
    status: "active",
    battery: 65,
    location: "Residential Area",
    temperature: 31,
  },
];

export default function DroneSurveillancePage() {
  const [selectedDrone, setSelectedDrone] = useState(DRONES[0]);
  const [isLiveStreaming, setIsLiveStreaming] = useState(false);
  const [streamQuality, setStreamQuality] = useState("hd");
  const [recordingMode, setRecordingMode] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [batteryLevel, setBatteryLevel] = useState(selectedDrone.battery);
  const [signalStrength, setSignalStrength] = useState(85);

  // Simulate battery drain when streaming
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isLiveStreaming) {
      interval = setInterval(() => {
        setBatteryLevel((prev) => {
          const newLevel = Math.max(0, prev - 0.5);
          if (newLevel < 20 && newLevel % 1 === 0) {
            // Low battery warning
            alert(`Warning: ${selectedDrone.name} battery level below 20%`);
          }
          return newLevel;
        });
      }, 10000); // Drain battery every 10 seconds
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isLiveStreaming, selectedDrone.name]);

  // Reset drone state when changing drones
  useEffect(() => {
    setIsLiveStreaming(false);
    setRecordingMode(false);
    setBatteryLevel(selectedDrone.battery);
    setZoomLevel(1);
    setSignalStrength(Math.floor(Math.random() * 30) + 70); // Random signal between 70-100
  }, [selectedDrone]);

  const toggleLiveStream = () => {
    setIsLiveStreaming(!isLiveStreaming);
  };

  const toggleRecording = () => {
    setRecordingMode(!recordingMode);
    if (!recordingMode) {
      alert(`Started recording with ${selectedDrone.name}`);
    } else {
      alert(`Stopped recording with ${selectedDrone.name}`);
    }
  };

  const captureSnapshot = () => {
    alert(`Snapshot captured from ${selectedDrone.name}`);
  };

  const handleZoom = (direction: "in" | "out") => {
    if (direction === "in" && zoomLevel < 5) {
      setZoomLevel((prev) => prev + 0.5);
    } else if (direction === "out" && zoomLevel > 1) {
      setZoomLevel((prev) => prev - 0.5);
    }
  };

  const getBatteryColor = () => {
    if (batteryLevel > 60) return "text-green-500";
    if (batteryLevel > 30) return "text-yellow-500";
    return "text-red-500";
  };

  const getSignalColor = () => {
    if (signalStrength > 70) return "text-green-500";
    if (signalStrength > 40) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">
          Drone Surveillance
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Monitor and control city surveillance drones in real-time.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main video feed */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="overflow-hidden">
            <div className="relative">
              <div className="aspect-video bg-gray-900 flex items-center justify-center">
                {isLiveStreaming ? (
                  <div className="relative w-full h-full">
                    {/* This would be a real video stream in production */}
                    <div
                      className="w-full h-full bg-cover bg-center"
                      style={{
                        backgroundImage:
                          "url('https://images.unsplash.com/photo-1577401239170-897942555fb3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80')",
                        transform: `scale(${zoomLevel})`,
                      }}
                    ></div>

                    {/* Overlay elements */}
                    <div className="absolute top-4 left-4 bg-black/50 text-white px-2 py-1 rounded-md text-sm flex items-center">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          recordingMode
                            ? "bg-red-500 animate-pulse"
                            : "bg-gray-400"
                        } mr-2`}
                      ></div>
                      {recordingMode ? "REC" : "LIVE"}
                    </div>

                    <div className="absolute top-4 right-4 bg-black/50 text-white px-2 py-1 rounded-md text-sm">
                      {new Date().toLocaleTimeString()}
                    </div>

                    <div className="absolute bottom-4 left-4 bg-black/50 text-white px-2 py-1 rounded-md text-sm flex items-center">
                      <MapPin className="h-3 w-3 mr-1" />{" "}
                      {selectedDrone.location}
                    </div>

                    <div className="absolute bottom-4 right-4 bg-black/50 text-white px-2 py-1 rounded-md text-sm flex items-center space-x-2">
                      <div className="flex items-center">
                        <Battery
                          className={`h-3 w-3 mr-1 ${getBatteryColor()}`}
                        />
                        <span>{Math.floor(batteryLevel)}%</span>
                      </div>
                      <div className="flex items-center">
                        <Wifi className={`h-3 w-3 mr-1 ${getSignalColor()}`} />
                        <span>{signalStrength}%</span>
                      </div>
                      <div className="flex items-center">
                        <Thermometer className="h-3 w-3 mr-1 text-orange-500" />
                        <span>{selectedDrone.temperature}°C</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-8">
                    <div className="flex justify-center mb-4">
                      <Video className="h-12 w-12 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-300">
                      Video Feed Not Active
                    </h3>
                    <p className="text-gray-500 mt-2">
                      Click the play button below to start streaming
                    </p>
                  </div>
                )}
              </div>

              {/* Video controls */}
              <div className="bg-gray-800 p-4 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={toggleLiveStream}
                    className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 text-white"
                  >
                    {isLiveStreaming ? (
                      <Pause className="h-5 w-5" />
                    ) : (
                      <Play className="h-5 w-5" />
                    )}
                  </button>

                  <button
                    onClick={toggleRecording}
                    className={`p-2 rounded-full ${
                      recordingMode
                        ? "bg-red-600 hover:bg-red-700"
                        : "bg-gray-700 hover:bg-gray-600"
                    } text-white`}
                  >
                    <Video className="h-5 w-5" />
                  </button>

                  <button
                    onClick={captureSnapshot}
                    className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 text-white"
                  >
                    <Camera className="h-5 w-5" />
                  </button>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleZoom("out")}
                    disabled={zoomLevel <= 1}
                    className="p-1 rounded bg-gray-700 hover:bg-gray-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    -
                  </button>
                  <span className="text-white text-sm">
                    {zoomLevel.toFixed(1)}x
                  </span>
                  <button
                    onClick={() => handleZoom("in")}
                    disabled={zoomLevel >= 5}
                    className="p-1 rounded bg-gray-700 hover:bg-gray-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    +
                  </button>
                </div>

                <div>
                  <select
                    value={streamQuality}
                    onChange={(e) => setStreamQuality(e.target.value)}
                    className="bg-gray-700 text-white text-sm rounded px-2 py-1 border-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="low">Low (480p)</option>
                    <option value="medium">Medium (720p)</option>
                    <option value="hd">HD (1080p)</option>
                    <option value="4k">4K</option>
                  </select>
                </div>
              </div>
            </div>
          </Card>

          {/* Drone controls */}
          <Card>
            <CardHeader>
              <CardTitle>Drone Controls</CardTitle>
              <CardDescription>
                Control the selected drone's movement and orientation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Movement controls */}
                <div className="flex flex-col items-center">
                  <h3 className="text-sm font-medium mb-4">Movement</h3>
                  <div className="grid grid-cols-3 gap-2">
                    <div></div>
                    <button className="p-3 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600">
                      <ChevronUp className="h-5 w-5" />
                    </button>
                    <div></div>

                    <button className="p-3 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600">
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button className="p-3 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600">
                      <RotateCw className="h-5 w-5" />
                    </button>
                    <button className="p-3 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600">
                      <ChevronRight className="h-5 w-5" />
                    </button>

                    <div></div>
                    <button className="p-3 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600">
                      <ChevronDown className="h-5 w-5" />
                    </button>
                    <div></div>
                  </div>
                </div>

                {/* Altitude and rotation controls */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Altitude</h3>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      defaultValue="50"
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>0m</span>
                      <span>50m</span>
                      <span>100m</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium mb-2">Rotation</h3>
                    <input
                      type="range"
                      min="0"
                      max="360"
                      defaultValue="180"
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>0°</span>
                      <span>180°</span>
                      <span>360°</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar with drone list and info */}
        <div className="space-y-6">
          {/* Drone selection */}
          <Card>
            <CardHeader>
              <CardTitle>Available Drones</CardTitle>
              <CardDescription>Select a drone to control</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {DRONES.map((drone) => (
                  <div
                    key={drone.id}
                    onClick={() => setSelectedDrone(drone)}
                    className={`p-3 rounded-lg cursor-pointer flex items-center justify-between ${
                      selectedDrone.id === drone.id
                        ? "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"
                        : "bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700"
                    }`}
                  >
                    <div className="flex items-center">
                      <div
                        className={`w-2 h-2 rounded-full mr-3 ${
                          drone.status === "active"
                            ? "bg-green-500"
                            : drone.status === "idle"
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }`}
                      ></div>
                      <div>
                        <h4 className="font-medium">{drone.name}</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                          {drone.status}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="text-xs px-2 py-1 rounded bg-gray-200 dark:bg-gray-700">
                        <Battery
                          className={`h-3 w-3 inline-block mr-1 ${
                            drone.battery > 60
                              ? "text-green-500"
                              : drone.battery > 30
                              ? "text-yellow-500"
                              : "text-red-500"
                          }`}
                        />
                        {drone.battery}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Drone details */}
          <Card>
            <CardHeader>
              <CardTitle>{selectedDrone.name}</CardTitle>
              <CardDescription>Drone specifications and status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 border rounded-md">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Status
                    </p>
                    <p className="font-medium capitalize">
                      {selectedDrone.status}
                    </p>
                  </div>
                  <div className="p-3 border rounded-md">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Battery
                    </p>
                    <p className="font-medium">{Math.floor(batteryLevel)}%</p>
                  </div>
                  <div className="p-3 border rounded-md">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Signal
                    </p>
                    <p className="font-medium">{signalStrength}%</p>
                  </div>
                  <div className="p-3 border rounded-md">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Temperature
                    </p>
                    <p className="font-medium">{selectedDrone.temperature}°C</p>
                  </div>
                </div>

                <div className="p-3 border rounded-md">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Current Location
                  </p>
                  <p className="font-medium">{selectedDrone.location}</p>
                </div>

                {batteryLevel < 30 && (
                  <div className="flex items-start gap-3 p-3 border rounded-md bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
                    <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-red-800 dark:text-red-400">
                        Low Battery Warning
                      </p>
                      <p className="text-sm text-red-700 dark:text-red-500">
                        Battery level is critically low. Consider returning the
                        drone to base.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent events */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Events</CardTitle>
              <CardDescription>
                Latest drone activities and alerts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-2 border-b">
                  <div className="text-xs text-gray-500">10:23 AM</div>
                  <div className="text-sm">
                    Drone Alpha started surveillance in Downtown area
                  </div>
                </div>
                <div className="flex items-center gap-3 p-2 border-b">
                  <div className="text-xs text-gray-500">09:45 AM</div>
                  <div className="text-sm">
                    Drone Gamma scheduled for maintenance
                  </div>
                </div>
                <div className="flex items-center gap-3 p-2 border-b">
                  <div className="text-xs text-gray-500">09:12 AM</div>
                  <div className="text-sm">
                    Suspicious activity detected in Industrial Zone
                  </div>
                </div>
                <div className="flex items-center gap-3 p-2">
                  <div className="text-xs text-gray-500">08:30 AM</div>
                  <div className="text-sm">
                    All drones completed morning system check
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
