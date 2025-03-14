"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Camera,
  MapPin,
  Send,
  X,
  AlertTriangle,
  Check,
  Image,
  Loader2,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

interface Location {
  latitude: number;
  longitude: number;
  address?: string;
}

type IssueCategory =
  | "road_damage"
  | "street_light"
  | "garbage"
  | "graffiti"
  | "flooding"
  | "traffic_signal"
  | "other";

interface IssueReport {
  id: string;
  category: IssueCategory;
  description: string;
  location: Location;
  images: string[];
  status: "pending" | "acknowledged" | "in_progress" | "resolved" | "rejected";
  createdAt: Date;
  updatedAt: Date;
}

const CATEGORIES = [
  { id: "road_damage", label: "Road Damage", icon: "🛣️" },
  { id: "street_light", label: "Street Light", icon: "💡" },
  { id: "garbage", label: "Garbage/Litter", icon: "🗑️" },
  { id: "graffiti", label: "Graffiti", icon: "🖌️" },
  { id: "flooding", label: "Flooding", icon: "💧" },
  { id: "traffic_signal", label: "Traffic Signal", icon: "🚦" },
  { id: "other", label: "Other", icon: "❓" },
];

export default function ReportIssue() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [category, setCategory] = useState<IssueCategory | null>(null);
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState<Location | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get current location when component mounts
  useEffect(() => {
    if (isOpen && step === 3 && !location) {
      getCurrentLocation();
    }
  }, [isOpen, step, location]);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation: Location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };

          // In a real app, you would reverse geocode to get the address
          // For demo purposes, we'll simulate this
          setTimeout(() => {
            setLocation({
              ...newLocation,
              address: "123 Main St, Downtown",
            });
          }, 1000);
        },
        (error) => {
          console.error("Error getting location:", error);
          setLocation({
            latitude: 40.7128,
            longitude: -74.006,
            address: "Default Location (Failed to get your location)",
          });
        }
      );
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // For demo purposes, we're not actually uploading images
    // Just creating object URLs for preview
    const newImages = Array.from(files).map((file) =>
      URL.createObjectURL(file)
    );
    setImages((prev) => [...prev, ...newImages]);
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    setCategory(null);
    setDescription("");
    setLocation(null);
    setImages([]);
    setStep(1);
    setError(null);
  };

  const handleSubmit = async () => {
    if (!category || !description || !location) {
      setError("Please complete all required fields.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // In real implementation, you would send data to your backend:
      // const response = await fetch('/api/citizen/report', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     category,
      //     description,
      //     location,
      //     images, // In real implementation, you'd upload images to storage and pass URLs
      //   }),
      // });

      setIsSubmitting(false);
      setIsSuccess(true);

      // Auto close after showing success
      setTimeout(() => {
        setIsSuccess(false);
        setIsOpen(false);
        resetForm();
      }, 3000);
    } catch (error) {
      console.error("Error submitting report:", error);
      setIsSubmitting(false);
      setError("Failed to submit report. Please try again.");
    }
  };

  const goToNextStep = () => {
    if (step === 1 && !category) {
      setError("Please select an issue category");
      return;
    }

    if (step === 2 && description.length < 10) {
      setError(
        "Please provide a more detailed description (at least 10 characters)"
      );
      return;
    }

    setError(null);
    setStep((prev) => (prev < 4 ? ((prev + 1) as any) : prev));
  };

  const goToPreviousStep = () => {
    setStep((prev) => (prev > 1 ? ((prev - 1) as any) : prev));
    setError(null);
  };

  return (
    <>
      {/* Report Issue Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-amber-500 text-white shadow-lg hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 md:bottom-8 md:left-8 md:h-16 md:w-16"
        aria-label="Report an Issue"
      >
        <AlertTriangle className="h-6 w-6" />
      </button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="w-full max-w-md overflow-hidden rounded-lg bg-white shadow-xl dark:bg-gray-800"
            >
              {/* Header */}
              <div className="relative bg-amber-500 px-4 py-3 text-white">
                <h2 className="text-center text-lg font-semibold">
                  {isSuccess ? "Report Submitted" : "Report an Issue"}
                </h2>
                <button
                  onClick={() => {
                    if (isSuccess) {
                      setIsSuccess(false);
                      resetForm();
                    }
                    setIsOpen(false);
                  }}
                  className="absolute right-2 top-2 rounded-full p-1 text-white/80 hover:bg-white/20 hover:text-white"
                  aria-label="Close modal"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {isSuccess ? (
                <div className="flex flex-col items-center justify-center p-8 text-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                    <Check className="h-8 w-8" />
                  </div>
                  <h3 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">
                    Thank You!
                  </h3>
                  <p className="mb-4 text-gray-600 dark:text-gray-300">
                    Your report has been submitted successfully. The city will
                    review it and take appropriate action.
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Report ID:{" "}
                    {Math.random().toString(36).substring(2, 10).toUpperCase()}
                  </p>
                </div>
              ) : (
                <div className="p-4">
                  {/* Progress Steps */}
                  <div className="mb-6 flex justify-between">
                    {[1, 2, 3, 4].map((s) => (
                      <div
                        key={s}
                        className={`flex h-8 w-8 items-center justify-center rounded-full ${
                          s === step
                            ? "bg-amber-500 text-white"
                            : s < step
                            ? "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-300"
                            : "bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
                        }`}
                      >
                        {s}
                      </div>
                    ))}
                  </div>

                  {/* Error message */}
                  {error && (
                    <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-300">
                      {error}
                    </div>
                  )}

                  {/* Step 1: Select Category */}
                  {step === 1 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        What issue are you reporting?
                      </h3>
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                        {CATEGORIES.map((cat) => (
                          <button
                            key={cat.id}
                            onClick={() => {
                              setCategory(cat.id as IssueCategory);
                              setError(null);
                            }}
                            className={`flex flex-col items-center justify-center rounded-md border p-3 text-center transition-colors ${
                              category === cat.id
                                ? "border-amber-500 bg-amber-50 dark:border-amber-400 dark:bg-amber-900/20"
                                : "border-gray-200 bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
                            }`}
                          >
                            <span className="text-2xl">{cat.icon}</span>
                            <span className="mt-1 text-xs font-medium text-gray-900 dark:text-white">
                              {cat.label}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Step 2: Description */}
                  {step === 2 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        Describe the issue
                      </h3>
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Please provide details about the issue..."
                        rows={5}
                        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500"
                      />
                      <div className="text-right text-xs text-gray-500 dark:text-gray-400">
                        {description.length} characters (minimum 10)
                      </div>
                    </div>
                  )}

                  {/* Step 3: Location */}
                  {step === 3 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        Location
                      </h3>

                      <div className="flex items-center rounded-md border border-gray-300 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800">
                        <MapPin className="mr-2 h-5 w-5 text-amber-500 dark:text-amber-400" />
                        {location ? (
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {location.address}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              Lat: {location.latitude.toFixed(6)}, Lng:{" "}
                              {location.longitude.toFixed(6)}
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>Getting your location...</span>
                          </div>
                        )}
                      </div>

                      <button
                        onClick={getCurrentLocation}
                        className="flex w-full items-center justify-center rounded-md border border-gray-300 bg-white py-2 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                      >
                        <MapPin className="mr-2 h-4 w-4" />
                        Refresh Location
                      </button>
                    </div>
                  )}

                  {/* Step 4: Images */}
                  {step === 4 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        Add Photos
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Add photos to help city staff better understand the
                        issue (optional)
                      </p>

                      <div className="grid grid-cols-3 gap-2">
                        {images.map((img, index) => (
                          <div
                            key={index}
                            className="relative h-24 w-full overflow-hidden rounded-md"
                          >
                            <img
                              src={img}
                              alt={`Uploaded image ${index + 1}`}
                              className="h-full w-full object-cover"
                            />
                            <button
                              onClick={() => removeImage(index)}
                              className="absolute right-1 top-1 rounded-full bg-black/70 p-1 text-white hover:bg-black"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}

                        {images.length < 3 && (
                          <label className="flex h-24 w-full cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
                            <div className="flex flex-col items-center justify-center">
                              <Camera className="mb-1 h-6 w-6 text-gray-400" />
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                Add Photo
                              </span>
                            </div>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleImageUpload}
                              className="hidden"
                            />
                          </label>
                        )}
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                          Review your report
                        </h3>
                        <div className="rounded-md bg-gray-50 p-3 dark:bg-gray-800">
                          <div className="mb-2 flex items-center space-x-2">
                            <span className="text-lg">
                              {CATEGORIES.find((c) => c.id === category)?.icon}
                            </span>
                            <span className="font-medium text-gray-900 dark:text-white">
                              {CATEGORIES.find((c) => c.id === category)?.label}
                            </span>
                          </div>
                          <p className="mb-2 text-sm text-gray-600 dark:text-gray-300">
                            {description}
                          </p>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {location?.address} • {images.length} photos
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Navigation Buttons */}
                  <div className="mt-6 flex justify-between">
                    {step > 1 ? (
                      <button
                        onClick={goToPreviousStep}
                        className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                      >
                        Back
                      </button>
                    ) : (
                      <div></div>
                    )}

                    {step < 4 ? (
                      <button
                        onClick={goToNextStep}
                        className="rounded-md bg-amber-500 px-4 py-2 text-sm font-medium text-white hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2"
                      >
                        Continue
                      </button>
                    ) : (
                      <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="flex items-center rounded-md bg-amber-500 px-4 py-2 text-sm font-medium text-white hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          <>
                            <Send className="mr-2 h-4 w-4" />
                            Submit Report
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
