import { MantineProvider } from "@mantine/core";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./pages/Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NoPage from "./pages/NoPage";

import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import Songs from "./pages/Songs";
import Artists from "./pages/Artists";
import Playlist from "./pages/Playlists";

function App() {
  return (
    <>
      <MantineProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="songs" element={<Songs />} />
            <Route path="artists" element={<Artists />} />
            <Route path="playlist" element={<Playlist />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="*" element={<NoPage />} />
          </Route>
        </Routes>
      </MantineProvider>
    </>
  );
}

export default App;
