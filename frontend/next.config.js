/** @type {import('next').NextConfig} */
// Temporarily commenting out PWA for debugging
// const withPWA = require("next-pwa")({
//   dest: "public",
//   disable: process.env.NODE_ENV === "development",
//   register: true,
//   skipWaiting: true,
// });

const nextConfig = {
  reactStrictMode: true,
  // Remove experimental appDir which might not be fully compatible with static export
  // experimental: {
  //   appDir: true,
  // },
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
};

// module.exports = withPWA(nextConfig);
module.exports = nextConfig;
