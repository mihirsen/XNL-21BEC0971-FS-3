"use client";

import React, { useState, useRef, useEffect } from "react";
import MainLayout from "../../components/layout/MainLayout";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface ReportFormData {
  title: string;
  description: string;
  category: string;
  location: {
    latitude: number | null;
    longitude: number | null;
    address: string;
  };
  images: string[];
  contact: {
    name: string;
    email: string;
    phone: string;
  };
}

const ReportPage: React.FC = () => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<ReportFormData>({
    title: "",
    description: "",
    category: "",
    location: {
      latitude: null,
      longitude: null,
      address: "",
    },
    images: [],
    contact: {
      name: "",
      email: "",
      phone: "",
    },
  });

  // Get current location
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setLocationLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        // Reverse geocoding to get address
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();
          const address = data.display_name || "Address not found";

          setFormData((prev) => ({
            ...prev,
            location: {
              latitude,
              longitude,
              address,
            },
          }));
        } catch (error) {
          console.error("Error getting address:", error);
          setFormData((prev) => ({
            ...prev,
            location: {
              latitude,
              longitude,
              address: "Could not retrieve address",
            },
          }));
        }

        setLocationLoading(false);
      },
      (error) => {
        console.error("Error getting location:", error);
        alert(`Error getting location: ${error.message}`);
        setLocationLoading(false);
      }
    );
  };

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof ReportFormData] as Record<string, any>),
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newPreviewImages: string[] = [];
    const newImageFiles: string[] = [];

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          const dataUrl = e.target.result as string;
          newPreviewImages.push(dataUrl);
          newImageFiles.push(dataUrl);

          if (newPreviewImages.length === files.length) {
            setPreviewImages((prev) => [...prev, ...newPreviewImages]);
            setFormData((prev) => ({
              ...prev,
              images: [...prev.images, ...newImageFiles],
            }));
          }
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // Remove image
  const removeImage = (index: number) => {
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  // Validate form
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.title.trim()) {
      errors.title = "Title is required";
    }

    if (!formData.description.trim()) {
      errors.description = "Description is required";
    }

    if (!formData.category) {
      errors.category = "Category is required";
    }

    if (!formData.location.latitude || !formData.location.longitude) {
      errors["location.address"] = "Location is required";
    }

    if (!formData.contact.name.trim()) {
      errors["contact.name"] = "Name is required";
    }

    if (!formData.contact.email.trim()) {
      errors["contact.email"] = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.contact.email)) {
      errors["contact.email"] = "Email is invalid";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // In a real app, you would send this data to your backend
      // For demo purposes, we'll just simulate a successful submission
      await new Promise((resolve) => setTimeout(resolve, 1500));

      console.log("Form submitted:", formData);
      setSubmitSuccess(true);

      // Reset form after successful submission
      setTimeout(() => {
        setFormData({
          title: "",
          description: "",
          category: "",
          location: {
            latitude: null,
            longitude: null,
            address: "",
          },
          images: [],
          contact: {
            name: "",
            email: "",
            phone: "",
          },
        });
        setPreviewImages([]);
        setSubmitSuccess(false);
        router.push("/");
      }, 2000);
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("There was an error submitting your report. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Report an Infrastructure Issue
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Help us improve our city by reporting infrastructure issues such as
            potholes, broken streetlights, water leaks, or other problems.
          </p>
        </div>

        {submitSuccess ? (
          <div className="bg-green-50 dark:bg-green-900 p-6 rounded-lg text-center">
            <svg
              className="w-16 h-16 text-green-500 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <h2 className="text-xl font-semibold text-green-800 dark:text-green-200 mb-2">
              Report Submitted Successfully!
            </h2>
            <p className="text-green-700 dark:text-green-300 mb-4">
              Thank you for helping improve our city. Your report has been
              received and will be reviewed shortly.
            </p>
            <p className="text-sm text-green-600 dark:text-green-400">
              Redirecting to home page...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Issue Details
              </h2>

              <div className="space-y-4">
                {/* Title */}
                <div>
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border ${
                      formErrors.title
                        ? "border-red-500"
                        : "border-gray-300 dark:border-gray-600"
                    } rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white`}
                    placeholder="E.g., Pothole on Main Street"
                  />
                  {formErrors.title && (
                    <p className="mt-1 text-sm text-red-500">
                      {formErrors.title}
                    </p>
                  )}
                </div>

                {/* Category */}
                <div>
                  <label
                    htmlFor="category"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border ${
                      formErrors.category
                        ? "border-red-500"
                        : "border-gray-300 dark:border-gray-600"
                    } rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white`}
                  >
                    <option value="">Select a category</option>
                    <option value="roads">Roads & Sidewalks</option>
                    <option value="lighting">Street Lighting</option>
                    <option value="water">Water & Drainage</option>
                    <option value="traffic">Traffic Signals</option>
                    <option value="parks">Parks & Recreation</option>
                    <option value="waste">Waste Management</option>
                    <option value="other">Other</option>
                  </select>
                  {formErrors.category && (
                    <p className="mt-1 text-sm text-red-500">
                      {formErrors.category}
                    </p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className={`w-full px-3 py-2 border ${
                      formErrors.description
                        ? "border-red-500"
                        : "border-gray-300 dark:border-gray-600"
                    } rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white`}
                    placeholder="Please provide details about the issue..."
                  />
                  {formErrors.description && (
                    <p className="mt-1 text-sm text-red-500">
                      {formErrors.description}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Location
              </h2>

              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <button
                    type="button"
                    onClick={getCurrentLocation}
                    className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50"
                    disabled={locationLoading}
                  >
                    {locationLoading ? (
                      <span className="flex items-center">
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Getting Location...
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        Use My Current Location
                      </span>
                    )}
                  </button>

                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    or
                  </span>
                </div>

                <div>
                  <label
                    htmlFor="location.address"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="location.address"
                    name="location.address"
                    value={formData.location.address}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border ${
                      formErrors["location.address"]
                        ? "border-red-500"
                        : "border-gray-300 dark:border-gray-600"
                    } rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white`}
                    placeholder="Enter the address or location description"
                  />
                  {formErrors["location.address"] && (
                    <p className="mt-1 text-sm text-red-500">
                      {formErrors["location.address"]}
                    </p>
                  )}
                </div>

                {formData.location.latitude && formData.location.longitude && (
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <p>
                      Coordinates: {formData.location.latitude.toFixed(6)},{" "}
                      {formData.location.longitude.toFixed(6)}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Images */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Images
              </h2>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Upload photos of the issue (optional, max 3 images)
                  </p>

                  <div className="flex items-center space-x-4">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                      disabled={previewImages.length >= 3}
                    >
                      <span className="flex items-center">
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        Upload Image
                      </span>
                    </button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      accept="image/*"
                      multiple
                      className="hidden"
                      disabled={previewImages.length >= 3}
                    />

                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {previewImages.length}/3 images
                    </span>
                  </div>
                </div>

                {previewImages.length > 0 && (
                  <div className="grid grid-cols-3 gap-4">
                    {previewImages.map((src, index) => (
                      <div key={index} className="relative">
                        <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-700">
                          <img
                            src={src}
                            alt={`Preview ${index + 1}`}
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 focus:outline-none"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Contact Information
              </h2>

              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="contact.name"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="contact.name"
                    name="contact.name"
                    value={formData.contact.name}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border ${
                      formErrors["contact.name"]
                        ? "border-red-500"
                        : "border-gray-300 dark:border-gray-600"
                    } rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white`}
                  />
                  {formErrors["contact.name"] && (
                    <p className="mt-1 text-sm text-red-500">
                      {formErrors["contact.name"]}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="contact.email"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="contact.email"
                    name="contact.email"
                    value={formData.contact.email}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border ${
                      formErrors["contact.email"]
                        ? "border-red-500"
                        : "border-gray-300 dark:border-gray-600"
                    } rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white`}
                  />
                  {formErrors["contact.email"] && (
                    <p className="mt-1 text-sm text-red-500">
                      {formErrors["contact.email"]}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="contact.phone"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Phone (optional)
                  </label>
                  <input
                    type="tel"
                    id="contact.phone"
                    name="contact.phone"
                    value={formData.contact.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <p>
                    Your contact information will only be used to follow up on
                    this report if necessary.
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  "Submit Report"
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </MainLayout>
  );
};

export default ReportPage;
