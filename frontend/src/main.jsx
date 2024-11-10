import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import store from "./redux/store";
import Dashboard from "./pages/Dashboard";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ViewClients from "./pages/ViewClients";
import ViewTaskGroups from "./pages/ViewTaskGroups";
import ViewTasks from "./pages/ViewTasks";
import ViewTimerData from "./pages/ViewTimerData";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/viewClients" element={<ViewClients />} />
          <Route path="/viewTaskGroup" element={<ViewTaskGroups />} />
          <Route path="/viewTasks" element={<ViewTasks />} />
          <Route path="/viewTimerData" element={<ViewTimerData />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
