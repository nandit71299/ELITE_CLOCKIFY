import { createSlice } from "@reduxjs/toolkit";

const timerSlice = createSlice({
  name: "timer",
  initialState: { timerId: null, isRunning: false },
  reducers: {
    setTimerId: (state, action) => {
      state.timerId = action.payload;
    },
    setTimerRunning: (state, action) => {
      state.isRunning = action.payload;
    },
  },
});

export const { setTimerId, setTimerRunning } = timerSlice.actions;
export default timerSlice.reducer;
