"use client";

import React, { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface SensorData {
  id: string;
  type: string;
  value: number;
  status: string;
  location: {
    coordinates: [number, number];
    address?: string;
  };
  lastUpdated: string;
  batteryLevel: number;
  metadata?: {
    deviceId: string;
    manufacturer: string;
    model: string;
    firmwareVersion: string;
    lastMaintenance: string;
  };
}

interface AggregatedData {
  name: string;
  count: number;
}

interface StatusData {
  name: string;
  value: number;
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];
const SENSOR_TYPES = ["air-quality", "traffic", "weather", "water", "noise"];

export default function AnalyticsPage() {
  const [sensorData, setSensorData] = useState<SensorData[]>([]);
  const [aggregatedData, setAggregatedData] = useState<AggregatedData[]>([]);
  const [batteryStats, setBatteryStats] = useState<AggregatedData[]>([]);
  const [statusStats, setStatusStats] = useState<StatusData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSensorData = async () => {
      try {
        const response = await fetch("http://localhost:3001/iot/sensor-data");
        if (!response.ok) {
          throw new Error("Failed to fetch sensor data");
        }
        const data = await response.json();
        setSensorData(data);
        processData(data);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching sensor data:", err);
        setError("Failed to load sensor data. Using mock data instead.");

        // Use mock data as fallback
        const mockData = generateMockSensorData();
        setSensorData(mockData);
        processData(mockData);
        setIsLoading(false);
      }
    };

    fetchSensorData();
  }, []);

  const processData = (data: SensorData[]) => {
    // Process for sensor type distribution
    const typeCounts = SENSOR_TYPES.map((type) => {
      const count = data.filter((sensor) => sensor.type === type).length;
      return {
        name: type,
        count,
      };
    });
    setAggregatedData(typeCounts);

    // Process for battery level statistics
    const batteryRanges: AggregatedData[] = [
      { name: "< 20%", count: 0 },
      { name: "20-40%", count: 0 },
      { name: "40-60%", count: 0 },
      { name: "60-80%", count: 0 },
      { name: "80-100%", count: 0 },
    ];

    data.forEach((sensor) => {
      const level = sensor.batteryLevel;
      if (level < 20) batteryRanges[0].count++;
      else if (level < 40) batteryRanges[1].count++;
      else if (level < 60) batteryRanges[2].count++;
      else if (level < 80) batteryRanges[3].count++;
      else batteryRanges[4].count++;
    });
    setBatteryStats(batteryRanges);

    // Process for status distribution
    const statusCounts: StatusData[] = [
      { name: "normal", value: 0 },
      { name: "warning", value: 0 },
      { name: "critical", value: 0 },
      { name: "offline", value: 0 },
    ];

    data.forEach((sensor) => {
      const status = sensor.status.toLowerCase();
      const index = statusCounts.findIndex((s) => s.name === status);
      if (index !== -1) {
        statusCounts[index].value++;
      }
    });
    setStatusStats(statusCounts);
  };

  // Generate mock sensor data if API fails
  const generateMockSensorData = (): SensorData[] => {
    const mockData: SensorData[] = [];

    for (let i = 0; i < 50; i++) {
      const type =
        SENSOR_TYPES[Math.floor(Math.random() * SENSOR_TYPES.length)];
      const value = Math.floor(Math.random() * 100);

      let status = "normal";
      if (value > 80) status = "critical";
      else if (value > 60) status = "warning";
      else if (i % 10 === 0) status = "offline";

      mockData.push({
        id: `sensor-${i}`,
        type,
        value,
        status,
        location: {
          coordinates: [
            -73.9 + Math.random() * 0.1,
            40.7 + Math.random() * 0.1,
          ],
          address: `${Math.floor(Math.random() * 1000)} Main St`,
        },
        lastUpdated: new Date(
          Date.now() - Math.random() * 86400000
        ).toISOString(),
        batteryLevel: Math.floor(Math.random() * 100),
        metadata: {
          deviceId: `D${1000 + i}`,
          manufacturer: "SmartSense",
          model: "SSv2",
          firmwareVersion: "1.2.3",
          lastMaintenance: new Date(
            Date.now() - Math.random() * 7776000000
          ).toISOString(),
        },
      });
    }

    return mockData;
  };

  return (
    <MainLayout>
      <div className="p-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          City Analytics Dashboard
        </h1>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        ) : error ? (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-4 mb-6">
            <p className="text-yellow-700 dark:text-yellow-400">{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Sensor Distribution Chart */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                Sensor Type Distribution
              </h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={aggregatedData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="name"
                      angle={-45}
                      textAnchor="end"
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="count"
                      name="Number of Sensors"
                      fill="#4F46E5"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Sensor Status Distribution */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                Sensor Status Distribution
              </h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusStats}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({
                        name,
                        percent,
                      }: {
                        name: string;
                        percent: number;
                      }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {statusStats.map((entry: StatusData, index: number) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            entry.name === "normal"
                              ? "#10B981"
                              : entry.name === "warning"
                              ? "#F59E0B"
                              : entry.name === "critical"
                              ? "#EF4444"
                              : "#6B7280"
                          }
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Battery Level Distribution */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                Battery Level Distribution
              </h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={batteryStats}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="count"
                      name="Number of Devices"
                      fill="#3B82F6"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recent Sensor Readings */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                Critical Sensors
              </h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Sensor ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Value
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {sensorData
                      .filter((sensor) => sensor.status === "critical")
                      .slice(0, 5)
                      .map((sensor) => (
                        <tr key={sensor.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                            {sensor.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                            {sensor.type}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                            {sensor.value}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                              {sensor.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    {sensorData.filter((sensor) => sensor.status === "critical")
                      .length === 0 && (
                      <tr>
                        <td
                          colSpan={4}
                          className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 text-center"
                        >
                          No critical sensors found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
