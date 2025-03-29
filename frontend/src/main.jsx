import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import CryptoContext from "./CryptoContext.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <CryptoContext>
        <App />
      </CryptoContext>
    </AuthProvider>
  </StrictMode>
);