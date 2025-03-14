"use client";

import React, { useState, useEffect } from "react";
import { Bell, AlertTriangle, Clock, ArrowUpCircle, Info } from "lucide-react";

// Alert interface
interface Alert {
  id: string;
  title: string;
  message: string;
  severity: "critical" | "warning" | "info";
  timestamp: string;
  isRead: boolean;
  source: string;
}

const AlertsList: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [activeFilter, setActiveFilter] = useState<
    "all" | "unread" | "critical" | "warning" | "info"
  >("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch alerts from API or use mock data
  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        setLoading(true);
        // This would be replaced with a real API call
        // const response = await fetch("/api/alerts");
        // const data = await response.json();

        // For now, use mock data
        const mockAlerts = generateMockAlerts(15);
        setTimeout(() => {
          setAlerts(mockAlerts);
          setLoading(false);
        }, 800); // Simulated delay
      } catch (err) {
        console.error("Error fetching alerts:", err);
        setError("Failed to load alerts. Please try again later.");
        setLoading(false);
      }
    };

    fetchAlerts();
  }, []);

  // Generate mock alerts for demo
  const generateMockAlerts = (count: number): Alert[] => {
    const mockAlerts: Alert[] = [];
    const sources = [
      "Air Quality Sensor",
      "Traffic Sensor",
      "Energy Grid",
      "Weather Station",
      "Water System",
    ];
    const criticalTitles = [
      "High Pollution Detected",
      "Critical Traffic Congestion",
      "Power Grid Overload",
      "Severe Weather Alert",
      "Water Quality Critical",
    ];
    const warningTitles = [
      "Moderate Air Quality",
      "Increasing Traffic",
      "Energy Usage Peak",
      "Weather Advisory",
      "Water Pressure Low",
    ];
    const infoTitles = [
      "Air Quality Update",
      "Traffic Flow Normal",
      "Energy Consumption Report",
      "Weather Conditions",
      "Water System Maintenance",
    ];

    const severities: ("critical" | "warning" | "info")[] = [
      "critical",
      "warning",
      "info",
    ];

    for (let i = 0; i < count; i++) {
      const severity =
        severities[Math.floor(Math.random() * severities.length)];
      const source = sources[Math.floor(Math.random() * sources.length)];

      let title = "";
      switch (severity) {
        case "critical":
          title =
            criticalTitles[Math.floor(Math.random() * criticalTitles.length)];
          break;
        case "warning":
          title =
            warningTitles[Math.floor(Math.random() * warningTitles.length)];
          break;
        case "info":
          title = infoTitles[Math.floor(Math.random() * infoTitles.length)];
          break;
      }

      mockAlerts.push({
        id: `alert-${i}`,
        title,
        message: `This is a ${severity} alert from the ${source.toLowerCase()} system.`,
        severity,
        timestamp: new Date(
          Date.now() - Math.random() * 86400000 * 3
        ).toISOString(), // Random time in the last 3 days
        isRead: Math.random() > 0.6, // 40% chance of being unread
        source,
      });
    }

    // Sort by unread first, then timestamp (newest first)
    return mockAlerts.sort((a, b) => {
      if (a.isRead !== b.isRead) {
        return a.isRead ? 1 : -1;
      }
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });
  };

  // Mark an alert as read
  const markAsRead = (alertId: string) => {
    setAlerts(
      alerts.map((alert) =>
        alert.id === alertId ? { ...alert, isRead: true } : alert
      )
    );
  };

  // Filter alerts based on active filter
  const filteredAlerts = alerts.filter((alert) => {
    switch (activeFilter) {
      case "unread":
        return !alert.isRead;
      case "critical":
        return alert.severity === "critical";
      case "warning":
        return alert.severity === "warning";
      case "info":
        return alert.severity === "info";
      default:
        return true;
    }
  });

  // Format relative time from an ISO timestamp
  const getRelativeTime = (timestamp: string): string => {
    const msPerMinute = 60 * 1000;
    const msPerHour = msPerMinute * 60;
    const msPerDay = msPerHour * 24;

    const elapsed = Date.now() - new Date(timestamp).getTime();

    if (elapsed < msPerMinute) {
      const seconds = Math.floor(elapsed / 1000);
      return `${seconds} ${seconds === 1 ? "second" : "seconds"} ago`;
    } else if (elapsed < msPerHour) {
      const minutes = Math.floor(elapsed / msPerMinute);
      return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
    } else if (elapsed < msPerDay) {
      const hours = Math.floor(elapsed / msPerHour);
      return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
    } else {
      const days = Math.floor(elapsed / msPerDay);
      return `${days} ${days === 1 ? "day" : "days"} ago`;
    }
  };

  // Get icon for alert severity
  const getAlertIcon = (severity: string) => {
    switch (severity) {
      case "critical":
        return (
          <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-full">
            <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />
          </div>
        );
      case "warning":
        return (
          <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
            <Bell className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
          </div>
        );
      case "info":
      default:
        return (
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
            <Info className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
        );
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
            Recent Alerts
          </h2>
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300">
            {alerts.filter((a) => !a.isRead).length} Unread
          </span>
        </div>

        {/* Filter tabs - horizontal scrollable on mobile */}
        <div className="mt-3 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 flex space-x-2 sm:space-x-3">
          <button
            onClick={() => setActiveFilter("all")}
            className={`whitespace-nowrap px-3 py-1.5 text-xs sm:text-sm rounded-lg ${
              activeFilter === "all"
                ? "bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setActiveFilter("unread")}
            className={`whitespace-nowrap px-3 py-1.5 text-xs sm:text-sm rounded-lg ${
              activeFilter === "unread"
                ? "bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            Unread
          </button>
          <button
            onClick={() => setActiveFilter("critical")}
            className={`whitespace-nowrap px-3 py-1.5 text-xs sm:text-sm rounded-lg flex items-center ${
              activeFilter === "critical"
                ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            <AlertTriangle className="w-3 h-3 mr-1" />
            Critical
          </button>
          <button
            onClick={() => setActiveFilter("warning")}
            className={`whitespace-nowrap px-3 py-1.5 text-xs sm:text-sm rounded-lg flex items-center ${
              activeFilter === "warning"
                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            <Bell className="w-3 h-3 mr-1" />
            Warning
          </button>
          <button
            onClick={() => setActiveFilter("info")}
            className={`whitespace-nowrap px-3 py-1.5 text-xs sm:text-sm rounded-lg flex items-center ${
              activeFilter === "info"
                ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            <Info className="w-3 h-3 mr-1" />
            Info
          </button>
        </div>
      </div>

      {/* Alert list */}
      <div className="divide-y divide-gray-200 dark:divide-gray-700 max-h-[400px] sm:max-h-[500px] overflow-y-auto">
        {loading ? (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary-500"></div>
          </div>
        ) : error ? (
          <div className="p-4 text-center text-gray-500 dark:text-gray-400">
            {error}
          </div>
        ) : filteredAlerts.length === 0 ? (
          <div className="p-4 text-center text-gray-500 dark:text-gray-400">
            No alerts to display.
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-3 sm:p-4 hover:bg-gray-50 dark:hover:bg-gray-750 ${
                !alert.isRead ? "bg-blue-50/50 dark:bg-blue-900/10" : ""
              }`}
              onClick={() => markAsRead(alert.id)}
            >
              <div className="flex items-start sm:items-center">
                {/* Alert icon */}
                <div className="flex-shrink-0 mr-3">
                  {getAlertIcon(alert.severity)}
                </div>

                {/* Alert content */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <p
                      className={`text-sm font-medium text-gray-900 dark:text-white truncate ${
                        !alert.isRead ? "font-semibold" : ""
                      }`}
                    >
                      {alert.title}
                    </p>
                    <div className="flex items-center mt-1 sm:mt-0">
                      <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {getRelativeTime(alert.timestamp)}
                      </span>
                      {!alert.isRead && (
                        <span className="ml-2 inline-block w-2 h-2 rounded-full bg-blue-500"></span>
                      )}
                    </div>
                  </div>
                  <p className="mt-1 text-xs sm:text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {alert.message}
                  </p>
                  <div className="mt-1 flex items-center">
                    <span className="text-xs text-gray-500 dark:text-gray-500">
                      {alert.source}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Show more button */}
      <div className="p-3 bg-gray-50 dark:bg-gray-750 border-t border-gray-200 dark:border-gray-700">
        <button className="w-full text-center text-xs sm:text-sm text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 flex items-center justify-center">
          <ArrowUpCircle className="w-4 h-4 mr-1" />
          View All Alerts
        </button>
      </div>
    </div>
  );
};

export default AlertsList;
