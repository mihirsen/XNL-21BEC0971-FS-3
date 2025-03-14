"use client";

import React from "react";
import { ThemeProvider } from "next-themes";
import { WebSocketProvider } from "@/providers/WebSocketProvider";
import { AlertProvider } from "@/components/global/GlobalAlert";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AlertProvider>
        <WebSocketProvider>{children}</WebSocketProvider>
      </AlertProvider>
    </ThemeProvider>
  );
}
