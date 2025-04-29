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
import "

export default function Playlist({ mode }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [allSongs, setAllSongs] = useState([]);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    // Load every page of songs, concatenate into one array
    const loadAllSongs = async () => {
      try {
        let page = 1;
        let allItems = [];
        let totalPages = 1;

        // keep fetching until we've pulled every page
        do {
          const res = await fetchSongs(page, 9); // page & limit
          console.log(`🎯 fetchSongs page ${page}:`, res.data.items);

          allItems = allItems.concat(res.data.items);
          totalPages = res.data.totalPages;
          page++;
        } while (page <= totalPages);

        // map into { value, label }
        const options = allItems.map((s) => ({
          value: s._id,
          label: s.title,
        }));
        console.log("✅ all song options:", options);

        setAllSongs(options);
      } catch (err) {
        console.error("loadAllSongs failed:", err);
        if (err.response?.status === 401) {
          navigate("/login", { replace: true });
        }
      }
    };

    loadAllSongs();

    // if editing, also load the existing playlist
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
