import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource/cormorant-garamond/cyrillic-500.css";
import "@fontsource/cormorant-garamond/cyrillic-600.css";
import "@fontsource/cormorant-garamond/cyrillic-700.css";
import "@fontsource/cormorant-garamond/cyrillic-500-italic.css";
import "@fontsource/manrope/cyrillic-400.css";
import "@fontsource/manrope/cyrillic-500.css";
import "@fontsource/manrope/cyrillic-600.css";
import "@fontsource/manrope/cyrillic-700.css";
import "./index.css";
import App from "./app/App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
