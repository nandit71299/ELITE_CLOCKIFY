import { createSlice } from "@reduxjs/toolkit";

const filterSlice = createSlice({
  name: "filters",
  initialState: {
    startDate: "",
    endDate: "",
    minDuration: 0,
    sortOrder: "asc",
  },
  reducers: {
    setStartDate: (state, action) => {
      state.startDate = action.payload;
    },
    setEndDate: (state, action) => {
      state.endDate = action.payload;
    },
    setMinDuration: (state, action) => {
      state.minDuration = action.payload;
    },
    setSortOrder: (state, action) => {
      state.sortOrder = action.payload;
    },
  },
});

export const { setStartDate, setEndDate, setMinDuration, setSortOrder } =
  filterSlice.actions;
export default filterSlice.reducer;
