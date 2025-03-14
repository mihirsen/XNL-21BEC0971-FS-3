"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Bell,
  X,
  AlertTriangle,
  Info,
  CheckCircle,
  Trash2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "error" | "success";
  timestamp: Date;
  read: boolean;
}

interface NotificationCenterProps {
  onClearAll?: () => void;
}

export default function NotificationCenter({
  onClearAll,
}: NotificationCenterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const notificationRef = useRef<HTMLDivElement>(null);

  // Close notifications when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Fetch notifications or connect to WebSocket here
  useEffect(() => {
    // For demo purposes, generate some mock notifications
    const mockNotifications: Notification[] = [
      {
        id: "1",
        title: "Critical Alert",
        message: "Air quality sensors in Zone 3 reporting dangerous levels",
        type: "error",
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        read: false,
      },
      {
        id: "2",
        title: "Warning",
        message: "Traffic congestion detected on Main Street",
        type: "warning",
        timestamp: new Date(Date.now() - 25 * 60 * 1000),
        read: false,
      },
      {
        id: "3",
        title: "System Update",
        message: "Firmware update available for water quality sensors",
        type: "info",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        read: true,
      },
      {
        id: "4",
        title: "Maintenance Complete",
        message: "Scheduled maintenance of energy grid sensors completed",
        type: "success",
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        read: true,
      },
      {
        id: "5",
        title: "Drone Surveillance Alert",
        message: "Drone 3 detected unusual traffic pattern on Highway 95",
        type: "warning",
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        read: false,
      },
      {
        id: "6",
        title: "Citizen Report",
        message: "New pothole reported at 5th Ave & Main St with photo",
        type: "info",
        timestamp: new Date(Date.now() - 35 * 60 * 1000),
        read: false,
      },
    ];

    setNotifications(mockNotifications);
    setUnreadCount(mockNotifications.filter((n) => !n.read).length);

    // In a real app, you would use WebSockets to receive real-time notifications
    // Example WebSocket connection:
    /*
    const socket = new WebSocket('ws://localhost:3001');
    
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'notification') {
        addNotification(data.notification);
      }
    };

    return () => {
      socket.close();
    };
    */
  }, []);

  const addNotification = (notification: Notification) => {
    setNotifications((prev) => [notification, ...prev]);
    setUnreadCount((prev) => prev + 1);
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, read: true }))
    );
    setUnreadCount(0);
  };

  const removeNotification = (id: string) => {
    const notification = notifications.find((n) => n.id === id);
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    if (notification && !notification.read) {
      setUnreadCount((prev) => Math.max(0, prev - 1));
    }
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
    if (onClearAll) onClearAll();
  };

  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "error":
        return <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" />;
      case "warning":
        return (
          <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500" />
        );
      case "success":
        return <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />;
      case "info":
      default:
        return <Info className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />;
    }
  };

  const getNotificationBgColor = (
    type: Notification["type"],
    read: boolean
  ) => {
    if (read) return ""; // Default background if read

    switch (type) {
      case "error":
        return "bg-red-50 dark:bg-red-900/10";
      case "warning":
        return "bg-yellow-50 dark:bg-yellow-900/10";
      case "success":
        return "bg-green-50 dark:bg-green-900/10";
      case "info":
      default:
        return "bg-blue-50 dark:bg-blue-900/10";
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60)
    );

    if (diffMinutes < 1) return "Just now";
    if (diffMinutes < 60) return `${diffMinutes}m ago`;

    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}h ago`;

    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return "Yesterday";

    return date.toLocaleDateString();
  };

  // Add a simulated new notification for demo purposes
  const simulateNewNotification = () => {
    const types: Notification["type"][] = [
      "info",
      "warning",
      "error",
      "success",
    ];
    const randomType = types[Math.floor(Math.random() * types.length)];

    const titles = {
      info: "System Information",
      warning: "System Warning",
      error: "Critical Alert",
      success: "System Success",
    };

    const messages = {
      info: [
        "Routine system maintenance scheduled for tonight",
        "New sensor data available for analysis",
        "System updates pending installation",
        "Drone 5 completed surveillance of downtown area",
        "New citizen report submitted via mobile app",
      ],
      warning: [
        "Water pressure dropping in district 7",
        "Unusual traffic patterns detected on East Bridge",
        "Energy consumption spiking in commercial district",
        "Drone battery levels below 30% in sector 4",
        "Multiple citizen reports about noise in north district",
      ],
      error: [
        "Air quality critical in industrial zone",
        "Power outage detected in residential sector 5",
        "Security breach attempt detected",
        "Drone connection lost in western quadrant",
        "AI chatbot system requires immediate maintenance",
      ],
      success: [
        "Traffic flow optimization complete",
        "Energy grid stabilization successful",
        "Sensor network upgrade completed",
        "Drone surveillance mission completed successfully",
        "Citizen reported issue resolved in central district",
      ],
    };

    const randomMessage =
      messages[randomType][
        Math.floor(Math.random() * messages[randomType].length)
      ];

    const newNotification: Notification = {
      id: `notification-${Date.now()}`,
      title: titles[randomType],
      message: randomMessage,
      type: randomType,
      timestamp: new Date(),
      read: false,
    };

    addNotification(newNotification);
  };

  return (
    <div className="relative" ref={notificationRef}>
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-700 rounded-full hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5 sm:h-6 sm:w-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-full bg-red-500 text-[10px] sm:text-xs font-bold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed sm:absolute right-2 sm:right-0 left-2 sm:left-auto top-16 sm:top-auto sm:mt-2 w-auto sm:w-96 max-w-[calc(100vw-16px)] sm:max-w-none bg-white dark:bg-gray-800 rounded-lg shadow-lg z-[100] border border-gray-200 dark:border-gray-700"
            style={{ maxHeight: "calc(80vh - 80px)" }}
          >
            <div className="p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white">
                Notifications
              </h3>
              <div className="flex space-x-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                  >
                    Mark all read
                  </button>
                )}
                <button
                  onClick={clearAllNotifications}
                  className="ml-2 p-1 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400 rounded"
                  aria-label="Clear all notifications"
                >
                  <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
              </div>
            </div>

            <div
              className="overflow-y-auto"
              style={{ maxHeight: "calc(80vh - 140px)" }}
            >
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                  <p>No notifications</p>
                </div>
              ) : (
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                  {notifications.map((notification) => (
                    <li
                      key={notification.id}
                      className={`p-3 sm:p-4 hover:bg-gray-50 dark:hover:bg-gray-750 ${getNotificationBgColor(
                        notification.type,
                        notification.read
                      )}`}
                    >
                      <div className="flex items-start">
                        <div className="flex-shrink-0 pt-0.5">
                          {getIcon(notification.type)}
                        </div>
                        <div
                          className="ml-3 flex-1 cursor-pointer"
                          onClick={() => markAsRead(notification.id)}
                        >
                          <div className="flex justify-between">
                            <p
                              className={`text-sm font-medium text-gray-900 dark:text-white ${
                                !notification.read ? "font-semibold" : ""
                              }`}
                            >
                              {notification.title}
                            </p>
                            <span className="ml-2 text-xs whitespace-nowrap text-gray-500 dark:text-gray-400">
                              {formatTime(notification.timestamp)}
                            </span>
                          </div>
                          <p className="mt-1 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                            {notification.message}
                          </p>
                        </div>
                        <button
                          onClick={() => removeNotification(notification.id)}
                          className="ml-2 p-1 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400 rounded"
                          aria-label="Remove notification"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="p-3 sm:p-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={simulateNewNotification}
                className="w-full py-2 px-4 bg-primary-600 hover:bg-primary-700 text-white text-xs sm:text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Demo: Add New Notification
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
