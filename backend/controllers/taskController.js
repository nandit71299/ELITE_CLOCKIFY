import Client from "../models/client.js";
import { getNextSequenceValue } from "../utils/counterHelper.js"; // Import the counter helper function

// Get all clients
export const getAllClients = async (req, res) => {
  try {
    const clients = await Client.find();
    if (!clients || clients.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No clients found" });
    }
    res.json({ success: true, clients });
  } catch (error) {
    console.error("Error fetching clients:", error);
    res
      .status(500)
      .json({ success: false, message: "Internal Server Error", error });
  }
};

// Create a new project
export const createProject = async (req, res) => {
  const { clientId, projectTitle } = req.body;
  try {
    const client = await Client.findOne({ id: clientId });
    if (!client) {
      return res
        .status(404)
        .json({ success: false, message: "Client not found" });
    }

    const projectId = await getNextSequenceValue("projectId");

    const newProject = {
      id: projectId,
      clientId,
      projectTitle,
      taskGroups: [],
    };

    client.projects.push(newProject);

    await client.save();

    res.status(201).json({
      success: true,
      message: "Project created successfully",
      project: newProject,
    });
  } catch (error) {
    console.error("Error creating project:", error);
    res.status(500).json({
      success: false,
      message: "Error creating project",
      error,
    });
  }
};

// Create a new task
export const createTask = async (req, res) => {
  const { clientId, projectId, taskGroupId, taskTitle } = req.body;

  try {
    const client = await Client.findOne({ id: clientId });
    if (!client) {
      return res
        .status(404)
        .json({ success: false, message: "Client not found" });
    }

    const project = client.projects.find((p) => p.id === Number(projectId));
    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }

    const taskGroup = project.taskGroups.find(
      (tg) => tg.id === Number(taskGroupId)
    );
    if (!taskGroup) {
      return res
        .status(404)
        .json({ success: false, message: "Task group not found" });
    }

    const taskId = await getNextSequenceValue("taskId");

    const newTask = {
      id: taskId,
      taskTitle,
      timers: [],
    };

    taskGroup.tasks.push(newTask);

    await client.save();

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      task: newTask,
    });
  } catch (error) {
    console.error("Error creating new task:", error);
    res
      .status(400)
      .json({ success: false, message: "Error creating new task", error });
  }
};

// Start timer
export const startTimer = async (req, res) => {
  const { clientId, projectId, taskGroupId, taskId } = req.body;

  try {
    const client = await Client.findOne({ id: Number(clientId) });
    if (!client) {
      return res
        .status(404)
        .json({ success: false, message: "Client not found" });
    }

    const project = client.projects.find((p) => p.id === Number(projectId));
    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }

    const taskGroup = project.taskGroups.find(
      (group) => group.id === Number(taskGroupId)
    );
    if (!taskGroup) {
      return res
        .status(404)
        .json({ success: false, message: "Task group not found" });
    }

    const task = taskGroup.tasks.find((t) => t.id === Number(taskId));
    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }

    const timerId = await getNextSequenceValue("timerId");

    const newTimer = {
      id: timerId,
      startTime: new Date(),
      endTime: null,
    };

    task.timers.push(newTimer);
    await client.save();

    res.status(200).json({
      success: true,
      message: "Timer started successfully",
      timer: newTimer,
    });
  } catch (error) {
    console.error("Error starting timer:", error);
    res.status(400).json({
      success: false,
      message: "Error starting timer",
      error,
    });
  }
};

// End timer
export const endTimer = async (req, res) => {
  const { clientId, projectId, taskGroupId, taskId, timerId } = req.body;

  try {
    const client = await Client.findOne({ id: Number(clientId) });
    if (!client) {
      return res
        .status(404)
        .json({ success: false, message: "Client not found" });
    }

    const project = client.projects.find((p) => p.id === Number(projectId));
    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }

    const taskGroup = project.taskGroups.find(
      (group) => group.id === Number(taskGroupId)
    );
    if (!taskGroup) {
      return res
        .status(404)
        .json({ success: false, message: "Task group not found" });
    }

    const task = taskGroup.tasks.find((t) => t.id === Number(taskId));
    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }

    const timer = task.timers.find((t) => t.id === Number(timerId));
    if (!timer) {
      return res
        .status(404)
        .json({ success: false, message: "Timer not found" });
    }

    timer.endTime = new Date();
    await client.save();

    res.status(200).json({
      success: true,
      message: "Timer ended successfully",
      timer,
    });
  } catch (error) {
    console.error("Error ending timer:", error);
    res.status(400).json({
      success: false,
      message: "Error ending timer",
      error,
    });
  }
};

// Create a new client
export const createClient = async (req, res) => {
  const { name } = req.body;

  try {
    const clientId = await getNextSequenceValue("clientId");
    const newClient = new Client({
      id: clientId,
      name,
      projects: [],
    });

    console.log(newClient);
    await newClient.save();

    res.status(201).json({
      success: true,
      message: "Client created successfully",
      clientId: newClient.id,
    });
  } catch (error) {
    console.error("Error creating client:", error);
    res.status(500).json({
      success: false,
      message: "Error creating client",
      error,
    });
  }
};

// Create a new task group
export const createTaskGroup = async (req, res) => {
  const { clientId, projectId, groupName } = req.body;

  try {
    const client = await Client.findOne({ id: clientId });
    if (!client) {
      return res
        .status(404)
        .json({ success: false, message: "Client not found" });
    }

    const project = client.projects.find(
      (project) => project.id === Number(projectId)
    );
    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }

    const taskGroupId = await getNextSequenceValue("taskGroupId");

    const newTaskGroup = {
      id: taskGroupId,
      groupName,
      color: "#000000",
      tasks: [],
    };

    project.taskGroups.push(newTaskGroup);

    await client.save();

    res.status(201).json({
      success: true,
      message: "Task group created successfully",
      taskGroup: newTaskGroup,
    });
  } catch (error) {
    console.error("Error creating task group:", error);
    res.status(500).json({
      success: false,
      message: "Error creating task group",
      error,
    });
  }
};
