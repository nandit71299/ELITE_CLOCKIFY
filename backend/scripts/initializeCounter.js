// scripts/initializeCounters.js
import mongoose from "mongoose";
import Counter from "../models/counter.js"; // Make sure to adjust the path if needed
import connection from "../config/db.js"; // Import your connection logic

const initializeCounters = async () => {
  try {
    // Connect to MongoDB
    await connection(); // This will use the connection logic in config/db.js

    const counters = ["clientId", "projectId", "taskGroupId", "taskId"];

    for (const counter of counters) {
      // Check if the counter already exists, if not create it with a value of 0
      const existingCounter = await Counter.findOne({ _id: counter });
      if (!existingCounter) {
        await new Counter({ _id: counter, sequence_value: 0 }).save();
        console.log(`Counter for ${counter} initialized.`);
      } else {
        console.log(`Counter for ${counter} already exists.`);
      }
    }

    // Close MongoDB connection
    mongoose.disconnect();
    console.log("Counters initialized successfully.");
  } catch (error) {
    console.error("Error initializing counters:", error);
    mongoose.disconnect();
  }
};

// Call the function to initialize counters
initializeCounters();
