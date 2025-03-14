"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, CheckCircle, Info, X, Bell } from "lucide-react";

// Alert types
export type AlertType = "info" | "warning" | "success" | "error";

// Alert data structure
export interface Alert {
  id: string;
  type: AlertType;
  title?: string;
  message: string;
  duration?: number;
}

// Add alert params
export interface AddAlertParams {
  type: AlertType;
  title?: string;
  message: string;
  duration?: number;
}

// Context interface
export interface AlertContextProps {
  alerts: Alert[];
  addAlert: (params: AddAlertParams) => void;
  removeAlert: (id: string) => void;
  clearAlerts: () => void;
}

// Create context with default values
const AlertContext = createContext<AlertContextProps>({
  alerts: [],
  addAlert: () => {},
  removeAlert: () => {},
  clearAlerts: () => {},
});

// Hook for using the alert context
export const useAlert = () => useContext(AlertContext);

// Default animation variants
const alertVariants = {
  initial: { opacity: 0, y: -50, scale: 0.9 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } },
};

// Provider component
export const AlertProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  // Function to add an alert
  const addAlert = useCallback(
    ({ type, title, message, duration = 5000 }: AddAlertParams) => {
      try {
        const id = `alert-${Date.now()}-${Math.random()
          .toString(36)
          .substr(2, 9)}`;

        const newAlert: Alert = {
          id,
          type,
          title,
          message,
          duration,
        };

        setAlerts((prev) => [newAlert, ...prev]);

        // Auto remove alert after duration if duration > 0
        if (duration > 0) {
          setTimeout(() => {
            removeAlert(id);
          }, duration);
        }

        return id;
      } catch (error) {
        console.error("Error adding alert:", error);
        return null;
      }
    },
    []
  );

  // Function to remove an alert
  const removeAlert = useCallback((id: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  }, []);

  // Function to clear all alerts
  const clearAlerts = useCallback(() => {
    setAlerts([]);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      setAlerts([]);
    };
  }, []);

  // Add welcome alert on first load
  useEffect(() => {
    const hasShownWelcome = sessionStorage.getItem("hasShownWelcome");

    if (!hasShownWelcome) {
      addAlert({
        type: "info",
        title: "Welcome",
        message: "Welcome to Smart City Dashboard",
        duration: 5000,
      });

      sessionStorage.setItem("hasShownWelcome", "true");
    }
  }, [addAlert]);

  // Get appropriate icon based on alert type
  const getAlertIcon = (type: AlertType) => {
    switch (type) {
      case "info":
        return <Info className="w-5 h-5" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5" />;
      case "success":
        return <CheckCircle className="w-5 h-5" />;
      case "error":
        return <AlertTriangle className="w-5 h-5" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  // Get appropriate alert styles based on type
  const getAlertStyles = (type: AlertType) => {
    switch (type) {
      case "info":
        return {
          container:
            "bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800",
          icon: "text-blue-500 dark:text-blue-400",
          title: "text-blue-900 dark:text-blue-100",
          message: "text-blue-800 dark:text-blue-200",
        };
      case "warning":
        return {
          container:
            "bg-amber-50 dark:bg-amber-900/30 border-amber-200 dark:border-amber-800",
          icon: "text-amber-500 dark:text-amber-400",
          title: "text-amber-900 dark:text-amber-100",
          message: "text-amber-800 dark:text-amber-200",
        };
      case "success":
        return {
          container:
            "bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800",
          icon: "text-green-500 dark:text-green-400",
          title: "text-green-900 dark:text-green-100",
          message: "text-green-800 dark:text-green-200",
        };
      case "error":
        return {
          container:
            "bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800",
          icon: "text-red-500 dark:text-red-400",
          title: "text-red-900 dark:text-red-100",
          message: "text-red-800 dark:text-red-200",
        };
      default:
        return {
          container:
            "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700",
          icon: "text-gray-500 dark:text-gray-400",
          title: "text-gray-900 dark:text-gray-100",
          message: "text-gray-800 dark:text-gray-200",
        };
    }
  };

  return (
    <AlertContext.Provider
      value={{ alerts, addAlert, removeAlert, clearAlerts }}
    >
      {children}

      {/* Alert container */}
      <div className="fixed top-4 right-4 z-50 flex flex-col items-end space-y-2 max-w-md">
        <AnimatePresence>
          {alerts.map((alert) => {
            const styles = getAlertStyles(alert.type);

            return (
              <motion.div
                key={alert.id}
                className={`flex w-full shadow-lg rounded-lg border ${styles.container} overflow-hidden`}
                initial="initial"
                animate="animate"
                exit="exit"
                variants={alertVariants}
                layout
              >
                <div
                  className={`flex items-center justify-center p-4 ${styles.icon}`}
                >
                  {getAlertIcon(alert.type)}
                </div>

                <div className="flex-1 p-4">
                  {alert.title && (
                    <h5 className={`font-semibold ${styles.title}`}>
                      {alert.title}
                    </h5>
                  )}
                  <p className={`text-sm ${styles.message}`}>{alert.message}</p>
                </div>

                <button
                  onClick={() => removeAlert(alert.id)}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors self-start"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </AlertContext.Provider>
  );
};
