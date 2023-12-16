import React from "react";
import ReactDOM from "react-dom";
import "./index.scss";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { TaskProvider } from "context/TaskContext";
import { AuthContextProvider } from "context/AuthContext";

ReactDOM.render(
  <AuthContextProvider>
    <BrowserRouter>
      <React.StrictMode>
        <TaskProvider>
          <App />
        </TaskProvider>
      </React.StrictMode>
    </BrowserRouter>
  </AuthContextProvider>,
  document.getElementById("root") as HTMLElement
);
