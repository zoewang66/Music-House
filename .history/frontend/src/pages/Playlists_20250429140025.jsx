// src/pages/Playlists.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Stack,
  TextInput,
  Textarea,
  MultiSelect,
  Button,
  Center,
} from "@mantine/core";
import {
  fetchSongs,
  createPlaylist,
  updatePlaylist,
  fetchPlaylistById,
} from "../api/index";
import PageContainer from "../components/PageContainer";

export default function Playlist({ mode }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [allSongs, setAllSongs] = useState([]);
  const [selected, setSelected] = useState([]);

  

  const handleSubmit = () => {
    const data = { name, description, songs: selected };

    const action =
      mode === "create" ? createPlaylist(data) : updatePlaylist(id, data);
    action
      .then(() => navigate("/playlists"))
      .catch((err) => {
        console.error("save playlist failed:", err);
        if (err.response?.status === 401) {
          navigate("/login", { replace: true });
        }
      });
  };

  return (
    <PageContainer center={true}>
      <Stack spacing="md">
        <TextInput
          fullWidth
          label="Name"
          value={name}
          onChange={(e) => setName(e.currentTarget.value)}
          required
        />
        <Textarea
          fullWidth
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.currentTarget.value)}
        />
        <MultiSelect
          withinPortal
          zIndex={999}
          fullWidth
          data={allSongs}
          label="Songs"
          placeholder="Select songs"
          value={selected}
          onChange={setSelected}
        />
        <Center mt="xl">
          <Button color="#346d67" onClick={handleSubmit}>
            {mode === "create" ? "Create" : "Update"} Playlist
          </Button>
        </Center>
      </Stack>
    </PageContainer>
  );
}
