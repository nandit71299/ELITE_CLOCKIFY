// models/counter.js
import mongoose from "mongoose";

// Schema for counters
const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // Sequence name, like 'clientId', 'projectId', etc.
  sequence_value: { type: Number, default: 0 }, // The counter value
});

// Create and export the Counter model
const Counter = mongoose.model("Counter", counterSchema);

export default Counter;
