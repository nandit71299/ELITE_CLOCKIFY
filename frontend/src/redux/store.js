import { configureStore } from "@reduxjs/toolkit";
import clientReducer from "./clientSlice";
import projectReducer from "./projectSlice";
import timerReducer from "./timerSlice";
import filterReducer from "./filterSlice";

const store = configureStore({
  reducer: {
    clients: clientReducer,
    project: projectReducer,
    timer: timerReducer,
    filters: filterReducer,
  },
});

export default store;
