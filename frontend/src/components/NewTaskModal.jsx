import React, { useState } from "react";

function Modal({ isOpen, onClose, onSave, taskGroupId, clientsData }) {
  const [taskTitle, setTaskTitle] = useState("");

  const handleSave = () => {
    if (taskTitle.trim()) {
      onSave(taskTitle);
      setTaskTitle(""); // reset the input field
    }
  };

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

  return (
    isOpen && (
      <div className="modal" style={modalStyles.overlay}>
        <div className="modal-content" style={modalStyles.content}>
          <h5>Create New Task</h5>
          <input
            type="text"
            className="form-control"
            placeholder="Enter task title"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
          />
          <div className="mt-2 d-flex justify-content-end">
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

export default Modal;
