import React, { useState, useEffect } from "react";
import {
  DashboardOutlined,
  UnorderedListOutlined,
  ClockCircleOutlined,
  ProjectOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import moment from "moment";
import { Link } from "react-router-dom";
import { Layout, Menu, Button } from "antd";
import { useDispatch, useSelector } from "react-redux";

// DEV'S
import apiUtil from "../utils/apiUtil";
import TimeTrackerRecorder from "../components/TimeTrackerRecorder";
import Timer from "../components/ReactTimer";
import { calculateDuration } from "../utils/timeUtils";

// ACTIONS
import { setClients } from "../redux/clientSlice"; // Import the setClients action
import {
  setSelectedClient,
  setSelectedProject,
  setSelectedTaskGroup,
  setSelectedTask,
} from "../redux/projectSlice"; // Import the project actions
import {
  setStartDate,
  setEndDate,
  setMinDuration,
  setSortOrder,
} from "../redux/filterSlice"; // Import the filter actions

const { Sider, Content } = Layout;

function Dashboard() {
  const dispatch = useDispatch();

  // Redux state (clients and selected entities)
  const clients = useSelector((state) => state.clients);
  const { selectedClient, selectedProject, selectedTaskGroup, selectedTask } =
    useSelector((state) => state.project);

  // Access filter state from Redux store
  const { startDate, endDate, minDuration, sortOrder } = useSelector(
    (state) => state.filters
  );

  const [timerId, setTimerId] = useState(null);
  const [collapsed, setCollapsed] = useState(false); // Sidebar collapse state

  useEffect(() => {
    const getClients = async () => {
      try {
        const clientData = await apiUtil.fetchAllClients();
        if (clientData.success) {
          dispatch(setClients(clientData.clients));
        } else {
          console.error("Error fetching clients:", clientData.message);
        }
      } catch (error) {
        console.error("Error fetching clients:", error);
      }
    };
    getClients();
  }, [dispatch]); // Make sure to include dispatch in the dependency array

  const selectTask = (task) => {
    dispatch(setSelectedTask(task));
  };

  // Function to handle start time
  const setStartTime = async (time) => {
    if (
      !selectedClient ||
      !selectedProject ||
      !selectedTaskGroup ||
      !selectedTask
    ) {
      return false;
    }

    try {
      const response = await apiUtil.startTimer(
        selectedClient.id,
        selectedProject.id,
        selectedTaskGroup.id,
        selectedTask.id
      );

      if (response.success) {
        setTimerId(response.timer.id);

        // Create an updated task with the new timer
        const updatedTask = {
          ...selectedTask,
          timers: [
            ...selectedTask.timers,
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
                              return updatedTask; // Replace the task with the updated task
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

        dispatch(setSelectedTask(updatedTask));
        dispatch(setClients(updatedClients));

        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Error starting timer:", error);
      return false;
    }
  };

  // Function to handle end time
  const setEndTime = async (time) => {
    if (
      !selectedClient ||
      !selectedProject ||
      !selectedTaskGroup ||
      !selectedTask
    ) {
      return false;
    }

    try {
      const response = await apiUtil.endTimer(
        selectedClient.id,
        selectedProject.id,
        selectedTaskGroup.id,
        selectedTask.id,
        timerId
      );

      if (response.success) {
        const updatedTask = {
          ...selectedTask,
          timers: selectedTask.timers.map((timer) =>
            timer.id === timerId && timer.endTime === null
              ? { ...timer, endTime: time }
              : timer
          ),
        };

        const updatedClients = updateClientsWithTask(updatedTask);

        dispatch(setClients(updatedClients));
        dispatch(setSelectedTask(updatedTask));

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

              // Convert the task's start and end time to Moment objects (removes the time part)
              const taskStartDate = moment(timer.startTime).format(
                "YYYY-MM-DD"
              ); // Only the date part
              const taskEndDate = moment(timer.endTime).format("YYYY-MM-DD"); // Only the date part

              // Convert the filter start and end dates to Moment objects (removes the time part)
              const filterStartDate = startDate
                ? moment(startDate).format("YYYY-MM-DD")
                : null;
              const filterEndDate = endDate
                ? moment(endDate).format("YYYY-MM-DD")
                : null;

              // Exact date comparisons
              const meetsStartDateFilter =
                !filterStartDate || taskStartDate === filterStartDate;
              const meetsEndDateFilter =
                !filterEndDate ||
                moment(taskEndDate).isSameOrBefore(
                  moment(filterEndDate).endOf("day"),
                  "day"
                );
              const meetsMinDurationFilter = totalSeconds >= minDuration;

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
                  startTime: moment(timer.startTime).format(
                    "YYYY-MM-DD HH:mm:ss"
                  ),
                  endTime: moment(timer.endTime).format("YYYY-MM-DD HH:mm:ss"),
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
    if (sortOrder === "asc") {
      return sortOrder === "duration"
        ? a.totalSeconds - b.totalSeconds
        : moment(a.startTime).isBefore(b.startTime)
        ? -1
        : 1;
    } else {
      return sortOrder === "duration"
        ? b.totalSeconds - a.totalSeconds
        : moment(b.startTime).isBefore(a.startTime)
        ? -1
        : 1;
    }
  });

  // Dispatch filter updates
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    if (name === "startDate") dispatch(setStartDate(value));
    if (name === "endDate") dispatch(setEndDate(value));
    if (name === "minDuration") dispatch(setMinDuration(Number(value)));
  };

  const handleSortOrderChange = (e) => {
    dispatch(setSortOrder(e.target.value));
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <Sider
        theme={"light"}
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
      >
        <div
          className="logo-container"
          style={{ padding: collapsed ? "5px" : "16px", textAlign: "center" }}
        >
          {collapsed ? <h6>Clockify</h6> : <h2>Clockify</h2>}
        </div>

        <Menu theme="light" mode="inline" defaultSelectedKeys={["1"]}>
          <Menu.Item key="1" icon={<DashboardOutlined />}>
            Dashboard
          </Menu.Item>
          <Menu.Item key="2" icon={<UnorderedListOutlined />}>
            <Link to="/viewClients">Clients</Link>
          </Menu.Item>
          <Menu.Item key="3" icon={<ProjectOutlined />}>
            <Link to="/viewTaskGroup">Task Groups</Link>
          </Menu.Item>
          <Menu.Item key="4" icon={<FileTextOutlined />}>
            <Link to="/viewTasks">Tasks</Link>
          </Menu.Item>
          <Menu.Item key="5" icon={<ClockCircleOutlined />}>
            <Link to="/viewTimerData">Timer Data</Link>
          </Menu.Item>
        </Menu>
      </Sider>

      {/* Main content */}
      <Layout>
        <Content>
          <div style={{ padding: "10px 50px 0px 50px", minHeight: 360 }}>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h1>DASHBOARD</h1>
              </div>
              <div>
                <TimeTrackerRecorder
                  clientsData={clients}
                  selectedClient={selectedClient}
                  setSelectedClient={(client) =>
                    dispatch(setSelectedClient(client))
                  }
                  selectedTask={selectedTask}
                  selectTask={selectTask}
                  setSelectedTask={(task) => dispatch(setSelectedTask(task))}
                  selectedProject={selectedProject}
                  setSelectedProject={(project) =>
                    dispatch(setSelectedProject(project))
                  }
                  selectedTaskGroup={selectedTaskGroup}
                  setSelectedTaskGroup={(taskGroup) =>
                    dispatch(setSelectedTaskGroup(taskGroup))
                  }
                />
              </div>
            </div>

            <Timer
              selectedTask={selectedTask}
              setStartTime={setStartTime}
              setEndTime={setEndTime}
            />

            <div className="filters d-flex gap-2 justify-content-center m-4">
              <div>
                <label>
                  Start Date:
                  <input
                    className="form-control"
                    type="date"
                    name="startDate"
                    value={startDate}
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
                    value={endDate}
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
                    value={minDuration}
                    onChange={handleFilterChange}
                  />
                </label>
              </div>
              <div>
                <label>
                  Sort by:
                  <select
                    className="form-control"
                    name="sortOrder"
                    value={sortOrder}
                    onChange={handleSortOrderChange}
                  >
                    <option value="asc">Date Started (Ascending)</option>
                    <option value="desc">Date Started (Descending)</option>
                    <option value="duration">Duration</option>
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
                          <strong>Task Group:</strong> {task.taskGroupName}{" "}
                          {" -> "}
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
        </Content>
      </Layout>
    </Layout>
  );
}

export default Dashboard;
