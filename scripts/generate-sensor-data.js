const fetch = require("node-fetch");

// Configuration
const API_URL = "http://localhost:3001/iot/sensor-data";
const AUTH_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFkbWluIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"; // This is a sample token

// Sample sensor types with their value ranges and coordinates
const sensorTypes = [
  {
    type: "traffic",
    valueRange: [0, 1000],
    coordinates: [
      [-74.006, 40.7128], // NYC
      [-74.009, 40.715],
      [-74.0021, 40.7195],
      [-73.9981, 40.7231],
      [-73.9951, 40.7178],
    ],
    statusThresholds: { warning: 600, critical: 800 },
  },
  {
    type: "air_quality",
    valueRange: [0, 500],
    coordinates: [
      [-74.005, 40.712],
      [-74.011, 40.718],
      [-74.003, 40.722],
      [-73.995, 40.719],
      [-73.991, 40.713],
    ],
    statusThresholds: { warning: 100, critical: 200 },
  },
  {
    type: "energy",
    valueRange: [0, 5000],
    coordinates: [
      [-74.008, 40.71],
      [-74.012, 40.716],
      [-74.001, 40.72],
      [-73.997, 40.715],
      [-73.992, 40.709],
    ],
    statusThresholds: { warning: 3000, critical: 4500 },
  },
  {
    type: "water",
    valueRange: [0, 2000],
    coordinates: [
      [-74.002, 40.711],
      [-74.013, 40.717],
      [-74.006, 40.721],
      [-73.998, 40.714],
      [-73.99, 40.708],
    ],
    statusThresholds: { warning: 1200, critical: 1800 },
  },
];

// Generate random sensor reading
function generateSensorReading(sensorType) {
  const type = sensorType.type;
  const [min, max] = sensorType.valueRange;
  const value = Math.floor(Math.random() * (max - min + 1)) + min;

  // Determine status based on value thresholds
  let status = "normal";
  if (value >= sensorType.statusThresholds.critical) {
    status = "critical";
  } else if (value >= sensorType.statusThresholds.warning) {
    status = "warning";
  }

  // Pick a random coordinate pair
  const coordinateIndex = Math.floor(
    Math.random() * sensorType.coordinates.length
  );
  const coordinates = sensorType.coordinates[coordinateIndex];

  // Add some randomness to the coordinates to simulate different locations
  const jitter = 0.002; // ~200m of randomness
  const adjustedCoordinates = [
    coordinates[0] + (Math.random() * jitter * 2 - jitter),
    coordinates[1] + (Math.random() * jitter * 2 - jitter),
  ];

  return {
    type,
    value,
    status,
    coordinates: adjustedCoordinates,
    timestamp: new Date(),
    metadata: {
      deviceId: `${type}-sensor-${Math.floor(Math.random() * 1000)}`,
      batteryLevel: Math.floor(Math.random() * 100),
    },
  };
}

// Send data to API
async function sendSensorData(data) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${AUTH_TOKEN}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const result = await response.json();
    console.log(
      `Successfully sent data for ${data.type} sensor: ${
        result._id || "ID not returned"
      }`
    );
    return result;
  } catch (error) {
    console.error(
      `Failed to send data for ${data.type} sensor:`,
      error.message
    );
    return null;
  }
}

// Main function to generate and send multiple readings
async function generateAndSendData(count = 20) {
  console.log(`Generating and sending ${count} sensor readings...`);

  const results = [];
  for (let i = 0; i < count; i++) {
    // Randomly select a sensor type
    const sensorTypeIndex = Math.floor(Math.random() * sensorTypes.length);
    const sensorType = sensorTypes[sensorTypeIndex];

    // Generate a reading
    const reading = generateSensorReading(sensorType);

    // Send the reading and collect the result
    const result = await sendSensorData(reading);
    if (result) {
      results.push(result);
    }

    // Add a small delay to avoid overwhelming the API
    await new Promise((resolve) => setTimeout(resolve, 200));
  }

  console.log(`Successfully sent ${results.length} out of ${count} readings.`);
  return results;
}

// Execute the main function
generateAndSendData()
  .then(() => console.log("Data generation completed."))
  .catch((error) =>
    console.error("An error occurred during data generation:", error)
  );
