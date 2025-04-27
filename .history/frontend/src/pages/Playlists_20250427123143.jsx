// src/pages/Playlists.jsx
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

import PlaylistFormFields from "../components/PlaylistFormFields";

export default function Playlist({ mode }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [allSongs, setAllSongs] = useState([]);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    fetchSongs()
      .then((res) =>
        setAllSongs(res.data.map((s) => ({ value: s._id, label: s.title })))
      )
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

  // return (

  //   <PageContainer center={true}>
  //     <TextInput
  //       label="Name"
  //       value={name}
  //       onChange={(e) => setName(e.currentTarget.value)}
  //       required
  //     />
  //     <Textarea
  //       label="Description"
  //       value={description}
  //       onChange={(e) => setDescription(e.currentTarget.value)}
  //       mt="md"
  //     />
  //     <MultiSelect
  //       data={allSongs}
  //       label="Songs"
  //       placeholder="Select songs"
  //       value={selected}
  //       onChange={setSelected}
  //       mt="md"
  //     />
  //     <Button color="#346d67" onClick={handleSubmit} mt="md">
  //       {mode === "create" ? "Create" : "Update"} Playlist
  //     </Button>
  //   </PageContainer>
  // );

  return (
    <>
      <PlaylistFormFields
        name={name}
        onNameChange={setName}
        description={description}
        onDescriptionChange={setDescription}
        allSongs={allSongs}
        selected={selected}
        onSelectedChange={setSelected}
      />
      <Button color="#346d67" onClick={handleSubmit} mt="xl">Save Playlist</Button>
    </>
  );
}
