"use client";

import React from "react";
import Link from "next/link";
import MainLayout from "@/components/layout/MainLayout";
import { ArrowLeft, Home } from "lucide-react";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <MainLayout>
      <div className="flex items-center justify-center min-h-[calc(100vh-16rem)]">
        <motion.div
          className="text-center p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-7xl font-bold text-primary-500 mb-4">404</h1>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            Page Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            Sorry, the page you are looking for doesn't exist or has been moved.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <motion.button
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium text-white bg-primary-600 hover:bg-primary-700 transition-colors w-full"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Home className="w-5 h-5" />
                <span>Go Home</span>
              </motion.button>
            </Link>
            <button
              onClick={() => window.history.back()}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors w-full"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Go Back</span>
            </button>
          </div>
        </motion.div>
      </div>
    </MainLayout>
  );
}
