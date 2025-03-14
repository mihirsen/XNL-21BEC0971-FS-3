const mongoose = require("mongoose");

// MongoDB connection string (same as in the backend .env)
const MONGODB_URI = "mongodb://localhost:27017/smart-city";

// Define sensor data schema (matching the backend schema)
const SensorDataSchema = new mongoose.Schema({
  type: { type: String, required: true },
  value: { type: Number, required: true },
  status: {
    type: String,
    required: true,
    enum: ["normal", "warning", "critical"],
    default: "normal",
  },
  coordinates: { type: [Number], required: true },
  timestamp: { type: Date, required: true, default: Date.now },
  metadata: { type: Object },
});

const SensorData = mongoose.model("SensorData", SensorDataSchema);

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
      [-74.0101, 40.7165], // Additional coordinates for more data points
      [-74.0043, 40.7208],
      [-73.9976, 40.7219],
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
      [-74.007, 40.714], // Additional coordinates
      [-74.001, 40.717],
      [-73.998, 40.721],
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
      [-74.005, 40.713], // Additional coordinates
      [-74.009, 40.718],
      [-73.995, 40.711],
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
      [-74.004, 40.716], // Additional coordinates
      [-74.01, 40.712],
      [-73.994, 40.718],
    ],
    statusThresholds: { warning: 1200, critical: 1800 },
  },
  // New sensor type for more variety
  {
    type: "noise",
    valueRange: [30, 120],
    coordinates: [
      [-74.003, 40.713],
      [-74.011, 40.719],
      [-74.002, 40.723],
      [-73.996, 40.717],
      [-73.99, 40.71],
      [-74.008, 40.715],
      [-74.001, 40.72],
      [-73.994, 40.712],
    ],
    statusThresholds: { warning: 85, critical: 100 },
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

  // Create timestamps from the past 24 hours
  const now = new Date();
  const pastHours = Math.floor(Math.random() * 24); // Random hours in the past (0-24)
  const pastMinutes = Math.floor(Math.random() * 60); // Random minutes (0-59)
  const timestamp = new Date(
    now.getTime() - (pastHours * 60 + pastMinutes) * 60 * 1000
  );

  return {
    type,
    value,
    status,
    coordinates: adjustedCoordinates,
    timestamp,
    metadata: {
      deviceId: `${type}-sensor-${Math.floor(Math.random() * 1000)}`,
      batteryLevel: Math.floor(Math.random() * 100),
      manufacturer: [
        "Siemens",
        "Bosch",
        "ABB",
        "Schneider Electric",
        "Honeywell",
      ][Math.floor(Math.random() * 5)],
      model: ["SM100", "IoT-3000", "SmartSense", "CityPulse", "UrbanNode"][
        Math.floor(Math.random() * 5)
      ],
      firmwareVersion: ["1.2.3", "2.0.1", "3.5.2", "4.1.0", "1.0.9"][
        Math.floor(Math.random() * 5)
      ],
      lastMaintenance: new Date(
        now.getTime() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000
      )
        .toISOString()
        .split("T")[0],
    },
  };
}

// Generate and save sensor readings
async function generateAndSaveSensorData(count = 50) {
  console.log(`Generating ${count} sensor readings...`);

  const savedData = [];

  // Create a distribution ensuring we have normal, warning, and critical data points
  // for better visualization and testing
  for (let i = 0; i < count; i++) {
    // Randomly select a sensor type
    const sensorTypeIndex = Math.floor(Math.random() * sensorTypes.length);
    const sensorType = sensorTypes[sensorTypeIndex];

    // Create the reading
    let reading;

    // Force some sensors into warning/critical states to ensure we have data in all states
    if (i < count * 0.2) {
      // 20% critical
      const [min, max] = sensorType.valueRange;
      const criticalMin = sensorType.statusThresholds.critical;
      const value =
        criticalMin + Math.floor(Math.random() * (max - criticalMin + 1));
      reading = generateSensorReading(sensorType);
      reading.value = value;
      reading.status = "critical";
    } else if (i < count * 0.5) {
      // 30% warning
      const [min, max] = sensorType.valueRange;
      const warningMin = sensorType.statusThresholds.warning;
      const criticalMin = sensorType.statusThresholds.critical;
      const value =
        warningMin + Math.floor(Math.random() * (criticalMin - warningMin));
      reading = generateSensorReading(sensorType);
      reading.value = value;
      reading.status = "warning";
    } else {
      // 50% normal
      reading = generateSensorReading(sensorType);
    }

    // Create a new document
    const sensorData = new SensorData(reading);

    // Save to database
    try {
      const savedDoc = await sensorData.save();
      console.log(
        `Saved ${sensorType.type} sensor data with ID: ${savedDoc._id}`
      );
      savedData.push(savedDoc);
    } catch (error) {
      console.error(
        `Error saving ${sensorType.type} sensor data:`,
        error.message
      );
    }
  }

  console.log(
    `Successfully saved ${savedData.length} out of ${count} readings.`
  );
  return savedData;
}

// Main function
async function main() {
  console.log("Connecting to MongoDB...");

  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Connected to MongoDB");

    // Check if there's existing data
    const existingCount = await SensorData.countDocuments();
    console.log(`Found ${existingCount} existing sensor data documents`);

    // Always generate new data for the demo
    console.log("Generating fresh sample data...");
    await SensorData.deleteMany({}); // Clear existing data
    await generateAndSaveSensorData(100); // Generate 100 sample points
    console.log("Sample data has been added to the database");

    // Show a few examples of generated data
    const examples = await SensorData.find().limit(5);
    console.log("Examples of generated data:");
    examples.forEach((data) => {
      console.log(
        `- ${data.type} sensor: value=${data.value}, status=${data.status}, timestamp=${data.timestamp}`
      );
    });

    // Show status counts
    const normalCount = await SensorData.countDocuments({ status: "normal" });
    const warningCount = await SensorData.countDocuments({ status: "warning" });
    const criticalCount = await SensorData.countDocuments({
      status: "critical",
    });
    console.log(
      `Status distribution: normal=${normalCount}, warning=${warningCount}, critical=${criticalCount}`
    );
  } catch (error) {
    console.error("Error:", error.message);
  } finally {
    // Close database connection
    await mongoose.connection.close();
    console.log("Disconnected from MongoDB");
  }
}

// Run the main function
main().catch(console.error);
