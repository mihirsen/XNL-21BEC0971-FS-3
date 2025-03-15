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
  console.log(
    "TailwindCSS version:",
    packageJson.dependencies.tailwindcss || "Not found in dependencies"
  );
} catch (error) {
  console.log("Could not determine versions:", error.message);
}

// Check for installed node_modules
console.log("\nChecking for critical dependencies:");
const dependenciesToCheck = [
  "tailwindcss",
  "next",
  "react",
  "react-dom",
  "postcss",
];

dependenciesToCheck.forEach((dep) => {
  try {
    const moduleExists = fs.existsSync(
      path.join(__dirname, "node_modules", dep)
    );
    console.log(`- ${dep}: ${moduleExists ? "INSTALLED" : "MISSING"}`);

    if (moduleExists) {
      try {
        // Try to require the package to verify it's properly installed
        require(dep);
        console.log(`  - Module can be required: YES`);
      } catch (err) {
        console.log(`  - Module can be required: NO - ${err.message}`);
      }
    }
  } catch (err) {
    console.log(`- Error checking ${dep}: ${err.message}`);
  }
});

// Check for the existence of key components that might be causing issues
const componentsToCheck = [
  "components/layout/MainLayout.tsx",
  "components/ui/card.tsx",
];

console.log("\nChecking for critical components:");
componentsToCheck.forEach((componentPath) => {
  const fullPath = path.join(__dirname, componentPath);
  const exists = fs.existsSync(fullPath);
  console.log(`- ${componentPath}: ${exists ? "EXISTS" : "MISSING"}`);

  if (exists) {
    try {
      const content = fs.readFileSync(fullPath, "utf8");
      const hasDefaultExport =
        content.includes("export default") ||
        content.includes("= React.forwardRef");
      console.log(`  - Has exports: ${hasDefaultExport ? "YES" : "NO"}`);
    } catch (err) {
      console.log(`  - Error reading file: ${err.message}`);
    }
  }
});

// Check tailwind configuration
const tailwindConfigPath = path.join(__dirname, "tailwind.config.js");
if (fs.existsSync(tailwindConfigPath)) {
  console.log("\nTailwind config exists");
  try {
    const tailwindConfig = require("./tailwind.config.js");
    console.log("Tailwind config content:", tailwindConfig.content);
  } catch (error) {
    console.log("Error loading tailwind config:", error.message);
  }
} else {
  console.log("\nTailwind config file not found!");
}

// Check PostCSS configuration
const postcssConfigPath = path.join(__dirname, "postcss.config.js");
if (fs.existsSync(postcssConfigPath)) {
  console.log("\nPostCSS config exists");
  try {
    const postcssConfig = require("./postcss.config.js");
    console.log("PostCSS plugins:", Object.keys(postcssConfig.plugins || {}));
  } catch (error) {
    console.log("Error loading PostCSS config:", error.message);
  }
} else {
  console.log("\nPostCSS config file not found!");
}

// Check tsconfig paths configuration
try {
  const tsconfig = require("./tsconfig.json");
  console.log("\nTSConfig paths configuration:");
  console.log(JSON.stringify(tsconfig.compilerOptions.paths, null, 2));
} catch (error) {
  console.log("\nError reading tsconfig.json:", error.message);
}

try {
  // Display Next.js config
  console.log("\nNext.js config:");
  const nextConfig = require("./next.config.js");
  console.log(JSON.stringify(nextConfig, null, 2));

  // Validate experimental features
  console.log("\nValidating Next.js config:");
  if (nextConfig.experimental) {
    console.log(
      "Experimental features detected:",
      Object.keys(nextConfig.experimental)
    );

    // Check for appDir
    if (nextConfig.experimental.appDir) {
      console.log("- appDir is enabled: compatible with Next.js 13.1.1");
    }

    // Check for potentially problematic experimental features
    if (nextConfig.experimental.outputFileTracingExcludes) {
      console.log(
        "- WARNING: outputFileTracingExcludes might not be compatible with Next.js 13.1.1"
      );
    }
  }

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
