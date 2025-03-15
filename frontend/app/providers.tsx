"use client";

import React, { ReactNode } from "react";
import { ThemeProvider } from "next-themes";
import { WebSocketProvider } from "@/providers/WebSocketProvider";
import { AlertProvider } from "@/components/global/GlobalAlert";

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  // Create type-safe versions of our components with proper children typing
  const TypeSafeThemeProvider = ThemeProvider as React.FC<{
    children: ReactNode;
    attribute: string;
    defaultTheme: string;
    enableSystem: boolean;
  }>;

  const TypeSafeAlertProvider = AlertProvider as React.FC<{
    children: ReactNode;
  }>;

  const TypeSafeWebSocketProvider = WebSocketProvider as React.FC<{
    children: ReactNode;
  }>;

  return (
    <TypeSafeThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      children={
        <TypeSafeAlertProvider
          children={<TypeSafeWebSocketProvider children={children} />}
        />
      }
    />
  );
}
