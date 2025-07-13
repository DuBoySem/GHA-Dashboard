//é enfocing utf-8 encoding
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

const root = createRoot(document.getElementById("gha-dashboard-root"));
root.render(<App />);