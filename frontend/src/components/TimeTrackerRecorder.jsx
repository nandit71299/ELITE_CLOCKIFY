import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import ProjectPicker from "./ProjectPicker";

// Component
function TimeTrackerRecorder({
  selectedClient,
  setSelectedClient,
  selectedTask,
  selectTask,
  setSelectedTask,
  selectedProject,
  setSelectedProject,
  selectedTaskGroup,
  setSelectedTaskGroup,
}) {
  // Get the clients from the Redux store
  const clientsData = useSelector((state) => state.clients); // Access clients from Redux store

  // State to toggle project picker visibility
  const [isProjectPickerVisible, setIsProjectPickerVisible] = useState(false);

  return (
    <div>
      <div className="row w-100 d-flex align-items-center">
        <div className="col-10">
          <form action="">
            <input type="text" name="" id="" className="form-control" />
          </form>
        </div>
        <div className="col-2 position-relative">
          <div
            className="text-primary"
            onClick={() => setIsProjectPickerVisible(!isProjectPickerVisible)}
            style={{ cursor: "pointer" }}
          >
            + Project
          </div>
          {isProjectPickerVisible && (
            <ProjectPicker
              clientsData={clientsData} // Pass Redux clients data to ProjectPicker
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
          )}
        </div>
      </div>
    </div>
  );
}

export default TimeTrackerRecorder;
