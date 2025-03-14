const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

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

// Load sample data from JSON file
function loadSampleData() {
  try {
    const dataPath = path.join(__dirname, "sample-sensor-data.json");
    const rawData = fs.readFileSync(dataPath, "utf8");
    return JSON.parse(rawData);
  } catch (error) {
    console.error("Error loading sample data:", error.message);
    return [];
  }
}

// Insert sample data into the database
async function insertSampleData() {
  const sampleData = loadSampleData();

  if (!sampleData || sampleData.length === 0) {
    console.error("No sample data found or loaded.");
    return [];
  }

  console.log(
    `Inserting ${sampleData.length} sample data records into the database...`
  );

  const savedData = [];
  for (const item of sampleData) {
    try {
      const sensorData = new SensorData(item);
      const savedDoc = await sensorData.save();
      console.log(`Saved ${item.type} sensor data with ID: ${savedDoc._id}`);
      savedData.push(savedDoc);
    } catch (error) {
      console.error(`Error saving ${item.type} sensor data:`, error.message);
    }
  }

  console.log(
    `Successfully saved ${savedData.length} out of ${sampleData.length} records.`
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

    if (existingCount > 0) {
      console.log("Sample data already exists. No need to insert more.");
      // Show a few examples
      const examples = await SensorData.find().limit(3);
      console.log("Examples:");
      examples.forEach((data) => {
        console.log(
          `- ${data.type} sensor: value=${data.value}, status=${data.status}`
        );
      });
    } else {
      // Insert sample data
      await insertSampleData();
      console.log("Sample data has been added to the database");
    }
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
