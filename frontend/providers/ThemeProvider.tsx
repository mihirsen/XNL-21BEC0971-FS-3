"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  // Apply theme immediately when it changes
  const applyTheme = (newTheme: Theme) => {
    if (typeof window !== "undefined" && typeof document !== "undefined") {
      console.log("Applying theme:", newTheme);
      if (newTheme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }

      // Force a re-paint to ensure theme is immediately applied
      const body = document.querySelector("body");
      if (body) {
        const currentOpacity = window.getComputedStyle(body).opacity;
        body.style.opacity = "0.99";
        setTimeout(() => {
          body.style.opacity = currentOpacity;
        }, 1);
      }
    }
  };

  // Toggle theme function for easy access
  const toggleTheme = () => {
    console.log("Toggling theme from:", theme);
    const newTheme = theme === "dark" ? "light" : "dark";
    handleThemeChange(newTheme);
  };

  useEffect(() => {
    // Check for saved theme preference or use system preference
    if (typeof window !== "undefined") {
      try {
        const savedTheme = localStorage.getItem("theme") as Theme;
        const systemPreference = window.matchMedia(
          "(prefers-color-scheme: dark)"
        ).matches
          ? "dark"
          : "light";

        const initialTheme = savedTheme || systemPreference;
        console.log("Initial theme detected:", initialTheme);
        setTheme(initialTheme);

        // Apply theme to document
        applyTheme(initialTheme);

        console.log("Initial theme applied:", initialTheme);
      } catch (error) {
        console.error("Error setting initial theme:", error);
        // Fallback to light theme
        setTheme("light");
        applyTheme("light");
      }

      setMounted(true);
    }
  }, []);

  // Listen for system theme changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

      const handleChange = (e: MediaQueryListEvent) => {
        const savedTheme = localStorage.getItem("theme") as Theme;
        // Only change if user hasn't explicitly set a preference
        if (!savedTheme) {
          const newTheme = e.matches ? "dark" : "light";
          console.log("System theme changed to:", newTheme);
          setTheme(newTheme);
          applyTheme(newTheme);
        }
      };

      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener("change", handleChange);
        return () => mediaQuery.removeEventListener("change", handleChange);
      } else {
        // Fallback for older browsers
        mediaQuery.addListener(handleChange);
        return () => mediaQuery.removeListener(handleChange);
      }
    }
  }, []);

  const handleThemeChange = (newTheme: Theme) => {
    console.log("Theme changing to:", newTheme);
    setTheme(newTheme);

    try {
      if (typeof window !== "undefined") {
        localStorage.setItem("theme", newTheme);
      }
    } catch (error) {
      console.error("Error saving theme to localStorage:", error);
    }

    // Apply theme to document
    applyTheme(newTheme);
  };

  // Apply theme whenever it changes programmatically
  useEffect(() => {
    if (mounted) {
      applyTheme(theme);
    }
  }, [theme, mounted]);

  // Debug output to verify theme state
  useEffect(() => {
    if (mounted) {
      console.log("Current theme state:", theme);
      console.log(
        "Dark mode class applied:",
        document.documentElement.classList.contains("dark")
      );
    }
  }, [theme, mounted]);

  // Avoid rendering with incorrect theme
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ThemeContext.Provider
      value={{ theme, setTheme: handleThemeChange, toggleTheme }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
