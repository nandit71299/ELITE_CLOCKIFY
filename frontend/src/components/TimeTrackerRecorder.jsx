import React, { useState } from "react";
import ProjectPicker from "./ProjectPicker";

function TimeTrackerRecorder({
  clientsData,
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
              clientsData={clientsData}
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
