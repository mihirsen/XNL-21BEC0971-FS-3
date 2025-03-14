"use client";

import React, { useState, useEffect } from "react";
import CityMap from "@/components/dashboard/CityMap";
import MainLayout from "@/components/layout/MainLayout";
import {
  ChevronDown,
  Map,
  Layers,
  Filter,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Building,
  Car,
  Wind,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

// Use static data URLs for images instead of external or local files
const staticImages = Array(5).fill(
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiMzNDk4ZGIiIHN0b3Atb3BhY2l0eT0iMSIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iIzM0NDk1ZSIgc3RvcC1vcGFjaXR5PSIxIi8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjgwMCIgaGVpZ2h0PSI0MDAiIGZpbGw9InVybCgjZykiLz48dGV4dCB4PSI0MDAiIHk9IjIwMCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjI0IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgYWxpZ25tZW50LWJhc2VsaW5lPSJtaWRkbGUiPlNtYXJ0IENpdHkgSW1hZ2U8L3RleHQ+PC9zdmc+"
);

interface MapFilter {
  id: string;
  name: string;
  checked: boolean;
  color: string;
}

// Types for map statistics
interface MapStat {
  id: string;
  name: string;
  value: string;
  status: "up" | "warning" | "down";
}

// Types for key locations
interface KeyLocation {
  id: string;
  name: string;
  description: string;
  coordinates: [number, number];
  icon: React.ReactNode;
}

// Map statistics data
const stats: MapStat[] = [
  { id: "sensors", name: "Active Sensors", value: "245", status: "up" },
  { id: "traffic", name: "Traffic Flow", value: "Moderate", status: "warning" },
  { id: "air", name: "Air Quality", value: "Good", status: "up" },
  { id: "energy", name: "Energy Usage", value: "Optimal", status: "up" },
  { id: "alerts", name: "Active Alerts", value: "3", status: "warning" },
];

// Key locations data
const locations: KeyLocation[] = [
  {
    id: "downtown",
    name: "Downtown Area",
    description: "Central business district with high activity",
    coordinates: [-74.006, 40.7128],
    icon: <Building className="w-5 h-5 text-gray-600 dark:text-gray-300" />,
  },
  {
    id: "north",
    name: "North Park",
    description: "Recreational area with air quality sensors",
    coordinates: [-73.98, 40.73],
    icon: <Wind className="w-5 h-5 text-gray-600 dark:text-gray-300" />,
  },
  {
    id: "west",
    name: "West Highway",
    description: "Major traffic monitoring zone",
    coordinates: [-74.03, 40.72],
    icon: <Car className="w-5 h-5 text-gray-600 dark:text-gray-300" />,
  },
  {
    id: "east",
    name: "East Industrial",
    description: "Industrial zone with energy monitoring",
    coordinates: [-73.97, 40.71],
    icon: <Building className="w-5 h-5 text-gray-600 dark:text-gray-300" />,
  },
];

// Simple mobile carousel component
const MobileCarousel: React.FC<{
  onLocationSelect: (coordinates: [number, number]) => void;
}> = ({ onLocationSelect }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextLocation = () => {
    const newIndex = (currentIndex + 1) % locations.length;
    setCurrentIndex(newIndex);
    onLocationSelect(locations[newIndex].coordinates);
  };

  const prevLocation = () => {
    const newIndex = (currentIndex - 1 + locations.length) % locations.length;
    setCurrentIndex(newIndex);
    onLocationSelect(locations[newIndex].coordinates);
  };

  const location = locations[currentIndex];

  // Select the first location when the component mounts
  useEffect(() => {
    onLocationSelect(location.coordinates);
  }, [onLocationSelect, location.coordinates]); // Only run once on mount

  return (
    <div className="relative p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
      <div className="flex items-center mb-2">
        <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center mr-2">
          {location.icon}
        </div>
        <h3 className="font-medium">{location.name}</h3>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
        {location.description}
      </p>

      <div className="flex justify-between mt-2">
        <button
          onClick={prevLocation}
          className="px-3 py-1 bg-gray-200 dark:bg-gray-600 rounded-lg text-sm"
        >
          Previous
        </button>
        <span className="text-xs text-gray-500 dark:text-gray-400 self-center">
          {currentIndex + 1} of {locations.length}
        </span>
        <button
          onClick={nextLocation}
          className="px-3 py-1 bg-gray-200 dark:bg-gray-600 rounded-lg text-sm"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default function MapPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [sensorFilters, setSensorFilters] = useState<MapFilter[]>([
    {
      id: "air-quality",
      name: "Air Quality",
      checked: true,
      color: "bg-green-500",
    },
    { id: "weather", name: "Weather", checked: true, color: "bg-blue-500" },
    { id: "traffic", name: "Traffic", checked: true, color: "bg-amber-500" },
    { id: "water", name: "Water", checked: true, color: "bg-cyan-500" },
    { id: "noise", name: "Noise", checked: true, color: "bg-purple-500" },
  ]);
  const [selectedLocation, setSelectedLocation] = useState<
    [number, number] | undefined
  >(undefined);

  useEffect(() => {
    // Check if we're on mobile
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
      setCurrentImageIndex((prev) => (prev + 1) % staticImages.length);
    } else {
      setCurrentImageIndex(
        (prev) => (prev - 1 + staticImages.length) % staticImages.length
      );
    }
  };

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const toggleFilter = (id: string) => {
    setSensorFilters(
      sensorFilters.map((filter) =>
        filter.id === id ? { ...filter, checked: !filter.checked } : filter
      )
    );
  };

  const activeFilters = sensorFilters.filter((f) => f.checked).map((f) => f.id);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
  };

  const filterVariants = {
    closed: { height: 0, opacity: 0 },
    open: { height: "auto", opacity: 1, transition: { duration: 0.3 } },
  };

  // Function to handle location click
  const handleLocationClick = (coordinates: [number, number]) => {
    console.log("Location clicked:", coordinates);
    setSelectedLocation(coordinates);
  };

  return (
    <MainLayout>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">City Map Overview</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map section - takes up more space */}
          <div className="lg:col-span-2 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-md h-[500px] sm:h-[600px] md:h-[700px]">
            <CityMap centerCoordinates={selectedLocation} />
          </div>

          {/* Sidebar content */}
          <div className="space-y-6">
            {/* Map statistics */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-md">
              <h2 className="text-lg font-semibold mb-4">Map Statistics</h2>
              <div className="space-y-4">
                {stats.map((stat) => (
                  <div
                    key={stat.id}
                    className="flex justify-between items-center"
                  >
                    <div className="flex items-center">
                      <div
                        className={`w-3 h-3 rounded-full mr-2 ${
                          stat.status === "up"
                            ? "bg-green-500"
                            : stat.status === "warning"
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }`}
                      ></div>
                      <span className="text-gray-700 dark:text-gray-300">
                        {stat.name}
                      </span>
                    </div>
                    <span className="font-medium">{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile carousel for key locations */}
            <div className="md:hidden bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-md">
              <h2 className="text-lg font-semibold mb-4">Key Locations</h2>
              <MobileCarousel onLocationSelect={handleLocationClick} />
            </div>

            {/* Desktop key locations */}
            <div className="hidden md:block bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-md">
              <h2 className="text-lg font-semibold mb-4">Key Locations</h2>
              <div className="space-y-4">
                {locations.map((location) => (
                  <div
                    key={location.id}
                    className="flex items-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded-lg transition-colors"
                    onClick={() => handleLocationClick(location.coordinates)}
                  >
                    <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center mr-3">
                      {location.icon}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800 dark:text-gray-200">
                        {location.name}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {location.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
