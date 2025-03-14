"use client";

import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import DroneSurveillance from "@/components/drone/DroneSurveillance";
import SmartCityAI from "@/components/chatbot/SmartCityAI";
import ReportIssue from "@/components/citizen/ReportIssue";

export default function SmartFeaturesPage() {
  return (
    <MainLayout>
      <div className="space-y-8 pb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
            Smart City Features
          </h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Advanced technologies to make urban living safer, more efficient,
            and connected
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="col-span-full">
            <DroneSurveillance />
          </div>
        </div>

        {/* Floating components rendered from their own components */}
        <SmartCityAI />
        <ReportIssue />
      </div>
    </MainLayout>
  );
}
