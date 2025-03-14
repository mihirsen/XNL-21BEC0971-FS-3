"use client";

import { useState, useRef, useEffect } from "react";
import {
  Send,
  Mic,
  Image as ImageIcon,
  Paperclip,
  MoreVertical,
  ThumbsUp,
  ThumbsDown,
  Copy,
  RefreshCw,
  Bot,
  User,
  Sparkles,
  Lightbulb,
  MapPin,
  Calendar,
  AlertTriangle,
  HelpCircle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Types for chat messages
type MessageRole = "user" | "assistant" | "system";

interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
}

// Sample suggested questions
const SUGGESTED_QUESTIONS = [
  "How do I report a pothole in my neighborhood?",
  "What are the public transportation options in the city?",
  "When is the next city council meeting?",
  "How can I pay my utility bills online?",
  "What are the recycling guidelines for the city?",
  "Where can I find information about building permits?",
  "How do I register to vote in the city?",
  "What parks are open late in the evening?",
  "How can I report a power outage?",
  "What are the city's emergency services contact numbers?",
];

// Sample system prompts for different assistant modes
const ASSISTANT_MODES = {
  general:
    "You are a helpful assistant for the Smart City platform. Provide concise and accurate information about city services, infrastructure, and community resources.",
  technical:
    "You are a technical support assistant for the Smart City platform. Help users troubleshoot issues with city services, online accounts, and digital infrastructure.",
  emergency:
    "You are an emergency information assistant. Provide critical information about emergency services, evacuation routes, and safety procedures. For actual emergencies, always direct users to call emergency services.",
};

export default function AIChatbotPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      role: "system",
      content: ASSISTANT_MODES.general,
      timestamp: new Date(),
    },
    {
      id: "2",
      role: "assistant",
      content:
        "Hello! I'm your Smart City AI Assistant. How can I help you today?",
      timestamp: new Date(),
    },
  ]);

  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [selectedMode, setSelectedMode] =
    useState<keyof typeof ASSISTANT_MODES>("general");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (inputMessage.trim() === "") return;

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    // Simulate AI response after a delay
    setTimeout(() => {
      generateAIResponse(inputMessage);
    }, 1000);
  };

  const generateAIResponse = (userInput: string) => {
    // In a real app, this would call an API to get a response from a language model
    // For this demo, we'll use some simple pattern matching

    let responseContent = "";
    const lowercaseInput = userInput.toLowerCase();

    if (lowercaseInput.includes("hello") || lowercaseInput.includes("hi")) {
      responseContent =
        "Hello! How can I assist you with Smart City services today?";
    } else if (
      lowercaseInput.includes("pothole") ||
      lowercaseInput.includes("road")
    ) {
      responseContent =
        "To report a pothole or road damage, you can use the Citizen Reports feature in our app. Go to the 'Citizen Reports' section, click 'New Report', select 'Road Issue' category, and provide the location and details. You can also attach a photo of the problem.";
    } else if (
      lowercaseInput.includes("transportation") ||
      lowercaseInput.includes("bus") ||
      lowercaseInput.includes("train")
    ) {
      responseContent =
        "Our city offers several public transportation options including buses, subway, and bike sharing. You can view real-time schedules and routes in the 'Transportation' section of the app. The Smart City Transit Card can be used across all public transportation systems.";
    } else if (
      lowercaseInput.includes("meeting") ||
      lowercaseInput.includes("council")
    ) {
      responseContent =
        "The next city council meeting is scheduled for June 28, 2023 at 7:00 PM at City Hall. You can view the agenda and register to speak at the meeting through the 'City Governance' section of our app.";
    } else if (
      lowercaseInput.includes("bill") ||
      lowercaseInput.includes("pay")
    ) {
      responseContent =
        "You can pay utility bills online through the 'Payments' section of the app. We accept credit/debit cards and bank transfers. You can also set up automatic payments for monthly bills.";
    } else if (
      lowercaseInput.includes("recycling") ||
      lowercaseInput.includes("waste")
    ) {
      responseContent =
        "Our city's recycling program accepts paper, cardboard, glass, aluminum, and plastics #1-5. Place these items in your blue bin. For electronic waste, hazardous materials, or large items, please use the special collection services or visit the recycling center at 500 Green Street.";
    } else if (
      lowercaseInput.includes("permit") ||
      lowercaseInput.includes("building")
    ) {
      responseContent =
        "Building permits can be applied for online through the 'Permits & Licenses' section of our app. You'll need to provide project details, property information, and relevant documentation. Most residential permits are processed within 10-15 business days.";
    } else if (
      lowercaseInput.includes("vote") ||
      lowercaseInput.includes("voting")
    ) {
      responseContent =
        "To register to vote in the city, visit the 'Civic Engagement' section of our app. You'll need to provide proof of residency and identification. The deadline for registration for the upcoming election is July 15, 2023.";
    } else if (
      lowercaseInput.includes("park") ||
      lowercaseInput.includes("recreation")
    ) {
      responseContent =
        "Several parks in our city are open until 10:00 PM, including Central City Park, Riverside Park, and Oak Hills Recreation Area. All parks have emergency call boxes and are patrolled regularly by security personnel during evening hours.";
    } else if (
      lowercaseInput.includes("outage") ||
      lowercaseInput.includes("power")
    ) {
      responseContent =
        "To report a power outage, use the 'Emergency Services' section of our app or call the Utility Department's emergency line at (555) 123-4567. You can view current outage maps and estimated restoration times in the app as well.";
    } else if (
      lowercaseInput.includes("emergency") ||
      lowercaseInput.includes("911")
    ) {
      responseContent =
        "For emergencies requiring immediate assistance, always call 911. For non-emergency police matters, call (555) 987-6543. The fire department's non-emergency line is (555) 456-7890. The city's emergency management office can be reached at (555) 789-0123.";
    } else {
      responseContent =
        "I don't have specific information about that topic yet. Would you like me to connect you with a city department representative who might be able to help?";
    }

    const aiMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "assistant",
      content: responseContent,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, aiMessage]);
    setIsTyping(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSuggestedQuestion = (question: string) => {
    setInputMessage(question);
    // Focus the input after setting the question
    document.getElementById("chat-input")?.focus();
  };

  const changeAssistantMode = (mode: keyof typeof ASSISTANT_MODES) => {
    setSelectedMode(mode);

    // Add system message to change assistant behavior
    const systemMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "system",
      content: ASSISTANT_MODES[mode],
      timestamp: new Date(),
    };

    // Add visible message about mode change
    const notificationMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: `I've switched to ${mode} mode. How can I assist you?`,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, systemMessage, notificationMessage]);
  };

  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const getModeIcon = (mode: keyof typeof ASSISTANT_MODES) => {
    switch (mode) {
      case "general":
        return <Bot className="h-5 w-5" />;
      case "technical":
        return <Sparkles className="h-5 w-5" />;
      case "emergency":
        return <AlertTriangle className="h-5 w-5" />;
      default:
        return <Bot className="h-5 w-5" />;
    }
  };

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">AI Assistant</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Get help with city services and information through our AI-powered
          assistant.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main chat area */}
        <div className="lg:col-span-3">
          <Card className="h-[calc(100vh-200px)] flex flex-col">
            <CardHeader className="border-b px-4 py-3 flex flex-row items-center justify-between space-y-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                  {getModeIcon(selectedMode)}
                </div>
                <div>
                  <CardTitle className="text-lg">
                    Smart City Assistant
                  </CardTitle>
                  <CardDescription className="text-xs">
                    {selectedMode.charAt(0).toUpperCase() +
                      selectedMode.slice(1)}{" "}
                    Mode
                  </CardDescription>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => changeAssistantMode("general")}
                  className={`p-2 rounded-md ${
                    selectedMode === "general"
                      ? "bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                      : "hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                  title="General Assistant"
                >
                  <Bot className="h-5 w-5" />
                </button>
                <button
                  onClick={() => changeAssistantMode("technical")}
                  className={`p-2 rounded-md ${
                    selectedMode === "technical"
                      ? "bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400"
                      : "hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                  title="Technical Support"
                >
                  <Sparkles className="h-5 w-5" />
                </button>
                <button
                  onClick={() => changeAssistantMode("emergency")}
                  className={`p-2 rounded-md ${
                    selectedMode === "emergency"
                      ? "bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400"
                      : "hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                  title="Emergency Information"
                >
                  <AlertTriangle className="h-5 w-5" />
                </button>
              </div>
            </CardHeader>

            <CardContent className="flex-grow overflow-y-auto p-4 space-y-4">
              {messages
                .filter((m) => m.role !== "system")
                .map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.role === "user"
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center ${
                            message.role === "user"
                              ? "bg-blue-500"
                              : "bg-gray-200 dark:bg-gray-700"
                          }`}
                        >
                          {message.role === "user" ? (
                            <User className="h-3 w-3 text-white" />
                          ) : (
                            <Bot className="h-3 w-3 text-gray-700 dark:text-gray-300" />
                          )}
                        </div>
                        <span className="text-xs opacity-75">
                          {message.role === "user" ? "You" : "Assistant"} •{" "}
                          {formatTimestamp(message.timestamp)}
                        </span>
                      </div>
                      <p className="whitespace-pre-wrap">{message.content}</p>

                      {message.role === "assistant" && (
                        <div className="flex items-center gap-1 mt-2 justify-end">
                          <button
                            className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                            title="Copy to clipboard"
                          >
                            <Copy className="h-3 w-3 opacity-50" />
                          </button>
                          <button
                            className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                            title="Thumbs up"
                          >
                            <ThumbsUp className="h-3 w-3 opacity-50" />
                          </button>
                          <button
                            className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                            title="Thumbs down"
                          >
                            <ThumbsDown className="h-3 w-3 opacity-50" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 max-w-[80%]">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                        <Bot className="h-3 w-3 text-gray-700 dark:text-gray-300" />
                      </div>
                      <div className="flex space-x-1">
                        <div
                          className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                          style={{ animationDelay: "0ms" }}
                        ></div>
                        <div
                          className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                          style={{ animationDelay: "150ms" }}
                        ></div>
                        <div
                          className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                          style={{ animationDelay: "300ms" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </CardContent>

            <div className="border-t p-4">
              <div className="flex items-end gap-2">
                <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                  <Paperclip className="h-5 w-5" />
                </button>
                <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                  <ImageIcon className="h-5 w-5" />
                </button>
                <div className="flex-grow relative">
                  <textarea
                    id="chat-input"
                    rows={1}
                    placeholder="Type your message..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-white resize-none min-h-[40px] max-h-[120px]"
                  />
                </div>
                <button
                  onClick={handleSendMessage}
                  disabled={inputMessage.trim() === "" || isTyping}
                  className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Suggested questions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-yellow-500" />
                <span>Suggested Questions</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {SUGGESTED_QUESTIONS.slice(0, 5).map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestedQuestion(question)}
                  className="w-full text-left p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-sm"
                >
                  {question}
                </button>
              ))}
            </CardContent>
          </Card>

          {/* Quick links */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <a
                href="#"
                className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-sm"
              >
                <MapPin className="h-4 w-4 text-red-500" />
                <span>City Services Map</span>
              </a>
              <a
                href="#"
                className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-sm"
              >
                <Calendar className="h-4 w-4 text-blue-500" />
                <span>Community Events Calendar</span>
              </a>
              <a
                href="#"
                className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-sm"
              >
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                <span>Emergency Information</span>
              </a>
              <a
                href="#"
                className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-sm"
              >
                <HelpCircle className="h-4 w-4 text-purple-500" />
                <span>FAQ & Support</span>
              </a>
            </CardContent>
          </Card>

          {/* Chat history */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Conversations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <button className="w-full text-left p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-sm">
                <div className="font-medium">Recycling Information</div>
                <div className="text-xs text-gray-500">Yesterday, 3:24 PM</div>
              </button>
              <button className="w-full text-left p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-sm">
                <div className="font-medium">Bus Schedule Inquiry</div>
                <div className="text-xs text-gray-500">June 15, 2023</div>
              </button>
              <button className="w-full text-left p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-sm">
                <div className="font-medium">Permit Application Help</div>
                <div className="text-xs text-gray-500">June 10, 2023</div>
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
