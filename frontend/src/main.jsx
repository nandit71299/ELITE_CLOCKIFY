import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import store from "./redux/store";
import Dashboard from "./pages/Dashboard";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <Dashboard />
    </Provider>
  </StrictMode>
);
