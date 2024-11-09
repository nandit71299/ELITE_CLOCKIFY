// config/db.js
import mongoose from "mongoose";

const connection = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/clockify");
    console.log("MongoDB connected successfully.");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error; // Throwing the error so it can be caught in index.js
  }
};

export default connection;
