"use client";

import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

interface PieChartProps {
  data: {
    labels: string[];
    datasets: {
      data: number[];
      backgroundColor: string | string[];
      borderColor?: string | string[];
      borderWidth?: number;
    }[];
  };
  options?: any;
}

const PieChart: React.FC<PieChartProps> = ({ data, options = {} }) => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    // If there's an existing chart, destroy it
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext("2d");
    if (!ctx) return;

    // Create the chart
    chartInstance.current = new Chart(ctx, {
      type: "doughnut",
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "60%",
        plugins: {
          legend: {
            position: "right",
            labels: {
              boxWidth: 10,
              usePointStyle: true,
              padding: 15,
              font: {
                size: 11,
              },
            },
          },
          tooltip: {
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            padding: 10,
            titleFont: {
              size: 12,
            },
            bodyFont: {
              size: 11,
            },
            displayColors: true,
            boxWidth: 8,
            boxHeight: 8,
            usePointStyle: true,
            callbacks: {
              label: function (context: any) {
                const value = context.parsed;
                const total = context.dataset.data.reduce(
                  (a: number, b: number) => a + b,
                  0
                );
                const percentage = Math.round((value / total) * 100);
                return `${context.label}: ${percentage}%`;
              },
            },
          },
        },
        ...options,
      },
    });

    // Cleanup function
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data, options]);

  return (
    <div className="relative h-full w-full">
      <canvas ref={chartRef} className="w-full h-full" />
    </div>
  );
};

export default PieChart;
