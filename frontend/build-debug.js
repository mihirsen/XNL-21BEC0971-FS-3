const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

// Set environment variables
process.env.NEXT_SKIP_TYPESCRIPT_AND_ESLINT_CHECKS = "1";

console.log("Starting build process...");

try {
  // Run Next.js build
  console.log("Running next build...");
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
      process.exit(1);
    }
  }

  console.log("Build completed successfully");
} catch (error) {
  console.error("Build failed:", error);
  process.exit(1);
}
