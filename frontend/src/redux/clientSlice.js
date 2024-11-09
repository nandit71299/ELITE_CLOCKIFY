import { createSlice } from "@reduxjs/toolkit";
import { clientsData } from "../data";

const clientsSlice = createSlice({
  name: "clients",
  initialState: clientsData,
  reducers: {
    setClients: (state, action) => {
      return action.payload;
    },
    updateClients: (state, action) => {
      return action.payload;
    },
  },
});

export const { setClients, updateClients } = clientsSlice.actions;
export default clientsSlice.reducer;
