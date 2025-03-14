import React, { ReactNode } from "react";
import "./globals.css";
import Providers from "./providers";

// Removing metadata export as it's not supported in Next.js 13.1.1
// export const metadata = {
//   title: "Smart City Dashboard",
//   description:
//     "Real-time monitoring and analytics for your smart city infrastructure",
//   manifest: "/manifest.json",
//   themeColor: "#3B82F6",
//   viewport: "width=device-width, initial-scale=1, maximum-scale=1",
//   appleWebApp: {
//     capable: true,
//     statusBarStyle: "black-translucent",
//     title: "Smart City",
//   },
// };

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <head>
        <title>Smart City Monitor</title>
        <meta
          name="description"
          content="Real-time Smart City Monitoring Platform"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="theme-color" content="#3B82F6" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta name="apple-mobile-web-app-title" content="Smart City" />
      </head>
      <body className="h-full min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        {/* @ts-expect-error - Works at runtime, TypeScript issue only */}
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
