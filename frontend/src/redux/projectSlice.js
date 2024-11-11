import { createSlice } from "@reduxjs/toolkit";

const projectSlice = createSlice({
  name: "projects",
  initialState: {
    selectedClient: null,
    selectedProject: null,
    selectedTaskGroup: null,
    selectedTask: null,
  },
  reducers: {
    setSelectedClient: (state, action) => {
      console.log("Setting selectedClient to:", action.payload); // Log the incoming data
      state.selectedClient = action.payload;
    },
    setSelectedProject: (state, action) => {
      console.log("Setting selectedProject to:", action.payload); // Log the incoming data
      state.selectedProject = action.payload;
    },
    setSelectedTaskGroup: (state, action) => {
      console.log("Setting selectedTaskGroup to:", action.payload); // Log the incoming data
      state.selectedTaskGroup = action.payload;
    },
    setSelectedTask: (state, action) => {
      console.log("Setting selectedTask to:", action.payload); // Log the incoming data

      state.selectedTask = action.payload;
    },
  },
});

export const {
  setSelectedClient,
  setSelectedProject,
  setSelectedTaskGroup,
  setSelectedTask,
} = projectSlice.actions;
export default projectSlice.reducer;
