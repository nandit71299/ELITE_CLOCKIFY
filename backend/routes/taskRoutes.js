// routes/taskRoutes.js
import express from "express";
import * as taskController from "../controllers/taskController.js"; // Import the controller

const router = express.Router();

// Define routes and associate them with controller actions
router.get("/getAll", taskController.getAllClients);
router.post("/createClient", taskController.createClient);
router.post("/createProject", taskController.createProject);
router.post("/createTask", taskController.createTask);
router.post("/createTaskGroup", taskController.createTaskGroup);
router.post("/startTimer", taskController.startTimer);
router.post("/endTimer", taskController.endTimer);

export default router;
