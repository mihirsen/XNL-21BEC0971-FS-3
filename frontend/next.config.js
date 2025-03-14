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
  experimental: {
    appDir: true,
  },
  images: {
    domains: ["via.placeholder.com", "source.unsplash.com"],
  },
};

// module.exports = withPWA(nextConfig);
module.exports = nextConfig;
