import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { ModalProvider } from "./context/ModalContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  
  <ModalProvider>
  <BrowserRouter>
    <App />
  </BrowserRouter>
  </ModalProvider>
);
