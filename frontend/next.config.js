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
  // Re-enable experimental appDir which is needed for the app directory
  experimental: {
    appDir: true,
    // Add workarounds for app directory in static export
    outputFileTracingExcludes: {
      "*": [
        "node_modules/@swc/core-linux-x64-gnu",
        "node_modules/@swc/core-linux-x64-musl",
        "node_modules/@esbuild/linux-x64",
      ],
    },
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
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Correctly resolve path aliases
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": path.resolve(__dirname),
    };

    return config;
  },
};

// module.exports = withPWA(nextConfig);
module.exports = nextConfig;
