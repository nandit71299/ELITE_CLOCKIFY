import React, { useState, useEffect } from "react";
import apiUtil from "../utils/apiUtil";
import TimeTrackerRecorder from "../components/TimeTrackerRecorder";
import Timer from "../components/ReactTimer";
import ProjectPicker from "../components/ProjectPicker";

function Dashboard() {
  const [clients, setClients] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedTaskGroup, setSelectedTaskGroup] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [timerId, setTimerId] = useState(null);

  const [startDateFilter, setStartDateFilter] = useState("");
  const [endDateFilter, setEndDateFilter] = useState("");
  const [minDurationFilter, setMinDurationFilter] = useState(0);
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    const getClients = async () => {
      try {
        const clientData = await apiUtil.fetchAllClients();
        if (clientData.success) {
          setClients(clientData.clients);
        } else {
          console.error("Error fetching clients:", clientData.message);
        }
      } catch (error) {
        console.error("Error fetching clients:", error);
      }
    };
    getClients();
  }, []);

  const selectTask = (task) => {
    setSelectedTask(task);
  };

  const setStartTime = async (time) => {
    try {
      const response = await apiUtil.startTimer(
        selectedClient.id,
        selectedProject.id,
        selectedTaskGroup.id,
        selectedTask.id
      );

      if (response.success) {
        setTimerId(response.timer.id);
        setSelectedTask((prevTask) => {
          const updatedTask = {
            ...prevTask,
            timers: [
              ...prevTask.timers,
              { startTime: time, endTime: null, id: response.timer.id },
            ],
          };

          const updatedClients = clients.map((client) => {
            if (client.id === selectedClient.id) {
              return {
                ...client,
                projects: client.projects.map((project) => {
                  if (project.id === selectedProject.id) {
                    return {
                      ...project,
                      taskGroups: project.taskGroups.map((taskGroup) => {
                        if (taskGroup.id === selectedTaskGroup.id) {
                          return {
                            ...taskGroup,
                            tasks: taskGroup.tasks.map((task) => {
                              if (task.id === selectedTask.id) {
                                return {
                                  ...task,
                                  timers: [
                                    ...task.timers,
                                    { startTime: time, endTime: null },
                                  ],
                                };
                              }
                              return task;
                            }),
                          };
                        }
                        return taskGroup;
                      }),
                    };
                  }
                  return project;
                }),
              };
            }
            return client;
          });

          setClients(updatedClients);
          return updatedTask;
        });

        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Error starting timer:", error);
      return false;
    }
  };

  const setEndTime = async (time) => {
    try {
      const response = await apiUtil.endTimer(
        selectedClient.id,
        selectedProject.id,
        selectedTaskGroup.id,
        selectedTask.id,
        timerId
      );

      if (response.success) {
        setSelectedTask((prevTask) => {
          const updatedTask = {
            ...prevTask,
            timers: prevTask.timers.map((timer) =>
              timer.id === timerId && timer.endTime === null
                ? { ...timer, endTime: time }
                : timer
            ),
          };

          const updatedClients = updateClientsWithTask(updatedTask);
          setClients(updatedClients);
          return updatedTask;
        });

        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Error stopping timer:", error);
      return false;
    }
  };

  const updateClientsWithTask = (updatedTask) => {
    return clients.map((client) => ({
      ...client,
      projects: client.projects.map((project) => ({
        ...project,
        taskGroups: project.taskGroups.map((taskGroup) => ({
          ...taskGroup,
          tasks: taskGroup.tasks.map((task) =>
            task.id === updatedTask.id
              ? { ...task, timers: updatedTask.timers }
              : task
          ),
        })),
      })),
    }));
  };

  const calculateDuration = (startTime, endTime) => {
    const duration = new Date(endTime) - new Date(startTime);
    const hours = Math.floor(duration / (1000 * 60 * 60));
    const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((duration % (1000 * 60)) / 1000);

    return {
      duration: `${hours} hours, ${minutes} minutes, ${seconds} seconds`,
      totalSeconds: Math.floor(duration / 1000),
    };
  };

  const tasksWithTimeData = [];

  clients.forEach((client) => {
    client.projects.forEach((project) => {
      project.taskGroups.forEach((taskGroup) => {
        taskGroup.tasks.forEach((task) => {
          task.timers.forEach((timer) => {
            if (timer.startTime && timer.endTime) {
              const { duration, totalSeconds } = calculateDuration(
                timer.startTime,
                timer.endTime
              );

              const meetsStartDateFilter =
                !startDateFilter ||
                new Date(timer.startTime) >= new Date(startDateFilter);
              const meetsEndDateFilter =
                !endDateFilter ||
                new Date(timer.endTime) <= new Date(endDateFilter);
              const meetsMinDurationFilter = totalSeconds >= minDurationFilter;

              if (
                meetsStartDateFilter &&
                meetsEndDateFilter &&
                meetsMinDurationFilter
              ) {
                tasksWithTimeData.push({
                  clientName: client.name,
                  projectName: project.projectTitle,
                  taskGroupName: taskGroup.groupName,
                  taskTitle: task.taskTitle,
                  startTime: new Date(timer.startTime).toLocaleString(),
                  endTime: new Date(timer.endTime).toLocaleString(),
                  duration: duration,
                  totalSeconds: totalSeconds,
                });
              }
            }
          });
        });
      });
    });
  });

  const sortedTasks = tasksWithTimeData.sort((a, b) => {
    return sortOrder === "asc"
      ? a.totalSeconds - b.totalSeconds
      : b.totalSeconds - a.totalSeconds;
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    if (name === "startDate") setStartDateFilter(value);
    if (name === "endDate") setEndDateFilter(value);
    if (name === "minDuration") setMinDurationFilter(Number(value));
  };

  const handleSortOrderChange = (e) => {
    setSortOrder(e.target.value);
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <TimeTrackerRecorder
        clientsData={clients}
        selectedClient={selectedClient}
        setSelectedClient={setSelectedClient}
        selectedTask={selectedTask}
        selectTask={selectTask}
        setSelectedTask={setSelectedTask}
        selectedProject={selectedProject}
        setSelectedProject={setSelectedProject}
        selectedTaskGroup={selectedTaskGroup}
        setSelectedTaskGroup={setSelectedTaskGroup}
      />
      {selectedTask ? (
        <Timer
          key={selectedTask.id}
          selectedTask={selectedTask}
          setStartTime={setStartTime}
          setEndTime={setEndTime}
        />
      ) : (
        ""
      )}
      <div className="filters d-flex gap-2 justify-content-center m-4">
        <div>
          <label>
            Start Date:
            <input
              className="form-control"
              type="date"
              name="startDate"
              value={startDateFilter}
              onChange={handleFilterChange}
            />
          </label>
        </div>
        <div>
          <label>
            End Date:
            <input
              className="form-control"
              type="date"
              name="endDate"
              value={endDateFilter}
              onChange={handleFilterChange}
            />
          </label>
        </div>
        <div>
          <label>
            Minimum Duration (seconds):
            <input
              className="form-control"
              type="number"
              name="minDuration"
              value={minDurationFilter}
              onChange={handleFilterChange}
            />
          </label>
        </div>
        <div>
          <label>
            Sort by Duration:
            <select
              className="form-control"
              name="sortOrder"
              value={sortOrder}
              onChange={handleSortOrderChange}
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </label>
        </div>
      </div>
      <div>
        <h3>Tasks with Time Data</h3>
        {sortedTasks.length > 0 ? (
          <ul>
            {sortedTasks.map((task, index) => (
              <li key={index}>
                <div className="d-flex gap-4">
                  <div>
                    <strong>Client:</strong> {task.clientName} {" -> "}
                  </div>
                  <div>
                    <strong>Project:</strong> {task.projectName} {" -> "}
                  </div>
                  <div>
                    <strong>Task Group:</strong> {task.taskGroupName} {" -> "}
                  </div>
                  <div>
                    <strong>Task Name:</strong> {task.taskTitle}
                  </div>
                </div>
                <div>
                  <strong>Start Time:</strong> {task.startTime}
                </div>
                <div>
                  <strong>End Time:</strong> {task.endTime}
                </div>
                <div>
                  <strong>Duration:</strong> {task.duration}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No tasks with start and end times matching the filters.</p>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
