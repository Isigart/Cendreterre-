import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./ceux-qui-ont-ete-lus.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);