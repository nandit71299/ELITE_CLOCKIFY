import React, { useState, useEffect } from "react";
import { Table, Button, Space, message } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import apiUtil from "../utils/apiUtil"; // Assuming this handles the API requests
import { setClients } from "../redux/clientSlice"; // Redux action to update client list

function ViewTaskGroups() {
  const [taskGroups, setTaskGroups] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]); // State to store selected rows
  const dispatch = useDispatch();
  const clients = useSelector((state) => state.clients); // Get clients from Redux

  // Fetch clients and task groups when component mounts
  useEffect(() => {
    // Fetch clients from the backend
    const fetchClientsAndTaskGroups = async () => {
      try {
        // Fetch the clients from the API
        const { clients } = await apiUtil.fetchAllClients();
        dispatch(setClients(clients)); // Update Redux state with fetched clients

        // Now that we have the clients, we need to extract task groups
        const taskGroupsData = [];

        // Loop through the clients to extract task groups
        clients.forEach((client) => {
          client.projects.forEach((project) => {
            project.taskGroups.forEach((taskGroup) => {
              taskGroupsData.push({
                key: `${client.id}-${project.id}-${taskGroup.id}`,
                clientName: client.name,
                projectTitle: project.projectTitle,
                groupName: taskGroup.groupName,
                taskGroupId: taskGroup.id,
                clientId: client.id,
                projectId: project.id,
              });
            });
          });
        });

        setTaskGroups(taskGroupsData); // Set task groups data
      } catch (error) {
        console.error("Error fetching clients or task groups:", error);
        message.error("Failed to fetch clients or task groups.");
      }
    };

    fetchClientsAndTaskGroups();
  }, [dispatch]); // Only run once when component mounts

  // Handle delete for selected task groups
  const handleDelete = async () => {
    try {
      if (selectedRowKeys.length === 0) {
        message.warning("Please select task groups to delete.");
        return;
      }

      // Construct the payload with the required structure
      const taskGroupIds = selectedRowKeys.map((key) => {
        const [clientId, projectId, taskGroupId] = key.split("-"); // Split the key into individual IDs
        return {
          clientId: parseInt(clientId), // Ensure IDs are integers
          projectId: parseInt(projectId),
          taskGroupId: parseInt(taskGroupId),
        };
      });

      // Send delete request with the constructed payload
      const response = await apiUtil.deleteTaskGroups(taskGroupIds);

      if (response.success) {
        // Remove the deleted task groups from the local state and Redux state
        const updatedTaskGroups = taskGroups.filter(
          (taskGroup) => !selectedRowKeys.includes(taskGroup.key)
        );
        setTaskGroups(updatedTaskGroups);
        dispatch(setClients(updatedTaskGroups)); // Update Redux state

        message.success(
          `${selectedRowKeys.length} task group(s) deleted successfully.`
        );
      } else {
        message.error("Failed to delete selected task groups");
      }
    } catch (error) {
      console.error(error);
      message.error("An error occurred while deleting the task group(s)");
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
      <h1>Task Groups List</h1>
      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={taskGroups}
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
          Delete Selected Task Groups
        </Button>
      )}
    </div>
  );
}

export default ViewTaskGroups;
