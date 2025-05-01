import React from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AuthProvider } from "./contexts/AuthContext";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { Global } from "@emotion/react";
import { MantineProvider } from "@mantine/core";
import App from "./App";

export default function Root() {
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      {/* 1. Global override for the selected day: */}
      <Global
        styles={{
          // inspect your DOM—these classnames can vary by version!
          ".mantine-Calendar-day[data-selected]": {
            backgroundColor: "white !important",
            color: "#346d67 !important",
          },
          ".mantine-Calendar-day[data-selected]::before": {
            borderColor: "#346d67 !important",
          },
        }}
      />

      <App />
    </MantineProvider>
  );
}


const rootEl = document.getElementById("root");
const queryClient = new QueryClient();

createRoot(rootEl).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
