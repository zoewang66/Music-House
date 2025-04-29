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

  useEffect(() => {
    fetchSongs()
      .then((res) => {
        // 1. Inspect exactly what came back
        console.log("🎯 fetchSongs response data:", res.data);

        // 2. Pull your array out of the right property
        const rawSongs = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data.items)
          ? res.data.items // <-- your API puts the list here
          : Array.isArray(res.data.songs)
          ? res.data.songs
          : [];

        console.log("✅ rawSongs array:", rawSongs);

        // 3. Map into MultiSelect format
        const options = rawSongs.map((s) => ({
          value: s._id,
          label: s.title,
        }));
        console.log("✅ Parsed song options:", options);

        setAllSongs(options);
      })
      .catch((err) => {
        console.error("fetchSongs failed:", err);
        if (err.response?.status === 401) {
          navigate("/login", { replace: true });
        }
      });

    if (mode === "edit") {
      fetchPlaylistById(id)
        .then((res) => {
          const pl = res.data;
          setName(pl.name);
          setDescription(pl.description);
          setSelected(pl.songs.map((s) => s._id));
        })
        .catch((err) => {
          console.error("fetchPlaylistById failed:", err);
          if (err.response?.status === 401) {
            navigate("/login", { replace: true });
          }
        });
    }
  }, [mode, id, navigate]);

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
        wit
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
