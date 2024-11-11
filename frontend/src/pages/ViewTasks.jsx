import React, { useState, useEffect } from "react";
import { Table, Button, Space, message } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import apiUtil from "../utils/apiUtil"; // Utility function for making API calls
import { setClients } from "../redux/clientSlice"; // Redux action to update the clients

function ViewTasks() {
  const [tasks, setTasks] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]); // State to store selected rows
  const dispatch = useDispatch();

  // Fetch clients and tasks data when component mounts
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        // Call the API to fetch clients (this will return clients, projects, taskGroups, and tasks)
        const response = await apiUtil.fetchAllClients();
        if (response.success) {
          const clients = response.clients;

          // Transform the clients data to extract tasks for the table
          const tasksData = [];

          clients.forEach((client) => {
            client.projects.forEach((project) => {
              project.taskGroups.forEach((taskGroup) => {
                taskGroup.tasks.forEach((task) => {
                  tasksData.push({
                    key: `${client.id}-${project.id}-${taskGroup.id}-${task.id}`,
                    clientName: client.name,
                    projectTitle: project.projectTitle,
                    groupName: taskGroup.groupName,
                    taskTitle: task.taskTitle,
                    taskId: task.id,
                    clientId: client.id,
                    projectId: project.id,
                    taskGroupId: taskGroup.id,
                  });
                });
              });
            });
          });

          setTasks(tasksData); // Set tasks data in local state
          dispatch(setClients(clients)); // Update Redux store with fetched clients data
        } else {
          message.error("Failed to fetch clients");
        }
      } catch (error) {
        console.error(error);
        message.error("An error occurred while fetching clients");
      }
    };

    fetchTasks(); // Fetch tasks on component mount
  }, [dispatch]); // Ensure this runs only on mount

  // Handle task deletion
  const handleDelete = async () => {
    try {
      // Find the selected tasks by matching selectedRowKeys
      const selectedTasks = tasks.filter((task) =>
        selectedRowKeys.includes(task.key)
      );

      // Construct an array of task IDs
      const taskIds = selectedTasks.map((task) => task.taskId);

      // Check if there are tasks selected
      if (taskIds.length === 0) {
        message.warning("No tasks selected for deletion.");
        return;
      }

      // Send a delete request with the array of task IDs
      const response = await apiUtil.deleteTasks(
        selectedTasks[0].clientId, // All tasks belong to the same clientId
        selectedTasks[0].projectId, // All tasks belong to the same projectId
        selectedTasks[0].taskGroupId, // All tasks belong to the same taskGroupId
        taskIds // Pass the array of task IDs
      );

      if (response.success) {
        // Remove the tasks from local state and Redux store
        const updatedTasks = tasks.filter(
          (t) => !selectedRowKeys.includes(t.key)
        );
        setTasks(updatedTasks); // Update local state
        dispatch(setClients(updatedTasks)); // Update Redux state

        message.success("Selected tasks deleted successfully");
      } else {
        message.error("Failed to delete selected tasks");
      }
    } catch (error) {
      console.error(error);
      message.error("An error occurred while deleting the task(s)");
    }
  };

  // Handle row selection change
  const handleSelectChange = (selectedRowKeys) => {
    setSelectedRowKeys(selectedRowKeys); // Update selected rows
  };

  // Table row selection configuration
  const rowSelection = {
    selectedRowKeys,
    onChange: handleSelectChange,
  };

  // Define columns for the table
  const columns = [
    {
      title: "Client Name",
      dataIndex: "clientName",
      key: "clientName",
    },
    {
      title: "Project Title",
      dataIndex: "projectTitle",
      key: "projectTitle",
    },
    {
      title: "Task Group Name",
      dataIndex: "groupName",
      key: "groupName",
    },
    {
      title: "Task Title",
      dataIndex: "taskTitle",
      key: "taskTitle",
    },
  ];

  return (
    <div>
      <h1>Tasks List</h1>
      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={tasks}
        rowKey="key"
        pagination={false}
      />
      {/* Show delete button only when there are selected rows */}
      {selectedRowKeys.length > 0 && (
        <Button
          type="danger"
          icon={<DeleteOutlined />}
          onClick={handleDelete}
          style={{ marginTop: 16 }}
        >
          Delete Selected Tasks
        </Button>
      )}
    </div>
  );
}

export default ViewTasks;
