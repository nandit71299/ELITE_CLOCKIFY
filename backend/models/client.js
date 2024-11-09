// models/client.js
import mongoose from "mongoose";

// Timer schema
const TimerSchema = new mongoose.Schema({
  id: { type: Number, unique: true },
  startTime: {
    type: Date,
    default: null,
  },
  endTime: {
    type: Date,
    default: null,
  },
});

// Task schema
const TaskSchema = new mongoose.Schema({
  id: { type: Number, unique: true }, // Sequential ID for each task
  taskTitle: {
    type: String,
    required: true,
  },
  timers: [TimerSchema], // Array of timers for each task
});

// TaskGroup schema
const TaskGroupSchema = new mongoose.Schema({
  id: { type: Number, unique: true }, // Sequential ID for each task group
  groupName: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
  tasks: [TaskSchema], // Array of tasks in this task group
});

// Project schema
const ProjectSchema = new mongoose.Schema({
  id: { type: Number, unique: true }, // Sequential ID for each project
  projectTitle: {
    type: String,
    required: true,
  },
  taskGroups: [TaskGroupSchema], // Array of task groups for the project
});

// Client schema
const ClientSchema = new mongoose.Schema({
  id: { type: Number, unique: true }, // Sequential ID for the client
  name: {
    type: String,
    required: true,
  },
  projects: [ProjectSchema], // Array of projects for this client
});

// Define and export the Client model
const Client = mongoose.model("Client", ClientSchema);
export default Client;
