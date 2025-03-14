"use client";

import React, { useState, useEffect } from "react";
import {
  ChevronDown,
  ChevronUp,
  Filter,
  RefreshCw,
  Search,
} from "lucide-react";

interface Sensor {
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

const SensorTable: React.FC = () => {
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortField, setSortField] = useState<
    keyof Sensor | "metadata.deviceId" | "metadata.batteryLevel"
  >("timestamp");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  useEffect(() => {
    const fetchSensors = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:3001/iot/sensor-data");
        if (!response.ok) {
          throw new Error(`API responded with status: ${response.status}`);
        }
        const data = await response.json();
        setSensors(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching sensor data:", error);
        setError("Failed to load sensor data. Using mock data instead.");

        // Use mock data as fallback
        const mockData = generateMockSensorData();
        setSensors(mockData);
        setLoading(false);
      }
    };

    fetchSensors();
  }, []);

  // Generate mock sensor data
  const generateMockSensorData = (): Sensor[] => {
    const mockData: Sensor[] = [];
    const types = ["air_quality", "traffic", "energy", "water", "noise"];
    const statuses: ("normal" | "warning" | "critical")[] = [
      "normal",
      "warning",
      "critical",
    ];

    for (let i = 0; i < 20; i++) {
      const type = types[Math.floor(Math.random() * types.length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const value = Math.floor(Math.random() * 1000);

      mockData.push({
        _id: `sensor-${i}`,
        type,
        value,
        status,
        coordinates: [
          -74.006 + Math.random() * 0.03 - 0.015,
          40.7128 + Math.random() * 0.03 - 0.015,
        ],
        timestamp: new Date(
          Date.now() - Math.random() * 86400000 * 7
        ).toISOString(), // Random time in the last 7 days
        metadata: {
          deviceId: `device-${Math.floor(Math.random() * 1000)}`,
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

  // Sort and filter the sensor data
  const sortAndFilterSensors = () => {
    let filtered = [...sensors];

    // Apply type filter
    if (typeFilter) {
      filtered = filtered.filter((sensor) => sensor.type === typeFilter);
    }

    // Apply status filter
    if (statusFilter) {
      filtered = filtered.filter((sensor) => sensor.status === statusFilter);
    }

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (sensor) =>
          sensor.type.toLowerCase().includes(query) ||
          sensor.metadata.deviceId.toLowerCase().includes(query) ||
          (sensor.metadata.manufacturer &&
            sensor.metadata.manufacturer.toLowerCase().includes(query))
      );
    }

    // Sort data
    return filtered.sort((a, b) => {
      let aValue: any = a[sortField as keyof Sensor];
      let bValue: any = b[sortField as keyof Sensor];

      // Handle nested metadata fields
      if (sortField === "metadata.deviceId") {
        aValue = a.metadata.deviceId;
        bValue = b.metadata.deviceId;
      } else if (sortField === "metadata.batteryLevel") {
        aValue = a.metadata.batteryLevel;
        bValue = b.metadata.batteryLevel;
      }

      // Default to string comparison
      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      // Number comparison
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
    });
  };

  // Handle sort change
  const handleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Format date to local string
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleString();
  };

  // Get all unique sensor types for filter
  const sensorTypes = Array.from(new Set(sensors.map((sensor) => sensor.type)));

  // Get status chip style based on status
  const getStatusChipStyle = (status: string) => {
    switch (status) {
      case "critical":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      case "warning":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      default:
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
    }
  };

  // Get sensor value unit based on type
  const getSensorUnit = (type: string): string => {
    switch (type) {
      case "air_quality":
        return "AQI";
      case "traffic":
        return "veh/h";
      case "energy":
        return "kWh";
      case "water":
        return "L/min";
      case "noise":
        return "dB";
      default:
        return "units";
    }
  };

  // Reset all filters
  const resetFilters = () => {
    setTypeFilter(null);
    setStatusFilter(null);
    setSearchQuery("");
    setSortField("timestamp");
    setSortDirection("desc");
  };

  // Get sorted and filtered sensors
  const filteredSensors = sortAndFilterSensors();

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
            Sensor Data
          </h2>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={resetFilters}
              className="flex items-center text-xs sm:text-sm text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              Reset
            </button>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                <Search className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search sensors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1 text-xs sm:text-sm bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>
          </div>
        </div>

        {/* Filter bar - scrollable on mobile */}
        <div className="mt-3 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 flex gap-2 sm:gap-3">
          <div className="flex items-center whitespace-nowrap">
            <Filter className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 dark:text-gray-400 mr-1" />
            <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mr-2">
              Filters:
            </span>
          </div>

          {/* Type filter dropdown */}
          <div className="relative inline-block">
            <select
              value={typeFilter || ""}
              onChange={(e) => setTypeFilter(e.target.value || null)}
              className="text-xs sm:text-sm bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded py-1 pl-2 pr-8 text-gray-700 dark:text-gray-200 appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary-500"
            >
              <option value="">All Types</option>
              {sensorTypes.map((type) => (
                <option key={type} value={type}>
                  {type
                    .replace("_", " ")
                    .replace(/\b\w/g, (l: string) => l.toUpperCase())}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500 dark:text-gray-400">
              <ChevronDown className="h-3 w-3" />
            </div>
          </div>

          {/* Status filter dropdown */}
          <div className="relative inline-block">
            <select
              value={statusFilter || ""}
              onChange={(e) => setStatusFilter(e.target.value || null)}
              className="text-xs sm:text-sm bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded py-1 pl-2 pr-8 text-gray-700 dark:text-gray-200 appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary-500"
            >
              <option value="">All Status</option>
              <option value="normal">Normal</option>
              <option value="warning">Warning</option>
              <option value="critical">Critical</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500 dark:text-gray-400">
              <ChevronDown className="h-3 w-3" />
            </div>
          </div>
        </div>
      </div>

      {/* Table with horizontal scroll on mobile */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-750">
            <tr>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("type")}
              >
                <div className="flex items-center">
                  Type
                  {sortField === "type" &&
                    (sortDirection === "asc" ? (
                      <ChevronUp className="ml-1 h-4 w-4" />
                    ) : (
                      <ChevronDown className="ml-1 h-4 w-4" />
                    ))}
                </div>
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("value")}
              >
                <div className="flex items-center">
                  Value
                  {sortField === "value" &&
                    (sortDirection === "asc" ? (
                      <ChevronUp className="ml-1 h-4 w-4" />
                    ) : (
                      <ChevronDown className="ml-1 h-4 w-4" />
                    ))}
                </div>
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("status")}
              >
                <div className="flex items-center">
                  Status
                  {sortField === "status" &&
                    (sortDirection === "asc" ? (
                      <ChevronUp className="ml-1 h-4 w-4" />
                    ) : (
                      <ChevronDown className="ml-1 h-4 w-4" />
                    ))}
                </div>
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("metadata.deviceId")}
              >
                <div className="flex items-center">
                  Device ID
                  {sortField === "metadata.deviceId" &&
                    (sortDirection === "asc" ? (
                      <ChevronUp className="ml-1 h-4 w-4" />
                    ) : (
                      <ChevronDown className="ml-1 h-4 w-4" />
                    ))}
                </div>
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("metadata.batteryLevel")}
              >
                <div className="flex items-center">
                  Battery
                  {sortField === "metadata.batteryLevel" &&
                    (sortDirection === "asc" ? (
                      <ChevronUp className="ml-1 h-4 w-4" />
                    ) : (
                      <ChevronDown className="ml-1 h-4 w-4" />
                    ))}
                </div>
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer whitespace-nowrap"
                onClick={() => handleSort("timestamp")}
              >
                <div className="flex items-center">
                  Last Update
                  {sortField === "timestamp" &&
                    (sortDirection === "asc" ? (
                      <ChevronUp className="ml-1 h-4 w-4" />
                    ) : (
                      <ChevronDown className="ml-1 h-4 w-4" />
                    ))}
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center">
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary-500"></div>
                  </div>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    Loading sensors...
                  </p>
                </td>
              </tr>
            ) : error && filteredSensors.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-4 text-center text-sm text-gray-500 dark:text-gray-400"
                >
                  {error}
                </td>
              </tr>
            ) : filteredSensors.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-4 text-center text-sm text-gray-500 dark:text-gray-400"
                >
                  No sensors found matching your filters.
                </td>
              </tr>
            ) : (
              filteredSensors.map((sensor) => (
                <tr
                  key={sensor._id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-750"
                >
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white capitalize">
                      {sensor.type.replace("_", " ")}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-xs sm:text-sm text-gray-900 dark:text-white">
                      {sensor.value} {getSensorUnit(sensor.type)}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-medium rounded-full ${getStatusChipStyle(
                        sensor.status
                      )}`}
                    >
                      {sensor.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                    {sensor.metadata.deviceId}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="relative h-1.5 w-16 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className={`absolute top-0 left-0 h-full ${
                            sensor.metadata.batteryLevel > 70
                              ? "bg-green-500"
                              : sensor.metadata.batteryLevel > 30
                              ? "bg-yellow-500"
                              : "bg-red-500"
                          }`}
                          style={{ width: `${sensor.metadata.batteryLevel}%` }}
                        ></div>
                      </div>
                      <span className="ml-2 text-xs text-gray-600 dark:text-gray-400">
                        {sensor.metadata.batteryLevel}%
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(sensor.timestamp)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-750 sm:px-6">
        <div className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">
          Showing <span className="font-medium">{filteredSensors.length}</span>{" "}
          of <span className="font-medium">{sensors.length}</span> sensors
        </div>
      </div>
    </div>
  );
};

export default SensorTable;
