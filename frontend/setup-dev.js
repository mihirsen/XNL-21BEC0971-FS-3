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
} else {
  console.error(
    "Backend directory not found. Make sure the backend directory exists at the same level as the frontend directory."
  );
  process.exit(1);
}

console.log(
  '\nSetup complete! You can now run "npm run dev:full" to start both frontend and backend servers.'
);
