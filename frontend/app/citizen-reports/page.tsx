"use client";

import { useState } from "react";
import {
  Search,
  Filter,
  MapPin,
  Calendar,
  Clock,
  User,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Image as ImageIcon,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Trash2,
  Edit,
  MoreHorizontal,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Type definitions
type ReportStatus = "pending" | "in_progress" | "resolved" | "rejected";
type ReportPriority = "low" | "medium" | "high";
type ReportCategory =
  | "road"
  | "lighting"
  | "sanitation"
  | "vandalism"
  | "hazard"
  | "other";

interface Comment {
  id: string;
  user: string;
  text: string;
  timestamp: string;
}

interface Report {
  id: string;
  title: string;
  description: string;
  category: ReportCategory;
  status: ReportStatus;
  priority: ReportPriority;
  location: {
    address: string;
    coordinates: [number, number];
  };
  reportedBy: string;
  reportedAt: string;
  images: string[];
  upvotes: number;
  comments: Comment[];
}

// Mock data for citizen reports
const MOCK_REPORTS: Report[] = [
  {
    id: "rep-001",
    title: "Pothole on Main Street",
    description:
      "Large pothole causing traffic issues and potential vehicle damage.",
    category: "road",
    status: "pending",
    priority: "high",
    location: {
      address: "123 Main St, Downtown",
      coordinates: [40.7128, -74.006],
    },
    reportedBy: "John Smith",
    reportedAt: "2023-06-15T09:30:00",
    images: [
      "https://images.unsplash.com/photo-1594818379496-da1e345b0ded?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80",
    ],
    upvotes: 12,
    comments: [
      {
        id: "c1",
        user: "Jane Doe",
        text: "I hit this pothole yesterday and damaged my tire.",
        timestamp: "2023-06-15T10:15:00",
      },
      {
        id: "c2",
        user: "Mike Johnson",
        text: "It's getting bigger every day.",
        timestamp: "2023-06-16T08:45:00",
      },
    ],
  },
  {
    id: "rep-002",
    title: "Broken Street Light",
    description:
      "Street light not working at the corner of Oak and Pine streets. Area is very dark at night.",
    category: "lighting",
    status: "in_progress",
    priority: "medium",
    location: {
      address: "Corner of Oak and Pine St, North District",
      coordinates: [40.7328, -74.026],
    },
    reportedBy: "Sarah Williams",
    reportedAt: "2023-06-14T18:45:00",
    images: [
      "https://images.unsplash.com/photo-1617469165786-8007eda3caa7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    ],
    upvotes: 8,
    comments: [
      {
        id: "c3",
        user: "Robert Chen",
        text: "This is a safety hazard for pedestrians.",
        timestamp: "2023-06-14T19:20:00",
      },
    ],
  },
  {
    id: "rep-003",
    title: "Overflowing Trash Bin",
    description:
      "Public trash bin overflowing in Central Park. Attracting pests and creating unpleasant odor.",
    category: "sanitation",
    status: "resolved",
    priority: "medium",
    location: {
      address: "Central Park, East Entrance",
      coordinates: [40.7728, -73.966],
    },
    reportedBy: "Emily Johnson",
    reportedAt: "2023-06-13T11:15:00",
    images: [
      "https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1025&q=80",
    ],
    upvotes: 5,
    comments: [],
  },
  {
    id: "rep-004",
    title: "Graffiti on Public Building",
    description: "Offensive graffiti on the wall of the community center.",
    category: "vandalism",
    status: "pending",
    priority: "low",
    location: {
      address: "45 Community Ave, West District",
      coordinates: [40.7028, -74.016],
    },
    reportedBy: "David Wilson",
    reportedAt: "2023-06-12T14:30:00",
    images: [
      "https://images.unsplash.com/photo-1607604760190-ec4e3e59e8e5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    ],
    upvotes: 3,
    comments: [],
  },
  {
    id: "rep-005",
    title: "Fallen Tree Blocking Sidewalk",
    description:
      "Large tree has fallen after the storm and is completely blocking the sidewalk. Pedestrians are forced to walk on the road.",
    category: "hazard",
    status: "in_progress",
    priority: "high",
    location: {
      address: "78 Maple Street, East District",
      coordinates: [40.7228, -73.996],
    },
    reportedBy: "Lisa Martinez",
    reportedAt: "2023-06-11T08:00:00",
    images: [
      "https://images.unsplash.com/photo-1612099197022-468d7c5b7b0d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    ],
    upvotes: 15,
    comments: [
      {
        id: "c4",
        user: "Tom Jackson",
        text: "This is dangerous for children walking to school.",
        timestamp: "2023-06-11T09:15:00",
      },
      {
        id: "c5",
        user: "Karen Smith",
        text: "I saw city workers assessing the situation this morning.",
        timestamp: "2023-06-12T10:30:00",
      },
    ],
  },
];

export default function CitizenReportsPage() {
  const [reports, setReports] = useState<Report[]>(MOCK_REPORTS);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<ReportStatus | "all">("all");
  const [categoryFilter, setCategoryFilter] = useState<ReportCategory | "all">(
    "all"
  );
  const [priorityFilter, setPriorityFilter] = useState<ReportPriority | "all">(
    "all"
  );
  const [expandedReportId, setExpandedReportId] = useState<string | null>(null);

  // Filter reports based on search term and filters
  const filteredReports = reports.filter((report) => {
    // Search term filter
    const matchesSearch =
      searchTerm === "" ||
      report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.location.address.toLowerCase().includes(searchTerm.toLowerCase());

    // Status filter
    const matchesStatus =
      statusFilter === "all" || report.status === statusFilter;

    // Category filter
    const matchesCategory =
      categoryFilter === "all" || report.category === categoryFilter;

    // Priority filter
    const matchesPriority =
      priorityFilter === "all" || report.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesCategory && matchesPriority;
  });

  const toggleExpandReport = (reportId: string) => {
    if (expandedReportId === reportId) {
      setExpandedReportId(null);
    } else {
      setExpandedReportId(reportId);
    }
  };

  const updateReportStatus = (reportId: string, newStatus: ReportStatus) => {
    setReports((prevReports) =>
      prevReports.map((report) =>
        report.id === reportId ? { ...report, status: newStatus } : report
      )
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: ReportStatus) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "in_progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      case "resolved":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400";
    }
  };

  const getPriorityColor = (priority: ReportPriority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400";
    }
  };

  const getCategoryIcon = (category: ReportCategory) => {
    switch (category) {
      case "road":
        return (
          <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 flex items-center justify-center">
            🛣️
          </div>
        );
      case "lighting":
        return (
          <div className="w-8 h-8 rounded-full bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 flex items-center justify-center">
            💡
          </div>
        );
      case "sanitation":
        return (
          <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 flex items-center justify-center">
            🗑️
          </div>
        );
      case "vandalism":
        return (
          <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 flex items-center justify-center">
            🖌️
          </div>
        );
      case "hazard":
        return (
          <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            ⚠️
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 flex items-center justify-center">
            ❓
          </div>
        );
    }
  };

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Citizen Reports</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Manage and respond to infrastructure issues reported by citizens.
        </p>
      </div>

      {/* Filters and search */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search reports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as ReportStatus | "all")
              }
              className="px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="rejected">Rejected</option>
            </select>

            <select
              value={categoryFilter}
              onChange={(e) =>
                setCategoryFilter(e.target.value as ReportCategory | "all")
              }
              className="px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="all">All Categories</option>
              <option value="road">Road</option>
              <option value="lighting">Lighting</option>
              <option value="sanitation">Sanitation</option>
              <option value="vandalism">Vandalism</option>
              <option value="hazard">Hazard</option>
              <option value="other">Other</option>
            </select>

            <select
              value={priorityFilter}
              onChange={(e) =>
                setPriorityFilter(e.target.value as ReportPriority | "all")
              }
              className="px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="all">All Priorities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Showing {filteredReports.length} of {reports.length} reports
          </div>

          <button className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            <Filter className="h-4 w-4" />
            <span>Advanced Filters</span>
          </button>
        </div>
      </div>

      {/* Reports list */}
      <div className="space-y-4">
        {filteredReports.length > 0 ? (
          filteredReports.map((report) => (
            <Card key={report.id} className="overflow-hidden">
              <div className="p-4 md:p-6">
                <div className="flex flex-col md:flex-row gap-4 md:items-start">
                  {/* Category icon */}
                  <div className="hidden md:block">
                    {getCategoryIcon(report.category)}
                  </div>

                  {/* Report content */}
                  <div className="flex-grow">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <div className="md:hidden">
                          {getCategoryIcon(report.category)}
                        </div>
                        <h3 className="text-lg font-semibold">
                          {report.title}
                        </h3>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            report.status
                          )}`}
                        >
                          {report.status.replace("_", " ").toUpperCase()}
                        </span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                            report.priority
                          )}`}
                        >
                          {report.priority.toUpperCase()} PRIORITY
                        </span>
                      </div>
                    </div>

                    <p className="text-gray-600 dark:text-gray-300 mb-3">
                      {report.description}
                    </p>

                    <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{report.location.address}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(report.reportedAt)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{formatTime(report.reportedAt)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        <span>{report.reportedBy}</span>
                      </div>
                    </div>

                    {/* Preview of images and comments */}
                    <div className="flex flex-wrap gap-3 mb-3">
                      {report.images.length > 0 && (
                        <div className="flex items-center gap-1 text-sm">
                          <ImageIcon className="h-4 w-4 text-blue-500" />
                          <span>
                            {report.images.length} image
                            {report.images.length !== 1 ? "s" : ""}
                          </span>
                        </div>
                      )}
                      {report.comments.length > 0 && (
                        <div className="flex items-center gap-1 text-sm">
                          <MessageSquare className="h-4 w-4 text-blue-500" />
                          <span>
                            {report.comments.length} comment
                            {report.comments.length !== 1 ? "s" : ""}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center gap-1 text-sm">
                        <span className="text-blue-500">👍</span>
                        <span>
                          {report.upvotes} upvote
                          {report.upvotes !== 1 ? "s" : ""}
                        </span>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => toggleExpandReport(report.id)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 text-sm"
                      >
                        {expandedReportId === report.id ? (
                          <>
                            <ChevronUp className="h-4 w-4" />
                            <span>Hide Details</span>
                          </>
                        ) : (
                          <>
                            <ChevronDown className="h-4 w-4" />
                            <span>View Details</span>
                          </>
                        )}
                      </button>

                      {report.status === "pending" && (
                        <button
                          onClick={() =>
                            updateReportStatus(report.id, "in_progress")
                          }
                          className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                        >
                          <CheckCircle className="h-4 w-4" />
                          <span>Start Processing</span>
                        </button>
                      )}

                      {report.status === "in_progress" && (
                        <button
                          onClick={() =>
                            updateReportStatus(report.id, "resolved")
                          }
                          className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
                        >
                          <CheckCircle className="h-4 w-4" />
                          <span>Mark as Resolved</span>
                        </button>
                      )}

                      {(report.status === "pending" ||
                        report.status === "in_progress") && (
                        <button
                          onClick={() =>
                            updateReportStatus(report.id, "rejected")
                          }
                          className="flex items-center gap-1 px-3 py-1.5 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
                        >
                          <XCircle className="h-4 w-4" />
                          <span>Reject Report</span>
                        </button>
                      )}

                      <div className="relative ml-auto">
                        <button className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                          <MoreHorizontal className="h-5 w-5 text-gray-500" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expanded details */}
                {expandedReportId === report.id && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    {/* Images */}
                    {report.images.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium mb-2">Images</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                          {report.images.map((image, index) => (
                            <div
                              key={index}
                              className="relative aspect-video rounded-md overflow-hidden"
                            >
                              <img
                                src={image}
                                alt={`Report image ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Comments */}
                    <div>
                      <h4 className="text-sm font-medium mb-2">
                        Comments ({report.comments.length})
                      </h4>
                      {report.comments.length > 0 ? (
                        <div className="space-y-3">
                          {report.comments.map((comment) => (
                            <div
                              key={comment.id}
                              className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md"
                            >
                              <div className="flex justify-between mb-1">
                                <span className="font-medium">
                                  {comment.user}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {formatDate(comment.timestamp)}{" "}
                                  {formatTime(comment.timestamp)}
                                </span>
                              </div>
                              <p className="text-sm">{comment.text}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          No comments yet.
                        </p>
                      )}

                      {/* Add comment form */}
                      <div className="mt-3 flex gap-2">
                        <input
                          type="text"
                          placeholder="Add a comment..."
                          className="flex-grow px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                        />
                        <button className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm">
                          Post
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          ))
        ) : (
          <div className="text-center py-12">
            <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
              No reports found
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
