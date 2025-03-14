"use client";

import React, { useState } from "react";
import { useTheme } from "../../providers/ThemeProvider";

const Navbar: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const notifications = [
    {
      id: 1,
      title: "Traffic Alert",
      message: "Heavy traffic detected on Main Street",
      time: "2 minutes ago",
      unread: true,
    },
    {
      id: 2,
      title: "Air Quality Warning",
      message: "Poor air quality detected in Downtown area",
      time: "10 minutes ago",
      unread: true,
    },
    {
      id: 3,
      title: "System Update",
      message: "New system version available",
      time: "1 hour ago",
      unread: false,
    },
  ];

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <a
                href="/"
                className="text-xl font-bold text-primary-600 dark:text-primary-400"
              >
                Smart City Monitor
              </a>
            </div>
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              <a
                href="/"
                className="border-transparent text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Dashboard
              </a>
              <a
                href="/sensors"
                className="border-transparent text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Sensors
              </a>
              <a
                href="/analytics"
                className="border-transparent text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Analytics
              </a>
              <a
                href="/map"
                className="border-transparent text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                City Map
              </a>
            </div>
          </div>

          <div className="flex items-center">
            {/* Search Bar */}
            <div className="hidden md:block">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  name="search"
                  id="search"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="ml-4 p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
              aria-label="Toggle dark mode"
            >
              {theme === "dark" ? (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              )}
            </button>

            {/* Notification Bell */}
            <div className="ml-4 relative">
              <button
                onClick={() => {
                  setIsNotificationsOpen(!isNotificationsOpen);
                  setIsUserMenuOpen(false);
                }}
                className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
                aria-label="View notifications"
              >
                <span className="sr-only">View notifications</span>
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
                {/* Badge */}
                {notifications.filter((n) => n.unread).length > 0 && (
                  <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-800"></span>
                )}
              </button>

              {/* Notification Panel */}
              {isNotificationsOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-50">
                  <div
                    className="py-1"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="options-menu"
                  >
                    <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                        Notifications
                      </h3>
                    </div>
                    {notifications.length > 0 ? (
                      <div className="max-h-80 overflow-y-auto">
                        {notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 ${
                              notification.unread
                                ? "border-l-4 border-primary-500"
                                : ""
                            }`}
                          >
                            <div className="flex justify-between">
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {notification.title}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {notification.time}
                              </p>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                              {notification.message}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="px-4 py-3 text-center text-gray-500 dark:text-gray-400">
                        No new notifications
                      </div>
                    )}
                    <div className="border-t border-gray-200 dark:border-gray-700">
                      <a
                        href="/notifications"
                        className="block px-4 py-2 text-sm text-center text-primary-600 dark:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        View all notifications
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Menu */}
            <div className="ml-4 relative">
              <button
                onClick={() => {
                  setIsUserMenuOpen(!isUserMenuOpen);
                  setIsNotificationsOpen(false);
                }}
                className="flex items-center focus:outline-none"
                aria-label="User menu"
                aria-haspopup="true"
              >
                <span className="sr-only">Open user menu</span>
                <img
                  className="h-8 w-8 rounded-full border-2 border-gray-200 dark:border-gray-700"
                  src="https://via.placeholder.com/150"
                  alt="User avatar"
                />
              </button>

              {/* User Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-50">
                  <div
                    className="py-1"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="options-menu"
                  >
                    <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Administrator
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        admin@smartcity.com
                      </p>
                    </div>
                    <a
                      href="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      role="menuitem"
                    >
                      Your Profile
                    </a>
                    <a
                      href="/settings"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      role="menuitem"
                    >
                      Settings
                    </a>
                    <button
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border-t border-gray-200 dark:border-gray-700"
                      role="menuitem"
                      onClick={() => {
                        // Handle logout
                        console.log("Logout clicked");
                      }}
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
