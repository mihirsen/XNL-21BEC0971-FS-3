"use client";

import React, { ReactNode } from "react";
import { ThemeProvider } from "next-themes";
import { WebSocketProvider } from "@/providers/WebSocketProvider";
import { AlertProvider } from "@/components/global/GlobalAlert";

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    // @ts-expect-error - Type definition issue
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {/* @ts-expect-error - Type definition issue */}
      <AlertProvider>
        {/* @ts-expect-error - Type definition issue */}
        <WebSocketProvider>{children}</WebSocketProvider>
      </AlertProvider>
    </ThemeProvider>
  );
}
