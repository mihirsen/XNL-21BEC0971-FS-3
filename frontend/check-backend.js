const http = require("http");

console.log("Checking if backend is running...");

// Try to connect to the backend health endpoint
const req = http.request(
  {
    host: "localhost",
    port: 3001,
    path: "/health",
    method: "GET",
    timeout: 5000,
  },
  (res) => {
    let data = "";

    res.on("data", (chunk) => {
      data += chunk;
    });

    res.on("end", () => {
      if (res.statusCode === 200) {
        console.log("✅ Backend is running!");
        try {
          const parsed = JSON.parse(data);
          console.log("Response:", parsed);
        } catch (e) {
          console.log("Response:", data);
        }
      } else {
        console.log(`❌ Backend returned status ${res.statusCode}`);
        console.log("Response:", data);
      }
    });
  }
);

req.on("error", (error) => {
  console.error("❌ Could not connect to backend:", error.message);
  console.log("\nMake sure the backend is running with:");
  console.log("cd ../backend && npm run start:dev");
});

req.on("timeout", () => {
  console.error("❌ Connection to backend timed out");
  req.destroy();
});

req.end();
