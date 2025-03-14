"use client";

import React, { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  icon?: ReactNode;
  color?: "blue" | "green" | "yellow" | "red" | "purple" | "indigo";
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  trend = "neutral",
  trendValue,
  icon,
  color = "blue",
}) => {
  const colorClasses = {
    blue: {
      bgLight: "bg-blue-50",
      bgDark: "dark:bg-blue-900/20",
      textLight: "text-blue-600",
      textDark: "dark:text-blue-400",
      iconBg: "bg-blue-100 dark:bg-blue-800",
    },
    green: {
      bgLight: "bg-green-50",
      bgDark: "dark:bg-green-900/20",
      textLight: "text-green-600",
      textDark: "dark:text-green-400",
      iconBg: "bg-green-100 dark:bg-green-800",
    },
    yellow: {
      bgLight: "bg-yellow-50",
      bgDark: "dark:bg-yellow-900/20",
      textLight: "text-yellow-600",
      textDark: "dark:text-yellow-400",
      iconBg: "bg-yellow-100 dark:bg-yellow-800",
    },
    red: {
      bgLight: "bg-red-50",
      bgDark: "dark:bg-red-900/20",
      textLight: "text-red-600",
      textDark: "dark:text-red-400",
      iconBg: "bg-red-100 dark:bg-red-800",
    },
    purple: {
      bgLight: "bg-purple-50",
      bgDark: "dark:bg-purple-900/20",
      textLight: "text-purple-600",
      textDark: "dark:text-purple-400",
      iconBg: "bg-purple-100 dark:bg-purple-800",
    },
    indigo: {
      bgLight: "bg-indigo-50",
      bgDark: "dark:bg-indigo-900/20",
      textLight: "text-indigo-600",
      textDark: "dark:text-indigo-400",
      iconBg: "bg-indigo-100 dark:bg-indigo-800",
    },
  };

  const selectedColors = colorClasses[color];

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-lg shadow p-4 sm:p-6 ${
        trend === "up"
          ? "border-l-4 border-green-500"
          : trend === "down"
          ? "border-l-4 border-red-500"
          : ""
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center">
        {icon && (
          <div
            className={`flex-shrink-0 mb-3 sm:mb-0 sm:mr-4 p-2 sm:p-3 rounded-full ${selectedColors.iconBg} self-start sm:self-auto`}
          >
            <div
              className={`${selectedColors.textLight} ${selectedColors.textDark} w-5 h-5 sm:w-6 sm:h-6`}
            >
              {icon}
            </div>
          </div>
        )}
        <div>
          <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
            {title}
          </p>
          <div className="flex flex-wrap items-baseline gap-1 sm:gap-2">
            <p
              className={`text-xl sm:text-2xl font-semibold ${selectedColors.textLight} ${selectedColors.textDark}`}
            >
              {value}
            </p>
            {trendValue && (
              <span
                className={`text-xs sm:text-sm font-medium ${
                  trend === "up"
                    ? "text-green-600 dark:text-green-400"
                    : trend === "down"
                    ? "text-red-600 dark:text-red-400"
                    : "text-gray-500 dark:text-gray-400"
                } flex items-center`}
              >
                {trend === "up" ? (
                  <svg
                    className="w-3 h-3 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : trend === "down" ? (
                  <svg
                    className="w-3 h-3 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : null}
                {trendValue}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
