import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import apiUtil from "../utils/apiUtil";
import { setClients } from "../redux/clientSlice"; // Import the setClients action

function ProjectModal({ isOpen, onClose }) {
  const dispatch = useDispatch();

  // Access clientsData from Redux
  const clientsData = useSelector((state) => state.clients);

  const [projectTitle, setProjectTitle] = useState("");
  const [projectColor, setProjectColor] = useState("#FFFFFF");
  const [selectedClient, setSelectedClient] = useState("");
  const [newClientName, setNewClientName] = useState("");

  const handleSave = async () => {
    if (!projectTitle.trim() || (!selectedClient && !newClientName.trim())) {
      return;
    }

    let clientId = selectedClient;

    // Create new client if "Add New Client" is selected
    if (newClientName.length > 0) {
      try {
        const response = await apiUtil.createClient(newClientName);

        if (!response.success) {
          return;
        } else {
          clientId = response.clientId;
        }
      } catch (error) {
        console.error("Error creating new client:", error);
        return;
      }
    }

    try {
      // Create new project using the clientId
      const newProject = await apiUtil.createProject(clientId, projectTitle);

      if (!newProject) {
        return;
      }

      let updatedClients = [...clientsData];

      // Update existing client with the new project
      if (selectedClient && selectedClient !== "new-client") {
        updatedClients = updatedClients.map((client) => {
          if (client.id === Number(clientId)) {
            return {
              ...client,
              projects: [...client.projects, newProject.project],
            };
          }
          return client;
        });
      } else {
        // Add a new client if needed
        const newClient = {
          id: clientId,
          name: newClientName,
          projects: [newProject.project],
        };
        updatedClients = [...updatedClients, newClient];
      }

      // Reset form fields and close modal
      setProjectTitle("");
      setNewClientName("");
      setProjectColor("#FFFFFF");
      setSelectedClient("");
      onClose();

      // Dispatch the updated clients list to Redux
      dispatch(setClients(updatedClients));
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  return (
    isOpen && (
      <div className="modal" style={modalStyles.overlay}>
        <div className="modal-content" style={modalStyles.content}>
          <h5>Create New Project</h5>
          <input
            type="text"
            className="form-control"
            placeholder="Enter Project Title"
            value={projectTitle}
            onChange={(e) => setProjectTitle(e.target.value)}
          />
          <label>Project Color:</label>
          <input
            type="color"
            value={projectColor}
            onChange={(e) => setProjectColor(e.target.value)}
            className="form-control"
          />
          <label>Select Client:</label>
          <select
            value={selectedClient}
            onChange={(e) => {
              setSelectedClient(e.target.value);
              setNewClientName("");
            }}
            className="form-control"
          >
            <option value="">Select Client</option>
            {clientsData.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name}
              </option>
            ))}
            <option value="new-client">Add New Client</option>
          </select>
          {selectedClient === "new-client" && (
            <div>
              <input
                type="text"
                className="form-control mt-2"
                placeholder="Enter New Client Name"
                value={newClientName}
                onChange={(e) => setNewClientName(e.target.value)}
              />
            </div>
          )}
          <div className="d-flex justify-content-end mt-3">
            <button className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button className="btn btn-primary ms-2" onClick={handleSave}>
              Save
            </button>
          </div>
        </div>
      </div>
    )
  );
}

const modalStyles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  content: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "5px",
    width: "300px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
  },
};

export default ProjectModal;
