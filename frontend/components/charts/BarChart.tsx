"use client";

import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

interface BarChartProps {
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string | string[];
      borderColor?: string | string[];
      borderWidth?: number;
    }[];
  };
  options?: any;
}

const BarChart: React.FC<BarChartProps> = ({ data, options = {} }) => {
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
      type: "bar",
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: data.datasets.length > 1,
            position: "top",
            labels: {
              boxWidth: 10,
              usePointStyle: true,
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
          },
        },
        scales: {
          x: {
            grid: {
              display: false,
            },
            ticks: {
              font: {
                size: 10,
              },
            },
          },
          y: {
            beginAtZero: true,
            ticks: {
              font: {
                size: 10,
              },
            },
            grid: {
              borderDash: [2],
              drawBorder: false,
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

export default BarChart;
