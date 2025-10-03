import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import StatusContext from "./context/StatusContext";
import TracerContext from "./context/TracerContext";
import ConfigContext from "./context/ConfigContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <StatusContext>
    <TracerContext>
      <ConfigContext>
        <App />
      </ConfigContext>
    </TracerContext>
  </StatusContext>
);
