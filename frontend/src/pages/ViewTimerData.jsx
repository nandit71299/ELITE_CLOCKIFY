import React, { useState, useEffect } from "react";
import { Table, Button, Space, message } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import apiUtil from "../utils/apiUtil"; // Utility function for making API calls
import { setClients } from "../redux/clientSlice"; // Redux action to update the clients
import { calculateDuration } from "../utils/timeUtils"; // Importing the calculateDuration function

function ViewTimerData() {
  const [timers, setTimers] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]); // State to store selected rows
  const dispatch = useDispatch();

  // Fetch clients and timer data when the component mounts
  useEffect(() => {
    const fetchTimerData = async () => {
      try {
        // Call the API to fetch clients (this will return clients, projects, taskGroups, tasks, and timers)
        const response = await apiUtil.fetchAllClients();
        if (response.success) {
          const clients = response.clients;

          const timersData = [];

          // Loop through clients to extract timers data
          clients.forEach((client) => {
            client.projects.forEach((project) => {
              project.taskGroups.forEach((taskGroup) => {
                taskGroup.tasks.forEach((task) => {
                  task.timers.forEach((timer) => {
                    const { duration } = calculateDuration(
                      timer.startTime,
                      timer.endTime
                    ); // Calculate the duration
                    timersData.push({
                      key: `${client.id}-${project.id}-${taskGroup.id}-${task.id}-${timer.id}`,
                      clientName: client.name,
                      projectTitle: project.projectTitle,
                      groupName: taskGroup.groupName,
                      taskTitle: task.taskTitle,
                      startTime: timer.startTime,
                      endTime: timer.endTime,
                      duration, // Add the duration to the data
                      timerId: timer.id,
                      clientId: client.id,
                      projectId: project.id,
                      taskGroupId: taskGroup.id,
                      taskId: task.id,
                    });
                  });
                });
              });
            });
          });

          setTimers(timersData); // Set timers data in local state
          dispatch(setClients(clients)); // Update Redux store with fetched clients data
        } else {
          message.error("Failed to fetch timer data");
        }
      } catch (error) {
        console.error(error);
        message.error("An error occurred while fetching timer data");
      }
    };

    fetchTimerData(); // Fetch timers on component mount
  }, [dispatch]); // Ensure this runs only on mount

  // Handle timer deletion
  const handleDelete = async () => {
    try {
      if (selectedRowKeys.length === 0) {
        message.warning("Please select timers to delete.");
        return;
      }

      // Construct the payload with the selected timer IDs
      const timerIds = selectedRowKeys.map((key) => {
        const [clientId, projectId, taskGroupId, taskId, timerId] =
          key.split("-"); // Extract IDs from the key
        return {
          clientId: parseInt(clientId), // Ensure IDs are integers
          projectId: parseInt(projectId),
          taskGroupId: parseInt(taskGroupId),
          taskId: parseInt(taskId),
          timerId: parseInt(timerId),
        };
      });

      // Send the payload to the API for deletion
      const response = await apiUtil.deleteTimers(timerIds);

      if (response.success) {
        // Remove the deleted timers from local state and Redux state
        const updatedTimers = timers.filter(
          (timer) => !selectedRowKeys.includes(timer.key)
        );
        setTimers(updatedTimers); // Update local state
        dispatch(setClients(updatedTimers)); // Update Redux state

        message.success(
          `${selectedRowKeys.length} timer(s) deleted successfully.`
        );
      } else {
        message.error("Failed to delete selected timers");
      }
    } catch (error) {
      console.error(error);
      message.error("An error occurred while deleting the timer(s)");
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
    {
      title: "Start Time",
      dataIndex: "startTime",
      key: "startTime",
      render: (startTime) => new Date(startTime).toLocaleString(),
    },
    {
      title: "End Time",
      dataIndex: "endTime",
      key: "endTime",
      render: (endTime) => new Date(endTime).toLocaleString(),
    },
    {
      title: "Duration",
      dataIndex: "duration",
      key: "duration",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          {/* You can add more action buttons here (e.g., Edit) */}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h1>Timer Data</h1>
      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={timers}
        rowKey="key"
        pagination={false}
      />
      {/* Show delete button only when there are selected rows */}
      {selectedRowKeys.length > 0 && (
        <Button
          color="danger"
          variant="solid"
          icon={<DeleteOutlined />}
          onClick={handleDelete}
          style={{ marginTop: 16 }}
        >
          Delete Selected Timers
        </Button>
      )}
    </div>
  );
}

export default ViewTimerData;
