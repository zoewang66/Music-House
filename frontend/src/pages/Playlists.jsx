import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Container,
  TextInput,
  Textarea,
  MultiSelect,
  Button,
} from "@mantine/core";
import {
  fetchSongs,
  createPlaylist,
  updatePlaylist,
  fetchPlaylistById,
} from "../api/index";

export default function Playlist({ mode }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [allSongs, setAllSongs] = useState([]);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    fetchSongs().then((res) => {
      setAllSongs(res.data.map((s) => ({ value: s._id, label: s.title })));
    });
    if (mode === "edit") {
      fetchPlaylistById(id).then((res) => {
        const pl = res.data;
        setName(pl.name);
        setDescription(pl.description);
        setSelected(pl.songs.map((s) => s._id));
      });
    }
  }, [mode, id]);

  const handleSubmit = () => {
    const data = { name, description, songs: selected };
    const action =
      mode === "create" ? createPlaylist(data) : updatePlaylist(id, data);
    action.then(() => navigate("/playlists")).catch(console.error);
  };

  return (
    <Container mt="md">
      <TextInput
        label="Name"
        value={name}
        onChange={(e) => setName(e.currentTarget.value)}
        required
      />
      <Textarea
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.currentTarget.value)}
        mt="md"
      />
      <MultiSelect
        data={allSongs}
        label="Songs"
        placeholder="Select songs"
        value={selected}
        onChange={setSelected}
        mt="md"
      />
      <Button onClick={handleSubmit} mt="md">
        {mode === "create" ? "Create" : "Update"} Playlist
      </Button>
    </Container>
  );
}
