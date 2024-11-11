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

// Delete tasks from client -> project -> taskGroup -> tasks
export const deleteTasks = async (req, res) => {
  const { clientId, projectId, taskGroupId, taskIds } = req.body;
  console.log("Task IDs to delete:", taskIds);

  try {
    // Find the client
    const client = await Client.findOne({ id: clientId });
    if (!client) {
      return res
        .status(404)
        .json({ success: false, message: "Client not found" });
    }

    // Find the project within the client
    const project = client.projects.find((p) => p.id === Number(projectId));
    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }

    // Find the task group within the project
    const taskGroup = project.taskGroups.find(
      (tg) => tg.id === Number(taskGroupId)
    );
    if (!taskGroup) {
      return res
        .status(404)
        .json({ success: false, message: "Task group not found" });
    }

    // Filter out tasks that need to be deleted
    const filteredTasks = taskGroup.tasks.filter(
      (task) => !taskIds.includes(task.id)
    );

    // Ensure no task has a null id after filtering
    filteredTasks.forEach((task) => {
      if (task.id === null || task.id === undefined) {
        task.id = 0; // Set a default valid id (if needed)
      }
    });

    // Update the taskGroup with the filtered tasks
    taskGroup.tasks = filteredTasks;

    // Save the updated client document
    await client.save();

    res.status(200).json({
      success: true,
      message: `${taskIds.length} task(s) deleted successfully.`,
    });
  } catch (error) {
    console.error("Error deleting tasks:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting tasks",
      error,
    });
  }
};

export const deleteClients = async (req, res) => {
  const { clientIds } = req.body; // Expecting an array of client IDs in the request body

  if (!Array.isArray(clientIds) || clientIds.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Please provide an array of client IDs.",
    });
  }

  try {
    // Delete the clients based on the array of client IDs
    const result = await Client.deleteMany({ id: { $in: clientIds } });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "No clients found with the specified IDs.",
      });
    }

    res.status(200).json({
      success: true,
      message: `${result.deletedCount} client(s) deleted successfully.`,
    });
  } catch (error) {
    console.error("Error deleting clients:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting clients",
      error,
    });
  }
};

export const deleteTaskGroups = async (req, res) => {
  const { taskGroupIds } = req.body; // Expecting an array of taskGroupIds with clientId, projectId, taskGroupId

  if (!Array.isArray(taskGroupIds) || taskGroupIds.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Please provide an array of task group IDs to delete.",
    });
  }

  try {
    // Loop through each task group ID and remove the corresponding task group
    for (const { clientId, projectId, taskGroupId } of taskGroupIds) {
      // Find the client
      const client = await Client.findOne({ id: clientId });

      if (!client) {
        return res.status(404).json({
          success: false,
          message: `Client with ID ${clientId} not found.`,
        });
      }

      // Find the project within the client
      const project = client.projects.find((p) => p.id === Number(projectId));
      if (!project) {
        return res.status(404).json({
          success: false,
          message: `Project with ID ${projectId} not found in client ${clientId}`,
        });
      }

      // Find the task group within the project
      const taskGroupIndex = project.taskGroups.findIndex(
        (tg) => tg.id === Number(taskGroupId)
      );
      if (taskGroupIndex === -1) {
        return res.status(404).json({
          success: false,
          message: `Task group with ID ${taskGroupId} not found in project ${projectId}`,
        });
      }

      // Remove the task group
      project.taskGroups.splice(taskGroupIndex, 1);

      // Save the updated client document
      await client.save();
    }

    res.status(200).json({
      success: true,
      message: "Task group(s) deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting task groups:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting task group(s)",
      error,
    });
  }
};

export const deleteTimers = async (req, res) => {
  const { timerIds } = req.body; // Expecting an array of timerId objects

  if (!Array.isArray(timerIds) || timerIds.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Please provide an array of timer IDs to delete.",
    });
  }

  try {
    // Loop through each timer ID and remove the corresponding timer
    for (const {
      clientId,
      projectId,
      taskGroupId,
      taskId,
      timerId,
    } of timerIds) {
      // Find the client
      const client = await Client.findOne({ id: clientId });

      if (!client) {
        return res.status(404).json({
          success: false,
          message: `Client with ID ${clientId} not found.`,
        });
      }

      // Find the project within the client
      const project = client.projects.find((p) => p.id === projectId);
      if (!project) {
        return res.status(404).json({
          success: false,
          message: `Project with ID ${projectId} not found in client ${clientId}`,
        });
      }

      // Find the task group within the project
      const taskGroup = project.taskGroups.find((tg) => tg.id === taskGroupId);
      if (!taskGroup) {
        return res.status(404).json({
          success: false,
          message: `Task group with ID ${taskGroupId} not found in project ${projectId}`,
        });
      }

      // Find the task within the task group
      const task = taskGroup.tasks.find((t) => t.id === taskId);
      if (!task) {
        return res.status(404).json({
          success: false,
          message: `Task with ID ${taskId} not found in task group ${taskGroupId}`,
        });
      }

      // Find the timer in the task
      const timerIndex = task.timers.findIndex((t) => t.id === timerId);
      if (timerIndex === -1) {
        return res.status(404).json({
          success: false,
          message: `Timer with ID ${timerId} not found in task ${taskId}`,
        });
      }

      // Remove the timer from the task
      task.timers.splice(timerIndex, 1);

      // Save the updated client document
      await client.save();
    }

    res.status(200).json({
      success: true,
      message: "Timer(s) deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting timers:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while deleting timer(s).",
      error,
    });
  }
};
