import { createSlice } from "@reduxjs/toolkit";

const selectedTaskSlice = createSlice({
  name: "selectedTask",
  initialState: null,
  reducers: {
    selectTask: (state, action) => {
      return action.payload;
    },
    updateTaskTimers: (state, action) => {
      return {
        ...state,
        timers: action.payload,
      };
    },
  },
});

export const { selectTask, updateTaskTimers } = selectedTaskSlice.actions;
export default selectedTaskSlice.reducer;
