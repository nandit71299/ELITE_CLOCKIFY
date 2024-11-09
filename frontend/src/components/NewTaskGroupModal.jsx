import React, { useState } from "react";

// Modal Component
function TaskGroupModal({ isOpen, onClose, onSave, projectId }) {
  const [groupName, setGroupName] = useState("");

  // Handle form submission (save new task group)
  const handleSubmit = () => {
    if (groupName.trim()) {
      onSave(groupName); // Call onSave to create the task group
      setGroupName(""); // Clear the input field
    }
  };

  // If modal is not open, return null to render nothing
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h4>Create New Task Group</h4>
        <input
          type="text"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          placeholder="Enter Task Group Name"
          className="form-control"
        />
        <div className="modal-footer">
          <button onClick={handleSubmit} className="btn btn-primary">
            Save
          </button>
          <button onClick={onClose} className="btn btn-secondary">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default TaskGroupModal;

// CSS Styles for the Modal
const styles = `
  /* Modal Overlay */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent background */
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1050; /* Ensure it's on top */
  }

  /* Modal Content */
  .modal-content {
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    width: 400px; /* Adjust width as needed */
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  }

  .modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
  }

  /* Styling for Input */
  .form-control {
    width: 100%;
    padding: 10px;
    border-radius: 5px;
    border: 1px solid #ddd;
    margin-bottom: 15px;
  }

  /* Button Styles */
  .btn-primary {
    background-color: #007bff;
    color: white;
    border: none;
    padding: 8px 20px;
    border-radius: 5px;
  }

  .btn-secondary {
    background-color: #6c757d;
    color: white;
    border: none;
    padding: 8px 20px;
    border-radius: 5px;
  }

  /* Button Hover Effects */
  .btn-primary:hover {
    background-color: #0056b3;
  }

  .btn-secondary:hover {
    background-color: #5a6268;
  }
`;

// Insert the styles into the document head
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);
