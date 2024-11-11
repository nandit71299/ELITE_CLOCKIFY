import { createSlice } from "@reduxjs/toolkit";

const clientSlice = createSlice({
  name: "clients",
  initialState: [],
  reducers: {
    setClients: (state, action) => action.payload,
  },
});

export const { setClients } = clientSlice.actions;
export default clientSlice.reducer;
