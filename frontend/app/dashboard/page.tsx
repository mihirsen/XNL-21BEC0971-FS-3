"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Battery,
  Building2,
  CheckCircle,
  CloudRain,
  Cpu,
  Droplets,
  FlameKindling,
  Info,
  Laptop,
  Lightbulb,
  MapPin,
  MoreHorizontal,
  Router,
  Thermometer,
  Truck,
  Users,
  Wind,
  ArrowUpRight,
  ChevronRight,
  Calendar,
  Clock,
  RefreshCw,
  ChevronLeft,
} from "lucide-react";
import Link from "next/link";
import { useWebSocket } from "../../providers/WebSocketProvider";
import { useAlert } from "../../components/global/GlobalAlert";
import dynamic from "next/dynamic";
import MainLayout from "@/components/layout/MainLayout";
import Image from "next/image";

// Dynamically import the Three.js component to avoid SSR issues
const CityModelViewer = dynamic(
  () => import("@/components/3d/CityModelViewer"),
  { ssr: false }
);

// Use static data URLs for images instead of external or local files
const staticImages = Array(5).fill(
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiMzNDk4ZGIiIHN0b3Atb3BhY2l0eT0iMSIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iIzM0NDk1ZSIgc3RvcC1vcGFjaXR5PSIxIi8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjgwMCIgaGVpZ2h0PSI0MDAiIGZpbGw9InVybCgjZykiLz48dGV4dCB4PSI0MDAiIHk9IjIwMCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjI0IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgYWxpZ25tZW50LWJhc2VsaW5lPSJtaWRkbGUiPlNtYXJ0IENpdHkgSW1hZ2U8L3RleHQ+PC9zdmc+"
);

const GRAPH_DATA = {
  energy: [45, 52, 49, 65, 78, 89, 90, 87, 92, 95, 98, 95],
  water: [35, 32, 39, 45, 48, 49, 50, 57, 62, 65, 68, 75],
  traffic: [65, 72, 79, 85, 88, 89, 90, 87, 82, 75, 68, 65],
  airQuality: [75, 72, 69, 75, 78, 79, 80, 77, 72, 75, 78, 85],
};

const generateRandomPercentage = () => {
  return Math.floor(Math.random() * 30) + 70;
};

const getStatusColor = (value: number) => {
  if (value >= 85) return "text-green-500";
  if (value >= 70) return "text-amber-500";
  return "text-red-500";
};

const getBgColor = (value: number) => {
  if (value >= 85) return "bg-green-500";
  if (value >= 70) return "bg-amber-500";
  return "bg-red-500";
};

const getGradient = (value: number) => {
  if (value >= 85) return "from-green-500 to-green-300";
  if (value >= 70) return "from-amber-500 to-amber-300";
  return "from-red-500 to-red-300";
};

const iconMap = {
  energy: <FlameKindling className="w-5 h-5" />,
  water: <Droplets className="w-5 h-5" />,
  traffic: <Truck className="w-5 h-5" />,
  airQuality: <Wind className="w-5 h-5" />,
  temperature: <Thermometer className="w-5 h-5" />,
  humidity: <CloudRain className="w-5 h-5" />,
  population: <Users className="w-5 h-5" />,
  infrastructure: <Building2 className="w-5 h-5" />,
  network: <Router className="w-5 h-5" />,
  devices: <Laptop className="w-5 h-5" />,
  lighting: <Lightbulb className="w-5 h-5" />,
  sensors: <Cpu className="w-5 h-5" />,
};

type MetricKey = keyof typeof iconMap;

interface Metric {
  key: MetricKey;
  label: string;
  value: number;
  unit: string;
}

// Animation variants for staggered animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24,
    },
  },
};

const cardHoverVariants = {
  hover: {
    y: -5,
    boxShadow:
      "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
    transition: { duration: 0.3 },
  },
};

const pulseVariants = {
  pulse: {
    scale: [1, 1.05, 1],
    opacity: [0.7, 1, 0.7],
    transition: {
      duration: 2,
      repeat: Infinity,
      repeatType: "loop" as const,
    },
  },
};

export default function Dashboard() {
  const { socket, isConnected, connectionError, reconnect } = useWebSocket();
  const { addAlert } = useAlert();
  const [activeTab, setActiveTab] = useState("overview");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [theme, setTheme] = useState<string>("light");
  const refreshControls = useAnimation();
  const timeRef = useRef<NodeJS.Timeout | null>(null);
  const [hovered3DBuilding, setHovered3DBuilding] = useState<number | null>(
    null
  );
  const [isMobile, setIsMobile] = useState(false);
  const [cityImageIndex, setCityImageIndex] = useState(0);

  // Check for dark mode
  useEffect(() => {
    // Check if dark mode is active
    const isDarkMode = document.documentElement.classList.contains("dark");
    setTheme(isDarkMode ? "dark" : "light");

    // Listen for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          const isDarkMode =
            document.documentElement.classList.contains("dark");
          setTheme(isDarkMode ? "dark" : "light");
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });

    return () => observer.disconnect();
  }, []);

  // Show connection status when it changes
  useEffect(() => {
    if (connectionError) {
      addAlert({
        type: "error",
        title: "Connection Error",
        message: connectionError,
        duration: 10000,
      });
    } else if (isConnected) {
      addAlert({
        type: "success",
        title: "Connected",
        message: "Successfully connected to the Smart City system",
        duration: 3000,
      });
    }
  }, [isConnected, connectionError, addAlert]);

  // Update time every minute
  useEffect(() => {
    timeRef.current = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => {
      if (timeRef.current) clearInterval(timeRef.current);
    };
  }, []);

  const [metrics, setMetrics] = useState<Metric[]>([
    { key: "energy", label: "Energy Usage", value: 87, unit: "%" },
    { key: "water", label: "Water Quality", value: 92, unit: "%" },
    { key: "traffic", label: "Traffic Flow", value: 76, unit: "%" },
    { key: "airQuality", label: "Air Quality", value: 85, unit: "%" },
    { key: "temperature", label: "Temperature", value: 24, unit: "°C" },
    { key: "humidity", label: "Humidity", value: 45, unit: "%" },
    { key: "population", label: "Population Density", value: 82, unit: "%" },
    { key: "infrastructure", label: "Infrastructure", value: 93, unit: "%" },
    { key: "network", label: "Network Status", value: 95, unit: "%" },
    { key: "devices", label: "Connected Devices", value: 547, unit: "" },
    { key: "lighting", label: "Smart Lighting", value: 88, unit: "%" },
    { key: "sensors", label: "Sensors Online", value: 98, unit: "%" },
  ]);

  const [events, setEvents] = useState([
    {
      id: 1,
      type: "info",
      title: "System Update Scheduled",
      message: "A routine system update is scheduled for tonight at 2:00 AM.",
      time: "2 hours ago",
    },
    {
      id: 2,
      type: "warning",
      title: "High Traffic Alert",
      message: "Unusual traffic detected on Main Street and 5th Avenue",
      time: "45 minutes ago",
    },
    {
      id: 3,
      type: "success",
      title: "Energy Optimization Complete",
      message: "Smart grid optimization completed with 15% energy savings",
      time: "1 hour ago",
    },
    {
      id: 4,
      type: "error",
      title: "Sensor Malfunction",
      message: "Water quality sensor #347 requires maintenance",
      time: "15 minutes ago",
    },
  ]);

  // Simulated 'refresh data' function
  const refreshData = async () => {
    setIsLoading(true);
    await refreshControls.start({
      rotate: 360,
      transition: { duration: 1, ease: "linear" },
    });

    // Simulate data refresh with random values
    setMetrics((prev) =>
      prev.map((metric) => {
        if (metric.key === "devices") {
          return { ...metric, value: Math.floor(Math.random() * 100) + 500 };
        } else if (metric.key === "temperature") {
          return { ...metric, value: Math.floor(Math.random() * 10) + 20 };
        } else {
          return { ...metric, value: generateRandomPercentage() };
        }
      })
    );

    setTimeout(() => {
      setIsLoading(false);
      refreshControls.set({ rotate: 0 });
    }, 500);
  };

  // WebSocket event handling
  useEffect(() => {
    // Handler for sensor data updates
    const handleSensorUpdate = (data: any) => {
      console.log("Received sensor update:", data);
      // Update dashboard with sensor data
    };

    // Handler for system alerts
    const handleSystemAlert = (data: any) => {
      if (data && data.message) {
        addAlert({
          type: data.type || "info",
          title: data.title || "System Alert",
          message: data.message,
          duration: 5000,
        });
      }
    };

    // Add event listeners if socket is available
    if (socket) {
      socket.on("sensorUpdate", handleSensorUpdate);
      socket.on("systemAlert", handleSystemAlert);
    }

    // Cleanup function to remove event listeners
    return () => {
      if (socket) {
        socket.off("sensorUpdate", handleSensorUpdate);
        socket.off("systemAlert", handleSystemAlert);
      }
    };
  }, [socket, addAlert]);

  const getEventIcon = (type: string) => {
    switch (type) {
      case "info":
        return <Info className="w-5 h-5 text-blue-500" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "error":
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  // Extract and format key metrics for the 3D representation
  const keyMetrics = metrics.slice(0, 5);

  // Check if we're on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkMobile();

    // Add listener for resize
    window.addEventListener("resize", checkMobile);

    // Cleanup
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Function to navigate carousel
  const navigateCarousel = (direction: "next" | "prev") => {
    if (direction === "next") {
      setCityImageIndex((prev) => (prev + 1) % staticImages.length);
    } else {
      setCityImageIndex(
        (prev) => (prev - 1 + staticImages.length) % staticImages.length
      );
    }
  };

  return (
    <MainLayout>
      <div className="container px-4 py-6 mx-auto max-w-7xl">
        {/* Top bar with date and refresh */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <motion.div
            className="flex flex-wrap items-center gap-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md px-4 py-2 flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-primary-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                {currentTime.toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md px-4 py-2 flex items-center space-x-2">
              <Clock className="w-5 h-5 text-primary-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                {currentTime.toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </motion.div>

          <motion.button
            className="flex items-center justify-center space-x-2 bg-white dark:bg-gray-800 rounded-xl shadow-md px-4 py-2 text-primary-600 dark:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            onClick={refreshData}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <RefreshCw className="w-5 h-5" />
            <span className="font-medium">Refresh Data</span>
          </motion.button>
        </div>

        {/* Mobile City Visualization */}
        {isMobile && (
          <motion.div
            className="mb-6 relative rounded-lg overflow-hidden h-[200px]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50 z-10"></div>
            <div className="relative w-full h-full">
              <Image
                src={staticImages[cityImageIndex]}
                alt="Smart City Visualization"
                fill
                style={{ objectFit: "cover" }}
                priority
                unoptimized
              />
            </div>
            <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2 z-20">
              {staticImages.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index === cityImageIndex ? "bg-white" : "bg-white/50"
                  }`}
                  onClick={() => setCityImageIndex(index)}
                />
              ))}
            </div>
            <button
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/30 text-white p-1 rounded-full z-20"
              onClick={() => navigateCarousel("prev")}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/30 text-white p-1 rounded-full z-20"
              onClick={() => navigateCarousel("next")}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white z-20">
              <h2 className="text-xl font-bold">Smart City Dashboard</h2>
              <p className="text-sm opacity-80">
                Real-time monitoring and analytics
              </p>
            </div>
          </motion.div>
        )}

        {/* Dashboard Header */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.h1
            className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-blue-600 dark:from-primary-400 dark:to-blue-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Smart City Dashboard
          </motion.h1>
          <motion.p
            className="text-gray-600 dark:text-gray-300 mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            Real-time monitoring and analytics for your smart city
            infrastructure
          </motion.p>
        </motion.div>

        {/* Main Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - Key Metrics and 3D City */}
          <div className="lg:col-span-2 space-y-6">
            {/* 3D City Visualization */}
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <Building2 className="w-5 h-5 text-primary-500" />
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                    City Infrastructure
                  </h2>
                </div>
                <Link
                  href="/map"
                  className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 flex items-center text-sm font-medium"
                >
                  <span>Full Map</span>
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
              <div className="relative" style={{ height: "400px" }}>
                <CityModelViewer height="400px" isInteractive={true} />

                {/* Overlay key metrics on the 3D visualization */}
                <div className="absolute top-4 left-4 grid grid-cols-1 gap-2 w-64">
                  {keyMetrics.map((metric, index) => (
                    <motion.div
                      key={metric.key}
                      className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg p-2 shadow-md border border-gray-100 dark:border-gray-700"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 + 0.5, duration: 0.3 }}
                      whileHover={{ scale: 1.03 }}
                      onHoverStart={() => setHovered3DBuilding(index)}
                      onHoverEnd={() => setHovered3DBuilding(null)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div
                            className={`p-1.5 rounded-md ${getBgColor(
                              metric.value === 24 ? 80 : metric.value
                            )} bg-opacity-20`}
                          >
                            {iconMap[metric.key]}
                          </div>
                          <div className="ml-2">
                            <p className="text-xs font-medium text-gray-800 dark:text-gray-200">
                              {metric.label}
                            </p>
                            <p className="text-sm font-bold">
                              {metric.value}
                              {metric.unit}
                            </p>
                          </div>
                        </div>
                        <div
                          className={`h-2 w-12 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700`}
                        >
                          <motion.div
                            className={`h-full ${getBgColor(
                              metric.value === 24 ? 80 : metric.value
                            )}`}
                            initial={{ width: 0 }}
                            animate={{
                              width: `${
                                metric.value === 24 ? 80 : metric.value
                              }%`,
                            }}
                            transition={{
                              duration: 1,
                              delay: index * 0.1 + 0.7,
                            }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Key Performance Indicators */}
            <motion.div
              className="grid grid-cols-2 sm:grid-cols-4 gap-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {metrics.slice(0, 4).map((metric, index) => (
                <motion.div
                  key={metric.key}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700"
                  variants={itemVariants}
                  whileHover={cardHoverVariants.hover}
                  custom={index}
                >
                  <div className="p-4">
                    <div className="flex flex-col">
                      <div className="flex items-center space-x-2 mb-3">
                        <div
                          className={`p-2 rounded-lg ${getBgColor(
                            metric.value === 24 ? 80 : metric.value
                          )} bg-opacity-20`}
                        >
                          {iconMap[metric.key]}
                        </div>
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                          {metric.label}
                        </h3>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">
                          {metric.value}
                          {metric.unit}
                        </p>
                        <div className="flex items-center">
                          <motion.div
                            className={`w-2 h-2 rounded-full ${getBgColor(
                              metric.value === 24 ? 80 : metric.value
                            )} mr-2`}
                            animate={pulseVariants.pulse}
                          />
                          <p
                            className={`text-xs font-medium ${getStatusColor(
                              metric.value === 24 ? 80 : metric.value
                            )}`}
                          >
                            {metric.value >= 85
                              ? "Optimal"
                              : metric.value >= 70
                              ? "Good"
                              : "Attention"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <motion.div
                    className={`h-1 w-full ${getBgColor(
                      metric.value === 24 ? 80 : metric.value
                    )}`}
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                  />
                </motion.div>
              ))}
            </motion.div>

            {/* Performance Charts */}
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="p-4 border-b border-gray-100 dark:border-gray-700">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  Performance Metrics
                </h2>
              </div>
              <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Energy Usage Chart */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Energy Usage Trends
                    </h3>
                    <div className="flex items-center text-sm text-green-500">
                      <span>-12% </span>
                      <span className="ml-1">vs. last month</span>
                    </div>
                  </div>

                  <div className="h-60 flex items-end justify-between px-2">
                    {GRAPH_DATA.energy.map((value, index) => (
                      <motion.div
                        key={index}
                        className="w-full max-w-[24px] bg-gradient-to-t from-blue-600 to-indigo-600 rounded-t-sm mx-1"
                        style={{ height: `${value}%` }}
                        initial={{ height: 0 }}
                        animate={{ height: `${value}%` }}
                        transition={{ duration: 1, delay: index * 0.05 }}
                        whileHover={{
                          scale: 1.1,
                          transition: { duration: 0.2 },
                        }}
                      />
                    ))}
                  </div>

                  <div className="flex justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
                    <span>Jan</span>
                    <span>Feb</span>
                    <span>Mar</span>
                    <span>Apr</span>
                    <span>May</span>
                    <span>Jun</span>
                    <span>Jul</span>
                    <span>Aug</span>
                    <span>Sep</span>
                    <span>Oct</span>
                    <span>Nov</span>
                    <span>Dec</span>
                  </div>
                </div>

                {/* Water Consumption Chart */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Water Consumption
                    </h3>
                    <div className="flex items-center text-sm text-green-500">
                      <span>-8% </span>
                      <span className="ml-1">vs. last month</span>
                    </div>
                  </div>

                  <div className="h-60 flex items-end justify-between px-2">
                    {GRAPH_DATA.water.map((value, index) => (
                      <motion.div
                        key={index}
                        className="w-full max-w-[24px] bg-gradient-to-t from-cyan-500 to-blue-500 rounded-t-sm mx-1"
                        style={{ height: `${value}%` }}
                        initial={{ height: 0 }}
                        animate={{ height: `${value}%` }}
                        transition={{ duration: 1, delay: index * 0.05 }}
                        whileHover={{
                          scale: 1.1,
                          transition: { duration: 0.2 },
                        }}
                      />
                    ))}
                  </div>

                  <div className="flex justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
                    <span>Jan</span>
                    <span>Feb</span>
                    <span>Mar</span>
                    <span>Apr</span>
                    <span>May</span>
                    <span>Jun</span>
                    <span>Jul</span>
                    <span>Aug</span>
                    <span>Sep</span>
                    <span>Oct</span>
                    <span>Nov</span>
                    <span>Dec</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right column - Events and Status */}
          <div className="space-y-6">
            {/* System Status */}
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="p-4 border-b border-gray-100 dark:border-gray-700">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  System Status
                </h2>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-1 gap-4">
                  {metrics.slice(7, 12).map((metric, index) => (
                    <motion.div
                      key={metric.key}
                      className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-750 border border-gray-100 dark:border-gray-700"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                      whileHover={{
                        scale: 1.02,
                        backgroundColor:
                          theme === "dark" ? "#374151" : "#f9fafb",
                        transition: { duration: 0.2 },
                      }}
                    >
                      <div className="flex items-center">
                        <div
                          className={`p-2 rounded-lg ${getBgColor(
                            metric.value === 547 ? 85 : metric.value
                          )} bg-opacity-20`}
                        >
                          {iconMap[metric.key]}
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                            {metric.label}
                          </h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                            Last updated: 3 mins ago
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <p className="text-base font-bold mr-2">
                          {metric.value}
                          {metric.unit}
                        </p>
                        <div
                          className={`w-2 h-2 rounded-full ${getBgColor(
                            metric.value === 547 ? 85 : metric.value
                          )}`}
                        ></div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Recent Events */}
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  Recent Events
                </h2>
                <button className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 text-sm font-medium">
                  View All
                </button>
              </div>
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                <AnimatePresence initial={false}>
                  {events.map((event, index) => (
                    <motion.div
                      key={event.id}
                      className="p-4 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ delay: 0.5 + index * 0.1, duration: 0.3 }}
                    >
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mt-1">
                          {getEventIcon(event.type)}
                        </div>
                        <div className="ml-3 flex-1">
                          <div className="flex justify-between items-start">
                            <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                              {event.title}
                            </h3>
                            <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                              {event.time}
                            </span>
                          </div>
                          <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                            {event.message}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <div className="p-4 border-b border-gray-100 dark:border-gray-700">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  Quick Actions
                </h2>
              </div>
              <div className="p-4 grid grid-cols-2 gap-3">
                <Link href="/map">
                  <motion.div
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-4 rounded-xl shadow-md text-center"
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <MapPin className="w-6 h-6 mx-auto mb-2" />
                    <h3 className="text-sm font-semibold">Explore Map</h3>
                  </motion.div>
                </Link>

                <Link href="/analytics">
                  <motion.div
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-xl shadow-md text-center"
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <BarChart3 className="w-6 h-6 mx-auto mb-2" />
                    <h3 className="text-sm font-semibold">View Analytics</h3>
                  </motion.div>
                </Link>

                <Link href="/drone-surveillance">
                  <motion.div
                    className="bg-gradient-to-r from-amber-500 to-orange-500 text-white p-4 rounded-xl shadow-md text-center"
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Cpu className="w-6 h-6 mx-auto mb-2" />
                    <h3 className="text-sm font-semibold">Drone Control</h3>
                  </motion.div>
                </Link>

                <Link href="/report">
                  <motion.div
                    className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-4 rounded-xl shadow-md text-center"
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <AlertTriangle className="w-6 h-6 mx-auto mb-2" />
                    <h3 className="text-sm font-semibold">Report Issue</h3>
                  </motion.div>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
