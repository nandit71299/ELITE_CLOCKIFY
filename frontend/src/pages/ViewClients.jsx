import React, { useState, useEffect } from "react";
import { Table, Button, Space, message } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import apiUtil from "../utils/apiUtil"; // Assuming this contains the deleteClients method
import { setClients } from "../redux/clientSlice"; // Redux action to update client list

function ViewClients() {
  const [clients, setClientsState] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]); // State to store selected rows
  const dispatch = useDispatch();

  // Fetch clients when component mounts
  useEffect(() => {
    apiUtil
      .fetchAllClients()
      .then((data) => {
        setClientsState(data.clients); // Set fetched clients into state
        dispatch(setClients(data.clients)); // Update Redux store
      })
      .catch((error) => {
        console.error(error);
        message.error("Failed to fetch clients");
      });
  }, [dispatch]);

  // Handle delete for selected clients
  const handleDelete = async () => {
    try {
      if (selectedRowKeys.length === 0) {
        message.warning("Please select clients to delete.");
        return;
      }

      // Send delete request for selected clients
      const response = await apiUtil.deleteClients(selectedRowKeys);

      if (response.success) {
        // Remove the deleted clients from both local state and Redux state
        const updatedClients = clients.filter(
          (client) => !selectedRowKeys.includes(client.id)
        );
        setClientsState(updatedClients);
        dispatch(setClients(updatedClients)); // Update Redux state

        message.success(
          `${selectedRowKeys.length} client(s) deleted successfully.`
        );
      } else {
        message.error("Failed to delete selected clients");
      }
    } catch (error) {
      console.error(error);
      message.error("An error occurred while deleting the client(s)");
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
      dataIndex: "name",
      key: "name",
    },
  ];

  return (
    <div>
      <h1>Clients List</h1>
      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={clients}
        rowKey="id"
        pagination={false}
      />
      {/* Show delete button only when there are selected rows */}
      {selectedRowKeys.length > 0 && (
        <div>
          <Button
            color="danger"
            variant="solid"
            icon={<DeleteOutlined />}
            onClick={handleDelete}
            style={{ marginTop: 16 }}
          >
            Delete Selected Clients
          </Button>
        </div>
      )}
    </div>
  );
}

export default ViewClients;
