"use client";

import React, { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import {
  Search,
  Filter,
  RefreshCw,
  Plus,
  Edit,
  Trash2,
  ArrowUpDown,
  AlertTriangle,
} from "lucide-react";

interface SensorData {
  _id: string;
  type: string;
  value: number;
  status: string;
  coordinates: [number, number];
  timestamp: string;
  metadata?: {
    deviceId: string;
    batteryLevel: number;
    manufacturer: string;
    model: string;
    firmwareVersion: string;
    lastMaintenance: string;
  };
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  lastActive: string;
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("sensors");
  const [sensors, setSensors] = useState<SensorData[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    column: string;
    direction: string;
  }>({ column: "", direction: "" });

  useEffect(() => {
    if (activeTab === "sensors") {
      fetchSensorData();
    } else if (activeTab === "users") {
      fetchUsers();
    }
  }, [activeTab]);

  const fetchSensorData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:3001/iot/sensor-data");
      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }
      const data = await response.json();
      setSensors(data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching sensor data:", error);
      setError("Failed to load sensor data. Using mock data instead.");

      // Mock data fallback
      const mockSensors = generateMockSensors();
      setSensors(mockSensors);
      setIsLoading(false);
    }
  };

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      // In a real app, this would fetch from an API endpoint
      // const response = await fetch("http://localhost:3001/auth/users");
      // const data = await response.json();
      // setUsers(data);

      // For demo purposes, using mock data
      const mockUsers = [
        {
          id: "1",
          name: "Admin User",
          email: "admin@smartcity.com",
          role: "admin",
          lastActive: new Date().toISOString(),
        },
        {
          id: "2",
          name: "John Operator",
          email: "john@smartcity.com",
          role: "operator",
          lastActive: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: "3",
          name: "Jane Analyst",
          email: "jane@smartcity.com",
          role: "analyst",
          lastActive: new Date(
            Date.now() - 2 * 24 * 60 * 60 * 1000
          ).toISOString(),
        },
        {
          id: "4",
          name: "Bob Viewer",
          email: "bob@smartcity.com",
          role: "viewer",
          lastActive: new Date(
            Date.now() - 5 * 24 * 60 * 60 * 1000
          ).toISOString(),
        },
        {
          id: "5",
          name: "Alice Supervisor",
          email: "alice@smartcity.com",
          role: "supervisor",
          lastActive: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        },
      ];
      setUsers(mockUsers);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Failed to load user data.");
      setIsLoading(false);
    }
  };

  const generateMockSensors = (): SensorData[] => {
    const mockData: SensorData[] = [];
    const types = ["air_quality", "traffic", "energy", "water", "noise"];
    const statuses = ["normal", "warning", "critical"];

    for (let i = 0; i < 25; i++) {
      const type = types[Math.floor(Math.random() * types.length)];
      const value = Math.floor(Math.random() * 1000);
      const status = statuses[Math.floor(Math.random() * statuses.length)];

      mockData.push({
        _id: `sensor-${i}`,
        type,
        value,
        status,
        coordinates: [-74.0 + Math.random() * 0.1, 40.7 + Math.random() * 0.1],
        timestamp: new Date(
          Date.now() - Math.random() * 86400000
        ).toISOString(),
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
          )}.${Math.floor(Math.random() * 10)}`,
          lastMaintenance: new Date(Date.now() - Math.random() * 30 * 86400000)
            .toISOString()
            .split("T")[0],
        },
      });
    }

    return mockData;
  };

  const handleSort = (column: string) => {
    let direction = "asc";
    if (sortConfig.column === column && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ column, direction });
  };

  const sortedData = () => {
    if (!sortConfig.column) return activeTab === "sensors" ? sensors : users;

    return [...(activeTab === "sensors" ? sensors : users)].sort((a, b) => {
      // @ts-ignore - dynamic access
      if (a[sortConfig.column] < b[sortConfig.column]) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      // @ts-ignore - dynamic access
      if (a[sortConfig.column] > b[sortConfig.column]) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  };

  const filteredData = () => {
    return sortedData().filter((item) => {
      const searchRegex = new RegExp(searchTerm, "i");
      if (activeTab === "sensors") {
        const sensor = item as SensorData;
        return (
          searchRegex.test(sensor.type) ||
          searchRegex.test(sensor.status) ||
          searchRegex.test(sensor._id) ||
          searchRegex.test(sensor.metadata?.deviceId || "")
        );
      } else {
        const user = item as User;
        return (
          searchRegex.test(user.name) ||
          searchRegex.test(user.email) ||
          searchRegex.test(user.role)
        );
      }
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Admin Dashboard
        </h1>

        {error && (
          <div className="mb-4 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-4 rounded-r">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" />
              <p className="text-yellow-700 dark:text-yellow-400">{error}</p>
            </div>
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg mb-6">
          <div className="flex border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
            <button
              onClick={() => setActiveTab("sensors")}
              className={`py-4 px-6 text-sm font-medium border-b-2 ${
                activeTab === "sensors"
                  ? "border-primary-500 text-primary-600 dark:text-primary-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              Sensor Management
            </button>
            <button
              onClick={() => setActiveTab("users")}
              className={`py-4 px-6 text-sm font-medium border-b-2 ${
                activeTab === "users"
                  ? "border-primary-500 text-primary-600 dark:text-primary-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              User Administration
            </button>
          </div>
        </div>

        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="relative w-full sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder={`Search ${
                activeTab === "sensors" ? "sensors" : "users"
              }...`}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-primary-500 focus:border-primary-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            <button
              onClick={() =>
                activeTab === "sensors" ? fetchSensorData() : fetchUsers()
              }
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </button>
            <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
              <Plus className="h-4 w-4 mr-2" />
              Add {activeTab === "sensors" ? "Sensor" : "User"}
            </button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {activeTab === "sensors"
                ? "Sensor Management"
                : "User Administration"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex flex-col justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mb-4"></div>
                <p className="text-gray-500 dark:text-gray-400">
                  Loading data...
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto -mx-4 sm:-mx-0">
                {activeTab === "sensors" ? (
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 table-fixed sm:table-auto">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                          onClick={() => handleSort("_id")}
                        >
                          <div className="flex items-center">
                            ID
                            <ArrowUpDown className="h-4 w-4 ml-1" />
                          </div>
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                          onClick={() => handleSort("type")}
                        >
                          <div className="flex items-center">
                            Type
                            <ArrowUpDown className="h-4 w-4 ml-1" />
                          </div>
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                          onClick={() => handleSort("value")}
                        >
                          <div className="flex items-center">
                            Value
                            <ArrowUpDown className="h-4 w-4 ml-1" />
                          </div>
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                          onClick={() => handleSort("status")}
                        >
                          <div className="flex items-center">
                            Status
                            <ArrowUpDown className="h-4 w-4 ml-1" />
                          </div>
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                          onClick={() => handleSort("timestamp")}
                        >
                          <div className="flex items-center">
                            Last Updated
                            <ArrowUpDown className="h-4 w-4 ml-1" />
                          </div>
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                        >
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                      {filteredData().length > 0 ? (
                        filteredData().map((sensor: any) => (
                          <tr
                            key={sensor._id}
                            className="hover:bg-gray-50 dark:hover:bg-gray-800"
                          >
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                              {sensor._id}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              {sensor.type.replace("_", " ")}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              {sensor.value}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  sensor.status === "normal"
                                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                    : sensor.status === "warning"
                                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                                    : sensor.status === "critical"
                                    ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                                    : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
                                }`}
                              >
                                {sensor.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              {formatDate(sensor.timestamp)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <div className="flex space-x-2">
                                <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                                  <Edit className="h-4 w-4" />
                                </button>
                                <button className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300">
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={6}
                            className="px-6 py-16 text-center text-gray-500 dark:text-gray-400"
                          >
                            No sensor data found.{" "}
                            {searchTerm ? "Try adjusting your search." : ""}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                ) : (
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 table-fixed sm:table-auto">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                          onClick={() => handleSort("id")}
                        >
                          <div className="flex items-center">
                            ID
                            <ArrowUpDown className="h-4 w-4 ml-1" />
                          </div>
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                          onClick={() => handleSort("name")}
                        >
                          <div className="flex items-center">
                            Name
                            <ArrowUpDown className="h-4 w-4 ml-1" />
                          </div>
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                          onClick={() => handleSort("email")}
                        >
                          <div className="flex items-center">
                            Email
                            <ArrowUpDown className="h-4 w-4 ml-1" />
                          </div>
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                          onClick={() => handleSort("role")}
                        >
                          <div className="flex items-center">
                            Role
                            <ArrowUpDown className="h-4 w-4 ml-1" />
                          </div>
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                          onClick={() => handleSort("lastActive")}
                        >
                          <div className="flex items-center">
                            Last Active
                            <ArrowUpDown className="h-4 w-4 ml-1" />
                          </div>
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                        >
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                      {filteredData().length > 0 ? (
                        filteredData().map((user: any) => (
                          <tr
                            key={user.id}
                            className="hover:bg-gray-50 dark:hover:bg-gray-800"
                          >
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                              {user.id}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              {user.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              {user.email}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  user.role === "admin"
                                    ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                                    : user.role === "operator"
                                    ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                                    : user.role === "analyst"
                                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                    : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
                                }`}
                              >
                                {user.role}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              {formatDate(user.lastActive)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <div className="flex space-x-2">
                                <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                                  <Edit className="h-4 w-4" />
                                </button>
                                <button className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300">
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={6}
                            className="px-6 py-16 text-center text-gray-500 dark:text-gray-400"
                          >
                            No users found.{" "}
                            {searchTerm ? "Try adjusting your search." : ""}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
