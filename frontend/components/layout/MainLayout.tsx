"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Map,
  BarChart3,
  Settings,
  Menu,
  Users,
  X,
  ChevronRight,
  Sun,
  Moon,
  UserCircle,
  LogOut,
  Landmark,
  AlertTriangle,
  Cpu,
  MessageSquare,
  Send,
  Bell,
  Info,
  CheckCircle,
} from "lucide-react";
import { useTheme } from "next-themes";
import NotificationCenter from "../notifications/NotificationCenter";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  BarChart2,
  Server,
  PanelLeft,
  Droplets,
  Wind,
  FlameKindling,
} from "lucide-react";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const themeContext = useTheme();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<
    Array<{
      role: "user" | "assistant";
      content: string;
    }>
  >([
    {
      role: "assistant",
      content:
        "Hello! I'm your Smart City AI Assistant. How can I help you today?",
    },
  ]);
  const [userInput, setUserInput] = useState("");
  const [alerts, setAlerts] = useState<
    Array<{
      id: string;
      type: "info" | "warning" | "success" | "error";
      message: string;
    }>
  >([
    {
      id: "welcome",
      type: "info",
      message: "Welcome to Smart City Dashboard! All systems are operational.",
    },
  ]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleThemeToggle = () => {
    console.log("Toggling theme from:", themeContext.theme);
    // Toggle theme and update DOM immediately
    const newTheme = themeContext.theme === "dark" ? "light" : "dark";
    themeContext.setTheme(newTheme);

    // Apply class changes immediately for a smoother transition
    if (newTheme === "light") {
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
    }
  };

  const handleSendMessage = () => {
    if (!userInput.trim()) return;

    // Add user message
    setChatMessages((prev) => [
      ...prev,
      { role: "user", content: userInput.trim() },
    ]);

    // Simulate AI response after a short delay
    setTimeout(() => {
      const responses = [
        "I'm checking the city data for that information.",
        "The traffic sensors indicate normal flow throughout the city center.",
        "Our environmental monitors show good air quality levels today.",
        "The smart grid is currently operating at optimal efficiency.",
        "I've alerted the maintenance team about your report.",
      ];
      const randomResponse =
        responses[Math.floor(Math.random() * responses.length)];

      setChatMessages((prev) => [
        ...prev,
        { role: "assistant", content: randomResponse },
      ]);
    }, 1000);

    // Clear the input
    setUserInput("");
  };

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Map", href: "/map", icon: Map },
    { name: "Analytics", href: "/analytics", icon: BarChart3 },
    { name: "Drone Surveillance", href: "/drone-surveillance", icon: Cpu },
    { name: "Citizen Reports", href: "/citizen-reports", icon: Users },
    { name: "AI Assistant", href: "/ai-assistant", icon: MessageSquare },
    { name: "Report Issue", href: "/report", icon: AlertTriangle },
    { name: "Smart Features", href: "/smart-features", icon: Cpu },
    { name: "Admin", href: "/admin", icon: Landmark },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  // Animation variants
  const sidebarVariants = {
    open: { x: 0, transition: { type: "spring", stiffness: 300, damping: 30 } },
    closed: {
      x: "-100%",
      transition: { type: "spring", stiffness: 300, damping: 30 },
    },
  };

  const navItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.3,
      },
    }),
  };

  const logoVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1, transition: { duration: 0.5 } },
  };

  // Remove an alert by id
  const removeAlert = (id: string) => {
    setAlerts(alerts.filter((alert) => alert.id !== id));
  };

  // Auto dismiss alerts after a delay
  useEffect(() => {
    const timers = alerts.map((alert) => {
      return setTimeout(() => {
        removeAlert(alert.id);
      }, 5000);
    });

    return () => {
      timers.forEach((timer) => clearTimeout(timer));
    };
  }, [alerts]);

  // Add a demo alert every 30 seconds
  useEffect(() => {
    const demoAlerts = [
      { type: "info", message: "Traffic update: All major routes clear" },
      {
        type: "warning",
        message: "Weather alert: Light rain expected in 30 minutes",
      },
      {
        type: "success",
        message: "Energy optimization complete: 12% reduction achieved",
      },
      {
        type: "error",
        message: "Sensor #245 offline: Maintenance team notified",
      },
    ];

    const interval = setInterval(() => {
      const randomAlert =
        demoAlerts[Math.floor(Math.random() * demoAlerts.length)];
      setAlerts((prev) => [
        ...prev,
        {
          id: `alert-${Date.now()}`,
          type: randomAlert.type as "info" | "warning" | "success" | "error",
          message: randomAlert.message,
        },
      ]);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Get alert icon and color based on type
  const getAlertStyle = (type: "info" | "warning" | "success" | "error") => {
    switch (type) {
      case "info":
        return {
          icon: <Info className="w-5 h-5" />,
          bg: "bg-blue-500",
          text: "text-white",
          border: "border-blue-600",
        };
      case "warning":
        return {
          icon: <AlertTriangle className="w-5 h-5" />,
          bg: "bg-amber-500",
          text: "text-white",
          border: "border-amber-600",
        };
      case "success":
        return {
          icon: <CheckCircle className="w-5 h-5" />,
          bg: "bg-green-500",
          text: "text-white",
          border: "border-green-600",
        };
      case "error":
        return {
          icon: <AlertTriangle className="w-5 h-5" />,
          bg: "bg-red-500",
          text: "text-white",
          border: "border-red-600",
        };
    }
  };

  // Check for mobile screen on resize
  useEffect(() => {
    const checkScreenSize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    // Initial check
    checkScreenSize();

    // Add event listener
    window.addEventListener("resize", checkScreenSize);

    // Clean up
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Set dark mode based on user preference - only run once on initial load
  useEffect(() => {
    if (!mounted) return; // Skip if not mounted yet

    // Check for system preference
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    // Only set theme if it hasn't been explicitly set already
    if (!themeContext.theme) {
      themeContext.setTheme(prefersDark ? "dark" : "light");
    }

    // Apply class based on current theme
    if (themeContext.theme === "dark" || (prefersDark && !themeContext.theme)) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [mounted, themeContext.theme, themeContext.setTheme]);

  // Handle keyboard shortcut to toggle sidebar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Use Alt+S to toggle sidebar
      if (e.altKey && e.key === "s") {
        setIsSidebarOpen((prev) => !prev);
      }

      // Use Alt+T to toggle theme
      if (e.altKey && e.key === "t") {
        handleThemeToggle();
      }

      // Use Escape to close mobile menu and AI chat
      if (e.key === "Escape") {
        setMobileMenuOpen(false);
        setIsChatOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setIsSidebarOpen, setMobileMenuOpen, setIsChatOpen, handleThemeToggle]);

  return (
    <div className="flex h-screen w-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 overflow-hidden">
      {/* Global Alert System */}
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-lg px-4">
        <AnimatePresence>
          {alerts.map((alert) => {
            const style = getAlertStyle(alert.type);
            return (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20, transition: { duration: 0.2 } }}
                className={`${style.bg} ${style.text} ${style.border} border rounded-lg shadow-lg mb-2 overflow-hidden`}
              >
                <div className="flex items-center justify-between p-3">
                  <div className="flex items-center">
                    {style.icon}
                    <span className="ml-2 font-medium">{alert.message}</span>
                  </div>
                  <button
                    onClick={() => removeAlert(alert.id)}
                    className="text-white hover:bg-white/10 rounded-full p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <motion.div
                  initial={{ width: "100%" }}
                  animate={{ width: "0%" }}
                  transition={{ duration: 5, ease: "linear" }}
                  className="h-1 bg-white/30"
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Sidebar for desktop - left side */}
      <motion.div
        className={`fixed inset-y-0 left-0 z-40 w-[85%] max-w-[280px] bg-white/90 dark:bg-gray-800/95 backdrop-blur-sm shadow-lg lg:translate-x-0 overflow-hidden`}
        initial="closed"
        animate={isSidebarOpen ? "open" : "closed"}
        variants={sidebarVariants}
        style={{ x: isSidebarOpen ? 0 : "-100%" }}
      >
        <div className="flex flex-col h-full">
          <motion.div
            className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-primary-500/10 to-primary-600/10 dark:from-primary-500/20 dark:to-primary-600/20"
            variants={logoVariants}
            initial="initial"
            animate="animate"
          >
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-blue-600 dark:from-primary-400 dark:to-blue-400 truncate max-w-[180px]">
              Smart City
            </h1>
            <motion.button
              onClick={toggleSidebar}
              className="p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 lg:hidden"
              aria-label="Close sidebar"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <X className="w-5 h-5" />
            </motion.button>
          </motion.div>

          <div className="flex-1 overflow-y-auto">
            <nav className="px-2 py-4">
              <ul className="space-y-1">
                {navItems.map((item, i) => (
                  <motion.li
                    key={item.name}
                    custom={i}
                    initial="hidden"
                    animate="visible"
                    variants={navItemVariants}
                  >
                    <Link
                      href={item.href}
                      className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-md transition-all duration-150 ease-in-out ${
                        pathname === item.href
                          ? "bg-gradient-to-r from-primary-50 to-primary-100 text-primary-600 dark:from-gray-700 dark:to-gray-700/80 dark:text-primary-400 shadow-sm"
                          : "text-gray-700 hover:bg-gray-100/80 dark:text-gray-300 dark:hover:bg-gray-700/80 hover:shadow-sm"
                      }`}
                      onClick={() => {
                        // Close sidebar on mobile when a link is clicked
                        if (window.innerWidth < 1024) {
                          setIsSidebarOpen(false);
                        }
                      }}
                    >
                      <span
                        className={`mr-3 transition-colors duration-150 ${
                          pathname === item.href
                            ? "text-primary-600 dark:text-primary-400"
                            : "text-gray-500 dark:text-gray-400"
                        }`}
                      >
                        {React.createElement(item.icon, {
                          className: "w-5 h-5",
                        })}
                      </span>
                      {item.name}
                      {pathname === item.href && (
                        <motion.span
                          className="ml-auto text-primary-600 dark:text-primary-400"
                          animate={{ x: [0, 3, 0] }}
                          transition={{ repeat: Infinity, duration: 1.5 }}
                        >
                          <ChevronRight className="w-4 h-4" />
                        </motion.span>
                      )}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </nav>
          </div>

          <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-800/80">
            <motion.button
              onClick={handleThemeToggle}
              className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-md hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-600 dark:hover:to-gray-500 shadow-sm transition-all duration-150"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {mounted && themeContext.theme === "dark" ? (
                <Sun className="w-5 h-5 mr-2 text-amber-500" />
              ) : (
                <Moon className="w-5 h-5 mr-2 text-indigo-500" />
              )}
              {mounted && themeContext.theme === "dark"
                ? "Light Mode"
                : "Dark Mode"}
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Main content */}
      <div className="flex flex-col flex-1 w-full h-full lg:ml-[280px]">
        {/* Top navigation */}
        <header className="sticky top-0 z-20 bg-white/90 dark:bg-gray-800/95 backdrop-blur-sm shadow-sm">
          <div className="flex items-center justify-between h-16 px-4">
            <div className="flex items-center">
              <div className="w-9 lg:hidden"></div>{" "}
              {/* Spacer to replace the mobile button */}
              <h1 className="text-base sm:text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-blue-600 dark:from-primary-400 dark:to-blue-400 lg:hidden pl-5 ml-0">
                Smart City
              </h1>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4">
              <NotificationCenter />

              <motion.button
                onClick={handleThemeToggle}
                className="p-2 text-gray-500 rounded-full hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                aria-label="Toggle theme"
                whileHover={{ rotate: 15, scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {mounted && themeContext.theme === "dark" ? (
                  <Sun className="w-5 h-5 text-amber-500" />
                ) : (
                  <Moon className="w-5 h-5 text-indigo-500" />
                )}
              </motion.button>

              <div className="relative">
                <motion.button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="p-2 text-gray-500 rounded-full hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  aria-label="User menu"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <UserCircle className="w-6 h-6" />
                </motion.button>

                {userMenuOpen && (
                  <motion.div
                    className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50 border border-gray-200 dark:border-gray-700"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-750">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        Admin User
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        admin@smartcity.com
                      </p>
                    </div>
                    <Link
                      href="/settings"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Profile Settings
                    </Link>
                    <div className="border-t border-gray-200 dark:border-gray-700">
                      <Link
                        href="/login"
                        className="block px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <div className="flex items-center">
                          <LogOut className="h-4 w-4 mr-2" />
                          Sign out
                        </div>
                      </Link>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-3 sm:p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
          {children}
        </main>

        {/* Floating AI Assistant */}
        <div className="fixed bottom-4 right-4 z-50">
          <AnimatePresence>
            {isChatOpen ? (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.8 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 w-80 sm:w-96 mb-4 overflow-hidden"
              >
                <div className="flex items-center justify-between bg-gradient-to-r from-primary-600 to-blue-600 text-white p-3">
                  <div className="flex items-center">
                    <MessageSquare className="w-5 h-5 mr-2" />
                    <h3 className="font-medium">AI Assistant</h3>
                  </div>
                  <button
                    onClick={() => setIsChatOpen(false)}
                    className="text-white hover:bg-white/10 rounded-full p-1"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div
                  className="h-80 overflow-y-auto p-3 flex flex-col gap-3"
                  id="chat-messages"
                >
                  {chatMessages.map((msg, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.3 }}
                      className={`flex ${
                        msg.role === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          msg.role === "user"
                            ? "bg-primary-500 text-white"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                        }`}
                      >
                        {msg.content}
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="p-3 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" && handleSendMessage()
                      }
                      placeholder="Ask something..."
                      className="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleSendMessage}
                      className="bg-primary-500 text-white rounded-lg p-2"
                    >
                      <Send className="w-5 h-5" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsChatOpen(!isChatOpen)}
            className="bg-gradient-to-r from-primary-500 to-blue-600 text-white rounded-full p-3 shadow-lg flex items-center justify-center relative"
          >
            <MessageSquare className="w-6 h-6" />
          </motion.button>
        </div>
      </div>

      {/* Mobile backdrop */}
      {isSidebarOpen && (
        <motion.div
          className="fixed inset-0 bg-gray-600 bg-opacity-50 z-30 lg:hidden"
          onClick={toggleSidebar}
          aria-hidden="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        ></motion.div>
      )}

      {/* Mobile Menu Button */}
      <div className="fixed top-0 left-0 z-50 p-3 lg:hidden">
        <button
          className="p-2 rounded-lg bg-white dark:bg-gray-800 shadow-lg text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
          onClick={toggleSidebar}
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.2 }}
              className="fixed inset-y-0 left-0 z-40 w-full max-w-xs bg-white dark:bg-gray-800 overflow-y-auto"
            >
              <div className="flex justify-between items-center px-4 py-5 border-b border-gray-200 dark:border-gray-700">
                <Link href="/" className="flex items-center space-x-2">
                  <div className="relative w-8 h-8">
                    <Image
                      src="/logo.png"
                      alt="Smart City Logo"
                      fill
                      style={{ objectFit: "contain" }}
                    />
                  </div>
                  <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-blue-600 dark:from-primary-400 dark:to-blue-400 text-transparent bg-clip-text">
                    Smart City
                  </span>
                </Link>
                <button
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <nav className="py-4 px-4">
                <div className="space-y-1">
                  {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`flex items-center px-4 py-3 rounded-lg ${
                          isActive
                            ? "bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-750"
                        }`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <div
                          className={`mr-3 ${
                            isActive
                              ? "text-primary-600 dark:text-primary-400"
                              : "text-gray-500 dark:text-gray-400"
                          }`}
                        >
                          {React.createElement(item.icon, {
                            className: "w-5 h-5",
                          })}
                        </div>
                        <span>{item.name}</span>
                      </Link>
                    );
                  })}
                </div>
                <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-4">
                  <button
                    onClick={handleThemeToggle}
                    className="flex items-center w-full px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-750"
                  >
                    {mounted && themeContext.theme === "dark" ? (
                      <>
                        <Sun className="w-5 h-5 mr-3 text-amber-500" />
                        <span>Light Mode</span>
                      </>
                    ) : (
                      <>
                        <Moon className="w-5 h-5 mr-3 text-indigo-500" />
                        <span>Dark Mode</span>
                      </>
                    )}
                  </button>
                </div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MainLayout;
