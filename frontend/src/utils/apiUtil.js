import axios from "axios";

// Base URL for the API (you can update this based on your backend URL or environment)
const API_BASE_URL = "http://localhost:3000/api"; // Update with your backend URL

// Create an axios instance with default settings
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Fetch all clients from the backend
export const fetchAllClients = async () => {
  try {
    const response = await api.get("/getAll");
    return response.data; // Return the client data
  } catch (error) {
    console.error("Error fetching all clients:", error);
    throw error;
  }
};

// Create a new project for a client
export const createProject = async (clientId, projectTitle) => {
  try {
    const response = await api.post("/createProject", {
      clientId,
      projectTitle,
    });
    return response.data; // Return the created project data
  } catch (error) {
    console.error("Error creating project:", error);
    throw error;
  }
};

// Create a new task for a project
export const createTask = async (
  clientId,
  projectId,
  taskGroupId,
  taskTitle
) => {
  try {
    const response = await api.post("/createTask", {
      clientId,
      projectId,
      taskGroupId,
      taskTitle,
    });
    return response.data; // Return the created task data
  } catch (error) {
    console.error("Error creating task:", error);
    throw error;
  }
};

// Fetch a specific client by ID (optional, for more detailed operations)
export const fetchClientById = async (clientId) => {
  try {
    const response = await api.get(`/getClientById/${clientId}`);
    return response.data; // Return the specific client data
  } catch (error) {
    console.error(`Error fetching client with ID ${clientId}:`, error);
    throw error;
  }
};

// Fetch all projects for a specific client
export const fetchClientProjects = async (clientId) => {
  try {
    const response = await api.get(`/getClientProjects/${clientId}`);
    return response.data; // Return the client's projects data
  } catch (error) {
    console.error(
      `Error fetching projects for client with ID ${clientId}:`,
      error
    );
    throw error;
  }
};

// Delete a task by taskId
export const deleteTask = async (clientId, projectId, taskId) => {
  try {
    const response = await api.delete("/deleteTask", {
      data: { clientId, projectId, taskId },
    });
    return response.data; // Return the response after deletion
  } catch (error) {
    console.error("Error deleting task:", error);
    throw error;
  }
};

// Delete a project by projectId
export const deleteProject = async (clientId, projectId) => {
  try {
    const response = await api.delete("/deleteProject", {
      data: { clientId, projectId },
    });
    return response.data; // Return the response after deletion
  } catch (error) {
    console.error("Error deleting project:", error);
    throw error;
  }
};

export const startTimer = async (clientId, projectId, taskGroupId, taskId) => {
  try {
    const response = await api.post("/startTimer", {
      clientId,
      projectId,
      taskGroupId,
      taskId,
    });
    return response.data; // Return the created task data
  } catch (error) {
    console.error("Error creating task:", error);
    throw error;
  }
};

export const endTimer = async (
  clientId,
  projectId,
  taskGroupId,
  taskId,
  timerId
) => {
  try {
    const response = await api.post("/endTimer", {
      clientId,
      projectId,
      taskGroupId,
      taskId,
      timerId,
    });
    return response.data; // Return the created task data
  } catch (error) {
    console.error("Error creating task:", error);
    throw error;
  }
};

export const createClient = async (clientName) => {
  try {
    const response = await api.post("/createClient", { name: clientName });
    return response.data; // Assuming the response contains the client data (including ID)
  } catch (error) {
    console.error("Error creating client:", error);
    throw error;
  }
};
export const createTaskGroup = async (
  clientId,
  projectId,
  groupName,
  color
) => {
  try {
    const response = await api.post("/createTaskGroup", {
      clientId,
      projectId,
      groupName,
    });
    return response.data; // Assuming the response contains the client data (including ID)
  } catch (error) {
    console.error("Error creating client:", error);
    throw error;
  }
};

export default {
  fetchAllClients,
  createClient,
  createProject,
  createTask,
  fetchClientById,
  fetchClientProjects,
  deleteTask,
  deleteProject,
  startTimer,
  endTimer,
  createTaskGroup,
};
