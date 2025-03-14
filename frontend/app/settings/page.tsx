"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import {
  Bell,
  Moon,
  Shield,
  AlertCircle,
  User,
  Save,
  Palette,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

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
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 12,
    },
  },
};

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [isSaving, setIsSaving] = useState(false);
  const [selectedColors, setSelectedColors] = useState({
    primary: "blue",
    accent: "purple",
  });

  const colors = [
    {
      name: "blue",
      bg: "bg-blue-500",
      text: "text-blue-500",
      border: "border-blue-500",
    },
    {
      name: "purple",
      bg: "bg-purple-500",
      text: "text-purple-500",
      border: "border-purple-500",
    },
    {
      name: "green",
      bg: "bg-green-500",
      text: "text-green-500",
      border: "border-green-500",
    },
    {
      name: "red",
      bg: "bg-red-500",
      text: "text-red-500",
      border: "border-red-500",
    },
    {
      name: "orange",
      bg: "bg-orange-500",
      text: "text-orange-500",
      border: "border-orange-500",
    },
    {
      name: "teal",
      bg: "bg-teal-500",
      text: "text-teal-500",
      border: "border-teal-500",
    },
  ];

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      // Show success message with animation
      const successMessage = document.getElementById("success-message");
      if (successMessage) {
        successMessage.classList.remove("hidden");
        setTimeout(() => {
          successMessage.classList.add("hidden");
        }, 3000);
      }
    }, 1000);
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="container mx-auto py-6 px-4 md:px-6 max-w-5xl"
    >
      <motion.div variants={itemVariants} className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Settings
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Manage your account settings and preferences.
        </p>
      </motion.div>

      <motion.div
        id="success-message"
        className="hidden fixed top-6 right-6 p-4 bg-green-100 dark:bg-green-900 border border-green-300 dark:border-green-700 rounded-lg shadow-lg z-50"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
      >
        <div className="flex gap-2 items-center">
          <Sparkles className="text-green-600 dark:text-green-400" />
          <span className="font-medium text-green-700 dark:text-green-300">
            Settings saved successfully!
          </span>
        </div>
      </motion.div>

      <form onSubmit={handleSaveSettings} className="space-y-8">
        {/* Appearance Settings */}
        <motion.div variants={itemVariants}>
          <Card className="border-t-4 border-t-blue-500 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-t-lg">
              <div className="flex items-center gap-2">
                <Moon className="h-5 w-5 text-blue-500" />
                <CardTitle>Appearance</CardTitle>
              </div>
              <CardDescription>
                Customize how the Smart City dashboard looks for you.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Theme
                </label>
                <div className="flex space-x-3">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm ${
                      theme === "light"
                        ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md"
                        : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
                    }`}
                    onClick={() => setTheme("light")}
                  >
                    <span>Light</span>
                  </motion.button>
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm ${
                      theme === "dark"
                        ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md"
                        : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
                    }`}
                    onClick={() => setTheme("dark")}
                  >
                    <span>Dark</span>
                  </motion.button>
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm ${
                      theme === "system"
                        ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md"
                        : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
                    }`}
                    onClick={() => setTheme("system")}
                  >
                    <span>System</span>
                  </motion.button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Color Scheme
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {colors.map((color) => (
                    <motion.button
                      key={color.name}
                      type="button"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className={`h-10 rounded-md flex items-center justify-center ${
                        color.bg
                      } ${
                        selectedColors.primary === color.name
                          ? "ring-2 ring-offset-2 ring-black dark:ring-white"
                          : ""
                      }`}
                      onClick={() =>
                        setSelectedColors({
                          ...selectedColors,
                          primary: color.name,
                        })
                      }
                    >
                      <span className="sr-only">{color.name}</span>
                    </motion.button>
                  ))}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Choose a primary color for your interface.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Notification Settings */}
        <motion.div variants={itemVariants}>
          <Card className="border-t-4 border-t-orange-500 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-t-lg">
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-orange-500" />
                <CardTitle>Notifications</CardTitle>
              </div>
              <CardDescription>
                Configure how you want to receive notifications.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="flex items-center justify-between p-3 rounded-lg bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email Notifications
                </label>
                <motion.div whileTap={{ scale: 0.9 }}>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="h-5 w-5 rounded border-gray-300 text-orange-600 focus:ring-orange-500 dark:border-gray-600 dark:bg-gray-700"
                  />
                </motion.div>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Push Notifications
                </label>
                <motion.div whileTap={{ scale: 0.9 }}>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="h-5 w-5 rounded border-gray-300 text-orange-600 focus:ring-orange-500 dark:border-gray-600 dark:bg-gray-700"
                  />
                </motion.div>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  SMS Notifications
                </label>
                <motion.div whileTap={{ scale: 0.9 }}>
                  <input
                    type="checkbox"
                    className="h-5 w-5 rounded border-gray-300 text-orange-600 focus:ring-orange-500 dark:border-gray-600 dark:bg-gray-700"
                  />
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* System Settings */}
        <motion.div variants={itemVariants}>
          <Card className="border-t-4 border-t-green-500 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 rounded-t-lg">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-green-500" />
                <CardTitle>System Settings</CardTitle>
              </div>
              <CardDescription>
                Configure system-wide settings for the Smart City dashboard.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Data Refresh Interval
                </label>
                <select
                  className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  defaultValue="30"
                >
                  <option value="15">15 seconds</option>
                  <option value="30">30 seconds</option>
                  <option value="60">1 minute</option>
                  <option value="300">5 minutes</option>
                  <option value="600">10 minutes</option>
                </select>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  How often the dashboard should refresh data from sensors.
                </p>
              </div>

              <motion.div
                className="flex items-start gap-3 p-4 border rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800"
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                transition={{
                  repeat: Infinity,
                  repeatType: "reverse",
                  duration: 2,
                }}
              >
                <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-yellow-800 dark:text-yellow-400">
                    System Performance
                  </p>
                  <p className="text-sm text-yellow-700 dark:text-yellow-500">
                    Lower refresh rates may affect system performance on older
                    devices.
                  </p>
                </div>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Account Information */}
        <motion.div variants={itemVariants}>
          <Card className="border-t-4 border-t-purple-500 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-t-lg">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-purple-500" />
                <CardTitle>Account Information</CardTitle>
              </div>
              <CardDescription>View your account details.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-1 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <motion.div
                  className="p-4 border rounded-lg bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow"
                  whileHover={{ y: -5 }}
                >
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Email
                  </p>
                  <p className="font-medium">admin@smartcity.io</p>
                </motion.div>
                <motion.div
                  className="p-4 border rounded-lg bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow"
                  whileHover={{ y: -5 }}
                >
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Role
                  </p>
                  <p className="font-medium">Administrator</p>
                </motion.div>
                <motion.div
                  className="p-4 border rounded-lg bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow"
                  whileHover={{ y: -5 }}
                >
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Last Login
                  </p>
                  <p className="font-medium">Today at 10:23 AM</p>
                </motion.div>
                <motion.div
                  className="p-4 border rounded-lg bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow"
                  whileHover={{ y: -5 }}
                >
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Account Created
                  </p>
                  <p className="font-medium">June 12, 2023</p>
                </motion.div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 shadow-md"
                onClick={() => alert("Password reset email sent")}
              >
                Reset Password
              </motion.button>
              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 shadow-md"
                onClick={() => alert("2FA settings opened")}
              >
                Configure Two-Factor Authentication
              </motion.button>
            </CardFooter>
          </Card>
        </motion.div>

        {/* Save button */}
        <motion.div className="flex justify-end" variants={itemVariants}>
          <motion.button
            type="submit"
            disabled={isSaving}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center rounded-md border border-transparent bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-base font-medium text-white shadow-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-75"
          >
            {isSaving ? (
              <>
                <span className="mr-3 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-5 w-5" />
                Save Settings
              </>
            )}
          </motion.button>
        </motion.div>
      </form>
    </motion.div>
  );
}
