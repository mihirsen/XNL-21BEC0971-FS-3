"use client";

import React, { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  MessageSquare,
  X,
  Send,
  User,
  Bot,
  ChevronDown,
  ChevronUp,
  Sparkles,
} from "lucide-react";

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
  "How can I find information about building permits?",
  "How do I register to vote in the city?",
];

// Assistant modes
const ASSISTANT_MODES = {
  general:
    "You are a helpful assistant for the Smart City platform. Provide concise and accurate information about city services, infrastructure, and community resources.",
  emergency:
    "You are an emergency services assistant for the Smart City platform. Help users with urgent situations and guide them to appropriate emergency services.",
};

const FloatingChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "👋 Hello! I'm your Smart City AI Assistant. How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<keyof typeof ASSISTANT_MODES>("general");
  const [showSuggestions, setShowSuggestions] = useState(true);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSendMessage = () => {
    if (input.trim() === "") return;

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI generating a response
    setTimeout(() => {
      generateAIResponse(input);
    }, 500);
  };

  const generateAIResponse = (userInput: string) => {
    const lowerInput = userInput.toLowerCase();

    // Simple pattern matching for demo purposes
    let responseText = "";

    if (lowerInput.includes("pothole") || lowerInput.includes("road")) {
      responseText =
        "You can report potholes or road damage through our citizen reporting app or by calling 311. Our maintenance team typically responds within 48 hours.";
    } else if (
      lowerInput.includes("transportation") ||
      lowerInput.includes("bus") ||
      lowerInput.includes("train")
    ) {
      responseText =
        "Our city offers buses, light rail, and bike sharing programs. You can download the SmartTransit app for real-time schedules and to purchase tickets.";
    } else if (
      lowerInput.includes("emergency") ||
      lowerInput.includes("help")
    ) {
      responseText =
        "For emergencies, please call 911 immediately. For non-emergency assistance, you can call 311 or use our SmartCity app to report issues.";
    } else if (lowerInput.includes("hello") || lowerInput.includes("hi")) {
      responseText =
        "Hello! I'm your Smart City assistant. How can I help you today?";
    } else {
      responseText =
        "I understand you're asking about " +
        userInput +
        ". While I don't have specific information on that yet, our city services department can help. Would you like me to connect you with them?";
    }

    const aiMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "assistant",
      content: responseText,
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
    setInput(question);
    handleSendMessage();
    setShowSuggestions(false);
  };

  return (
    <>
      {/* Floating button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
          aria-label="Chat with AI Assistant"
        >
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <MessageSquare className="w-6 h-6" />
              </motion.div>
              <motion.div
                className="absolute top-0 right-0 w-3 h-3 rounded-full bg-red-500"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 1 }}
              />
            </>
          )}
        </button>
      </motion.div>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 h-[500px] bg-white dark:bg-gray-800 rounded-lg shadow-xl flex flex-col"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            {/* Chat header */}
            <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
              <div className="flex items-center">
                <Bot className="w-5 h-5 mr-2" />
                <span className="font-medium">Smart City Assistant</span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() =>
                    setMode(mode === "general" ? "emergency" : "general")
                  }
                  className="p-1.5 rounded-full hover:bg-white/20 transition-colors"
                  aria-label="Change assistant mode"
                >
                  {mode === "general" ? (
                    <MessageSquare className="w-4 h-4" />
                  ) : (
                    <Sparkles className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-full hover:bg-white/20 transition-colors"
                  aria-label="Close chat"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Chat messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.role === "user"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white"
                    }`}
                  >
                    <div className="flex items-center mb-1">
                      {message.role === "user" ? (
                        <User className="w-4 h-4 mr-1" />
                      ) : (
                        <Bot className="w-4 h-4 mr-1" />
                      )}
                      <span className="text-xs font-medium">
                        {message.role === "user" ? "You" : "Assistant"}
                      </span>
                    </div>
                    <p className="text-sm">{message.content}</p>
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] p-3 rounded-lg bg-gray-100 dark:bg-gray-700">
                    <div className="flex space-x-1">
                      <motion.div
                        className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full"
                        animate={{ y: [0, -5, 0] }}
                        transition={{
                          repeat: Infinity,
                          duration: 0.7,
                          delay: 0,
                        }}
                      />
                      <motion.div
                        className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full"
                        animate={{ y: [0, -5, 0] }}
                        transition={{
                          repeat: Infinity,
                          duration: 0.7,
                          delay: 0.2,
                        }}
                      />
                      <motion.div
                        className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full"
                        animate={{ y: [0, -5, 0] }}
                        transition={{
                          repeat: Infinity,
                          duration: 0.7,
                          delay: 0.4,
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Suggested questions */}
            {showSuggestions && messages.length < 3 && (
              <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    Suggested Questions
                  </span>
                  <button
                    onClick={() => setShowSuggestions(!showSuggestions)}
                    className="text-blue-500 dark:text-blue-400 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    {showSuggestions ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {SUGGESTED_QUESTIONS.slice(0, 3).map((question, index) => (
                    <motion.button
                      key={index}
                      className="w-full text-left p-2 text-xs rounded-md bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                      onClick={() => handleSuggestedQuestion(question)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {question}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Chat input */}
            <div className="p-3 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-2">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a message..."
                  className="flex-1 h-10 px-3 py-2 resize-none text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  rows={1}
                />
                <motion.button
                  onClick={handleSendMessage}
                  className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!input.trim()}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Send className="w-4 h-4" />
                </motion.button>
              </div>
              <div className="mt-2 text-center">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {mode === "general"
                    ? "General Assistant"
                    : "Emergency Assistant"}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingChatbot;
