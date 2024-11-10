import React, { useState, useEffect } from "react";
import ProjectModal from "./NewProjectModal";
import Modal from "./NewTaskModal";
import TaskGroupModal from "./NewTaskGroupModal"; // Task Group Modal
import apiUtil from "../utils/apiUtil";

function ProjectPicker({
  selectTask,
  clientsData,
  selectedClient,
  setSelectedClient,
  selectedTask,
  setSelectedTask,
  selectedProject,
  setSelectedProject,
  selectedTaskGroup,
  setSelectedTaskGroup,
}) {
  // State initialization with fallback to empty array if clientsData is undefined
  const [searchTerm, setSearchTerm] = useState("");
  const [clients, setClients] = useState(clientsData || []); // Ensure clients is an array
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showTaskGroupModal, setShowTaskGroupModal] = useState(false); // State for task group modal

  // Update local state if clientsData prop changes
  useEffect(() => {
    if (clientsData) {
      setClients(clientsData); // Only update if clientsData is defined
    }
  }, [clientsData]); // Dependency array ensures update only when clientsData changes

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  // Filter clients and projects based on the search term
  const filteredClients = Array.isArray(clients)
    ? clients.filter((client) => {
        const clientName = client.name?.toLowerCase() || "";
        const projectMatchesSearch = client.projects?.some((project) => {
          const projectTitle = project.projectTitle?.toLowerCase() || "";
          return projectTitle.includes(searchTerm);
        });
        return clientName.includes(searchTerm) || projectMatchesSearch;
      })
    : [];

  const handleSaveTask = async (taskTitle) => {
    // Ensure taskTitle is not empty
    if (taskTitle.trim()) {
      try {
        // Extract IDs from the selected client, project, and task group
        const { id: clientId } = selectedClient; // assuming `selectedClient` has an `id` field
        const { id: projectId } = selectedProject; // assuming `selectedProject` has an `id` field
        const { id: taskGroupId } = selectedTaskGroup; // assuming `selectedTaskGroup` has an `id` field

        // Make an API request to create a new task
        const response = await apiUtil.createTask(
          clientId,
          projectId,
          taskGroupId,
          taskTitle
        );

        if (response.success) {
          // If the task was created successfully, update the clients state
          const updatedClients = clients.map((client) => ({
            ...client,
            projects: client.projects.map((project) => {
              if (project.id === selectedProject.id) {
                return {
                  ...project,
                  taskGroups: project.taskGroups.map((taskGroup) => {
                    if (taskGroup.id === selectedTaskGroup.id) {
                      // Add the new task to the taskGroup's tasks array
                      return {
                        ...taskGroup,
                        tasks: [...taskGroup.tasks, response.task],
                      };
                    }
                    return taskGroup;
                  }),
                };
              }
              return project;
            }),
          }));

          setClients(updatedClients); // Update clients state
          setShowTaskModal(false); // Close the task modal
        }
      } catch (error) {
        console.error("Error saving task:", error);
        // Handle the error (you can show a message to the user here)
      }
    }
  };

  // Handle creating a new task group
  const handleCreateTaskGroup = async (groupName, color) => {
    // Ensure groupName is not empty
    if (groupName.trim()) {
      try {
        // Extract IDs from the selected client and project
        const { id: clientId } = selectedClient; // assuming `selectedClient` has an `id` field
        const { id: projectId } = selectedProject; // assuming `selectedProject` has an `id` field

        // Make an API request to create a new task group
        const response = await apiUtil.createTaskGroup(
          clientId,
          projectId,
          groupName,
          color
        );

        if (response.success) {
          // If the task group was created successfully, update the clients state
          const updatedClients = clients.map((client) => ({
            ...client,
            projects: client.projects.map((project) => {
              if (project.id === selectedProject.id) {
                return {
                  ...project,
                  taskGroups: [
                    ...project.taskGroups,
                    {
                      id: response.taskGroup.id, // The ID should come from the API response
                      groupName,
                      color,
                      tasks: [],
                    },
                  ],
                };
              }
              return project;
            }),
          }));

          setClients(updatedClients); // Update clients state
          setShowTaskGroupModal(false); // Close task group modal
        }
      } catch (error) {
        console.error("Error saving task group:", error);
        // Handle the error (you can show a message to the user here)
      }
    }
  };

  return (
    <div
      style={{ minWidth: "25vw", maxWidth: "100%", zIndex: "4" }}
      className="w-100 position-absolute end-50 shadow-sm rounded rounded-2 bg-white"
    >
      <div>
        <form action="" className="py-2 px-2">
          <input
            type="text"
            className="form-control border border-1"
            placeholder="Search Project or Client"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </form>

        <div>
          {filteredClients.map((client) => (
            <div key={client.id}>
              {" "}
              {/* Client Key */}
              <div className="px-2 py-1 text-secondary fs-6">
                <strong>{client.name}</strong>
              </div>
              {client.projects?.map((project) => (
                <div key={`${client.id}-${project.id}`}>
                  {" "}
                  {/* Client and Project Key */}
                  <div className="px-2 py-1 text-muted fs-5">
                    {project.projectTitle}
                  </div>
                  {project?.taskGroups?.length > 0 ? (
                    project.taskGroups.map((taskGroup) => (
                      <div
                        key={`${project.id}-${taskGroup.id}`} // Project and Task Group Key
                        className="d-flex flex-column w-100 justify-content-between"
                      >
                        <div className="px-2 py-2 d-flex justify-content-between align-items-center">
                          <div
                            className="fs-6"
                            style={{ color: taskGroup.color || "#000" }}
                          >
                            {taskGroup.groupName}
                          </div>
                          <div className="d-flex gap-2">
                            <div>{taskGroup?.tasks?.length || 0} Tasks</div>
                            <div>
                              <i
                                className="fa-solid fa-chevron-down"
                                style={{ cursor: "pointer" }}
                              ></i>
                            </div>
                          </div>
                        </div>
                        {taskGroup.tasks?.length > 0 && (
                          <div className="">
                            <span>
                              {taskGroup.tasks.map((task) => (
                                <li
                                  key={`${taskGroup.id}-${task.id}`} // Task Group and Task Key
                                  className="py-1 px-3"
                                  onClick={() => {
                                    setSelectedClient(client);
                                    setSelectedProject(project);
                                    setSelectedTaskGroup(taskGroup);
                                    selectTask(task);
                                  }}
                                >
                                  {task.taskTitle}
                                </li>
                              ))}
                            </span>
                          </div>
                        )}
                        <button
                          onClick={() => {
                            setSelectedClient(client);
                            setSelectedProject(project);
                            setSelectedTaskGroup(taskGroup);
                            setShowTaskModal(true);
                          }}
                          className="btn btn-light w-100 text-start px-2 py-2 d-flex gap-2 align-items-center"
                        >
                          <i className="fa-solid fa-plus text-primary"></i>
                          <span className="text-primary"> Create New Task</span>
                        </button>
                      </div>
                    ))
                  ) : (
                    <button
                      onClick={() => {
                        setSelectedClient(client);
                        setSelectedProject(project);
                        setShowTaskGroupModal(true); // Open task group modal
                      }}
                      className="btn btn-light w-100 text-start px-2 py-2 d-flex gap-2 align-items-center"
                    >
                      <i className="fa-solid fa-plus text-primary"></i>
                      <span className="text-primary">
                        {" "}
                        Create New Task Group
                      </span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>

        <hr className="m-1" />

        <button
          onClick={() => setShowProjectModal(true)}
          className="btn btn-light w-100 text-start px-2 py-2 d-flex gap-2 align-items-center"
        >
          <i className="fa-solid fa-plus text-primary"></i>
          <span className="text-primary"> Create New Project</span>
        </button>

        <ProjectModal
          isOpen={showProjectModal}
          onClose={() => setShowProjectModal(false)}
          setClients={setClients}
          clientsData={clients}
        />
      </div>

      <Modal
        isOpen={showTaskModal}
        onClose={() => setShowTaskModal(false)}
        onSave={handleSaveTask}
        taskGroupId={selectedTaskGroup?.id}
      />

      {/* Task Group Modal */}
      <TaskGroupModal
        isOpen={showTaskGroupModal}
        onClose={() => setShowTaskGroupModal(false)}
        onSave={handleCreateTaskGroup}
        projectId={selectedProject?.id}
      />
    </div>
  );
}

export default ProjectPicker;
