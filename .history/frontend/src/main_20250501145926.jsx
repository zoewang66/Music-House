// import React from "react";
// import { StrictMode } from "react";
// import { createRoot } from "react-dom/client";
// import { AuthProvider } from "./contexts/AuthContext";
// import { BrowserRouter } from "react-router-dom";
// import App from "./App.jsx";
// import "./index.css";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// const rootEl = document.getElementById("root");
// const queryClient = new QueryClient();

// createRoot(rootEl).render(
//   <StrictMode>
//     <BrowserRouter>
//       <AuthProvider>
//         <QueryClientProvider client={queryClient}>
//           <App />
//         </QueryClientProvider>
//       </AuthProvider>
//     </BrowserRouter>
//   </StrictMode>
// );

// main.jsx
import React from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MantineProvider } from "@mantine/core";
import { Global } from "@emotion/react";

import App from "./App.jsx";
import "./index.css";

const rootEl = document.getElementById("root");
const queryClient = new QueryClient();

createRoot(rootEl).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          {/* 1. Provide Mantine theme + normalize CSS */}
          <MantineProvider withNormalizeCSS withGlobalStyles>
            {/* 2. Inject global overrides for DatePicker selected day */}
            <Global
              styles={{
                ".mantine-Calendar-day[data-selected]": {
                  backgroundColor: "white !important",
                  color: "#346d67 !important",
                },
                ".mantine-Calendar-day[data-selected]::before": {
                  borderColor: "#346d67 !important",
                },
              }}
            />
            {/* 3. Your app */}
            <App />
          </MantineProvider>
        </QueryClientProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
