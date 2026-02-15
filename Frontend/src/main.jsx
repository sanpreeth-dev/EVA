import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ChatProvider } from "./hooks/ChatContext";
import "./index.css";

const originalWarn = console.warn;
console.warn = (...args) => {
  if (args[0] && args[0].includes("dampingFactor has been deprecated")) return;
  originalWarn(...args);
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ChatProvider>
      <App />
    </ChatProvider>
  </React.StrictMode>
);
