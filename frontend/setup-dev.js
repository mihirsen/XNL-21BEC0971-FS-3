const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

console.log("Setting up development environment for full-stack development...");

// Install concurrently if not already installed
try {
  console.log("Checking for concurrently package...");
  require.resolve("concurrently");
  console.log("concurrently is already installed.");
} catch (e) {
  console.log("Installing concurrently package...");
  execSync("npm install --save concurrently", { stdio: "inherit" });
}

// Check if backend exists and has node_modules
const backendPath = path.join(__dirname, "..", "backend");
const backendNodeModulesPath = path.join(backendPath, "node_modules");

if (fs.existsSync(backendPath)) {
  console.log("Backend directory found.");

  if (!fs.existsSync(backendNodeModulesPath)) {
    console.log("Installing backend dependencies...");
    execSync("cd ../backend && npm install", { stdio: "inherit" });
  } else {
    console.log("Backend dependencies already installed.");
  }

  // Make sure NestJS CLI is installed
  try {
    console.log("Checking for NestJS CLI...");
    execSync("cd ../backend && npx nest --version", { stdio: "pipe" });
    console.log("NestJS CLI is available.");
  } catch (e) {
    console.log("Installing NestJS CLI...");
    execSync("cd ../backend && npm install -g @nestjs/cli", {
      stdio: "inherit",
    });
  }
} else {
  console.error(
    "Backend directory not found. Make sure the backend directory exists at the same level as the frontend directory."
  );
  process.exit(1);
}

console.log("\nSetup complete! You can now run:");
console.log("1. To check if backend is running: node check-backend.js");
console.log("2. To start both servers: npm run dev:full");
