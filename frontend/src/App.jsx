import { MantineProvider } from "@mantine/core";
import { Routes, Route } from "react-router-dom";

import Layout from "./pages/Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NoPage from "./pages/NoPage";

import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/carousel/styles.css";
import Playlist from "./pages/Playlists";
import { PrivateRoute } from "./components/Playlists/PrivateRoute";
import PlaylistsList from "./components/Playlists/PlaylistsList";
import SongsList from "./components/Songs/SongsList";
import SongForm from "./components/Songs/SongForm";
import ArtistsList from "./components/Artists/ArtistList";
import ArtistForm from "./components/Artists/ArtistForm";

function App() {
  return (
    <>
      <MantineProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            {/* Songs CRUD */}
            <Route path="songs" element={<SongsList />} />
            <Route path="songs/create" element={<SongForm mode="create" />} />
            <Route path="songs/:id" element={<SongForm mode="edit" />} />

            {/* Artists CRUD */}
            <Route path="artists" element={<ArtistsList />} />
            <Route
              path="artists/create"
              element={<ArtistForm mode="create" />}
            />
            <Route path="artists/:id" element={<ArtistForm mode="edit" />} />

            {/* Playlist listing */}
            <Route
              path="playlists"
              element={
                <PrivateRoute>
                  <PlaylistsList />
                </PrivateRoute>
              }
            />
            {/* Create new */}
            <Route
              path="playlists/create"
              element={
                <PrivateRoute>
                  <Playlist mode="create" />
                </PrivateRoute>
              }
            />
            {/* Edit existing */}
            <Route
              path="playlists/:id"
              element={
                <PrivateRoute>
                  <Playlist mode="edit" />
                </PrivateRoute>
              }
            />
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
