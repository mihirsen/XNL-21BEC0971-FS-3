const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

// Set environment variables
process.env.NEXT_SKIP_TYPESCRIPT_AND_ESLINT_CHECKS = "1";

console.log("Starting build process...");
console.log("Node.js version:", process.version);
console.log("Current directory:", process.cwd());

// Display Next.js version
try {
  const packageJson = require("./package.json");
  console.log("Next.js version:", packageJson.dependencies.next);
} catch (error) {
  console.log("Could not determine Next.js version:", error.message);
}

try {
  // Display Next.js config
  console.log("Next.js config:");
  const nextConfig = require("./next.config.js");
  console.log(JSON.stringify(nextConfig, null, 2));

  // Run Next.js build
  console.log("\nRunning next build...");
  execSync("next build", { stdio: "inherit" });

  // Check if out directory exists after build
  const outDir = path.join(__dirname, "out");
  if (fs.existsSync(outDir)) {
    console.log("Output directory exists after build:", outDir);

    // List files in the out directory
    const files = fs.readdirSync(outDir);
    console.log("Files in out directory:", files);
  } else {
    console.log("Output directory does not exist after build");

    // Run next export if needed
    console.log("Running next export...");
    execSync("next export", { stdio: "inherit" });

    // Check again if out directory exists
    if (fs.existsSync(outDir)) {
      console.log("Output directory exists after export:", outDir);
      const files = fs.readdirSync(outDir);
      console.log("Files in out directory:", files);
    } else {
      console.log("Output directory still does not exist after export");

      // Check if .next directory exists
      const nextDir = path.join(__dirname, ".next");
      if (fs.existsSync(nextDir)) {
        console.log(".next directory exists:", nextDir);
        const nextFiles = fs.readdirSync(nextDir);
        console.log("Files in .next directory:", nextFiles);
      } else {
        console.log(".next directory does not exist");
      }

      process.exit(1);
    }
  }

  console.log("Build completed successfully");
} catch (error) {
  console.error("Build failed with error:", error.message);
  console.error("Stack trace:", error.stack);
  process.exit(1);
}
