/** @type {import('next').NextConfig} */
// Temporarily commenting out PWA for debugging
// const withPWA = require("next-pwa")({
//   dest: "public",
//   disable: process.env.NODE_ENV === "development",
//   register: true,
//   skipWaiting: true,
// });

const path = require("path");

const nextConfig = {
  reactStrictMode: true,
  // Simply enable appDir without additional experimental features
  experimental: {
    appDir: true,
  },
  // Add output: 'export' to enable static site generation
  output: "export",
  images: {
    domains: ["via.placeholder.com", "source.unsplash.com"],
    // Required for static export
    unoptimized: true,
  },
  // Skip TypeScript type checking in production build
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  // Skip ESLint checking in production build
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  // Ensure trailing slashes for compatibility
  trailingSlash: true,
  // Configure webpack to handle path aliases correctly
  webpack: (config) => {
    // Correctly resolve path aliases
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": path.resolve(__dirname),
    };

    return config;
  },
  // Add API route rewrites for development mode
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:3001/:path*", // Proxy to Backend
      },
    ];
  },
};

// module.exports = withPWA(nextConfig);
module.exports = nextConfig;
