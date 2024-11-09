import { configureStore } from "@reduxjs/toolkit";
import clientsReducer from "./clientSlice";
import selectedTaskReducer from "./selectedTaskSlice";

const store = configureStore({
  reducer: {
    clients: clientsReducer,
    selectedTask: selectedTaskReducer,
  },
});

export default store;
