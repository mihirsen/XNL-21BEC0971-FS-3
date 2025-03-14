"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, BotIcon, User2, X, Minimize2, Maximize2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Message = {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
};

export default function SmartCityAI() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      text: "Hello! I'm your Smart City Assistant. How can I help you today?",
      sender: "ai",
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Focus on input when chat is opened
  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, isMinimized]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();

    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input.trim(),
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate AI response (in a real app, this would be an API call to a backend)
    setTimeout(() => {
      let response = "";
      const userText = input.toLowerCase();

      // Simple pattern matching for demo purposes
      if (userText.includes("parking") || userText.includes("park")) {
        response =
          "There are 342 available parking spots in the downtown area right now. The closest parking garage to city hall has 45 spots available.";
      } else if (
        userText.includes("traffic") ||
        userText.includes("congestion")
      ) {
        response =
          "Current traffic conditions show moderate congestion on Main Street due to construction. I recommend taking Oak Avenue as an alternative route.";
      } else if (userText.includes("emergency") || userText.includes("help")) {
        response =
          "For emergencies, please call 911 immediately. The nearest hospital is City General, located at 500 Medical Drive.";
      } else if (userText.includes("report") || userText.includes("issue")) {
        response =
          "You can report city infrastructure issues through our Citizen Mobile App. Would you like me to help you file a report now?";
      } else if (
        userText.includes("public transit") ||
        userText.includes("bus") ||
        userText.includes("train")
      ) {
        response =
          "The next bus (#42) will arrive at Central Station in 7 minutes. The express train to Downtown departs every 15 minutes.";
      } else if (
        userText.includes("weather") ||
        userText.includes("forecast")
      ) {
        response =
          "Current weather is 72°F with partly cloudy skies. Tomorrow's forecast shows a 30% chance of rain in the afternoon.";
      } else if (
        userText.includes("events") ||
        userText.includes("happening")
      ) {
        response =
          "Upcoming city events include the Farmers Market this Saturday from 8am-1pm and the Summer Concert Series starting next week at Central Park.";
      } else {
        response =
          "I'm here to help with any questions about city services, transportation, events, or infrastructure. Could you please provide more details about what you're looking for?";
      }

      const aiMessage: Message = {
        id: Date.now().toString(),
        text: response,
        sender: "ai",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const toggleChat = () => {
    if (isMinimized) {
      setIsMinimized(false);
    } else {
      setIsOpen((prev) => !prev);
    }
  };

  const minimizeChat = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMinimized(true);
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary-600 text-white shadow-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 md:bottom-8 md:right-8 md:h-16 md:w-16"
        aria-label="Open AI Assistant"
      >
        <BotIcon className="h-7 w-7" />
      </button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={
              isMinimized
                ? { opacity: 1, y: 0, scale: 0.95, height: "auto" }
                : { opacity: 1, y: 0, scale: 1, height: "auto" }
            }
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`fixed bottom-24 right-6 z-40 w-full max-w-sm overflow-hidden rounded-lg shadow-xl md:bottom-28 md:right-8 ${
              isMinimized ? "max-h-16" : "max-h-[32rem]"
            }`}
          >
            <Card className="h-full w-full border-0">
              {/* Chat Header */}
              <CardHeader
                className="cursor-pointer bg-primary-600 px-4 py-3 text-white"
                onClick={() => setIsMinimized(false)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <BotIcon className="h-5 w-5" />
                    <CardTitle className="text-sm font-medium md:text-base">
                      Smart City AI Assistant
                    </CardTitle>
                  </div>
                  <div className="flex space-x-1">
                    {!isMinimized ? (
                      <>
                        <button
                          onClick={minimizeChat}
                          className="rounded p-1 text-white/80 hover:bg-white/20 hover:text-white"
                          aria-label="Minimize chat"
                        >
                          <Minimize2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsOpen(false);
                          }}
                          className="rounded p-1 text-white/80 hover:bg-white/20 hover:text-white"
                          aria-label="Close chat"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsMinimized(false);
                        }}
                        className="rounded p-1 text-white/80 hover:bg-white/20 hover:text-white"
                        aria-label="Maximize chat"
                      >
                        <Maximize2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              </CardHeader>

              {!isMinimized && (
                <>
                  {/* Chat Messages */}
                  <CardContent className="flex h-80 flex-col space-y-4 overflow-y-auto bg-gray-50 p-4 dark:bg-gray-800">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.sender === "user"
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <div
                          className={`flex max-w-[85%] items-start space-x-2 rounded-lg px-3 py-2 ${
                            message.sender === "user"
                              ? "bg-primary-600 text-white"
                              : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-100"
                          }`}
                        >
                          {message.sender === "ai" && (
                            <BotIcon className="mt-1 h-4 w-4 flex-shrink-0" />
                          )}
                          <div>
                            <p className="text-sm">{message.text}</p>
                            <p className="mt-1 text-right text-xs text-gray-400">
                              {new Date(message.timestamp).toLocaleTimeString(
                                [],
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </p>
                          </div>
                          {message.sender === "user" && (
                            <User2 className="mt-1 h-4 w-4 flex-shrink-0" />
                          )}
                        </div>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="flex max-w-[85%] items-center space-x-2 rounded-lg bg-gray-200 px-3 py-2 text-gray-800 dark:bg-gray-700 dark:text-gray-100">
                          <BotIcon className="h-4 w-4 flex-shrink-0" />
                          <div className="flex space-x-1">
                            <div className="h-2 w-2 animate-bounce rounded-full bg-gray-500"></div>
                            <div
                              className="h-2 w-2 animate-bounce rounded-full bg-gray-500"
                              style={{ animationDelay: "0.2s" }}
                            ></div>
                            <div
                              className="h-2 w-2 animate-bounce rounded-full bg-gray-500"
                              style={{ animationDelay: "0.4s" }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </CardContent>

                  {/* Chat Input */}
                  <div className="border-t bg-white p-3 dark:bg-gray-900">
                    <form
                      onSubmit={handleSendMessage}
                      className="flex space-x-2"
                    >
                      <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask anything about the city..."
                        className="flex-1 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder-gray-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500"
                        disabled={isLoading}
                      />
                      <button
                        type="submit"
                        disabled={!input.trim() || isLoading}
                        className="flex h-9 w-9 items-center justify-center rounded-md bg-primary-600 text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                        aria-label="Send message"
                      >
                        <Send className="h-4 w-4" />
                      </button>
                    </form>
                  </div>
                </>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
