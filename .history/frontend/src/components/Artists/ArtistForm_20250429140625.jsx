// src/components/ArtistForm.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { TextInput, Button, Center, Alert, MultiSelect } from "@mantine/core";
import {
  fetchArtistById,
  fetchSongs,
  createArtist,
  updateArtist,
} from "../../api/index";
import PageContainer from "../PageContainer";

export default function ArtistForm({ mode }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [genre, setGenre] = useState("");
  const [bio, setBio] = useState("");
  const [allSongs, setAllSongs] = useState([]);
  const [selectedSongs, setSelectedSongs] = useState([]);
  const [error, setError] = useState(null);

  // ─── Load _all_ songs in one go ───────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        // ask page=1 & limit=1000 so we get every song
        const res = await fetchSongs(1, 1000);
        console.log("🎯 ArtistForm fetchSongs:", res.data);

        // API nests under `items`
        const items = Array.isArray(res.data.items) ? res.data.items : [];
        console.log("✅ rawSongs count:", items.length);

        setAllSongs(
          items.map((s) => ({
            value: s._id,
            label: s.title,
          }))
        );
      } catch (e) {
        console.error("🚨 ArtistForm fetchSongs failed:", e);
        setAllSongs([]);
      }
    })();
  }, []);

  // ─── If we’re editing, load the existing artist ──────────────────
  useEffect(() => {
    if (mode !== "edit") return;

    fetchArtistById(id)
      .then((res) => {
        const a = res.data;
        setName(a.name);
        setGenre(a.genre);
        setBio(a.bio);
        setSelectedSongs((a.songs || []).map((s) => s._id));
      })
      .catch((e) => {
        console.error("🚨 fetchArtistById failed:", e);
        setError(e.message);
      });
  }, [mode, id]);

  // ─── Handle create / update ─────────────────────────────────────
  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const payload = { name, genre, bio, songs: selectedSongs };
      if (mode === "create") await createArtist(payload);
      else await updateArtist(id, payload);
      navigate("/artists");
    } catch (e) {
      console.error("🚨 ArtistForm save failed:", e);
      setError(
        e.response?.data?.errors?.[0]?.msg ||
          e.response?.data?.error ||
          e.message
      );
    }
  };

  return (
    <PageContainer center>
      <h2>{mode === "create" ? "New Artist" : "Edit Artist"}</h2>
      {error && <Alert color="red">{error}</Alert>}

      <form onSubmit={onSubmit}>
        <TextInput
          label="Name"
          value={name}
          onChange={(e) => setName(e.currentTarget.value)}
          required
        />

        <TextInput
          label="Genre"
          value={genre}
          onChange={(e) => setGenre(e.currentTarget.value)}
          required
          mt="md"
        />

        <TextInput
          label="Bio"
          value={bio}
          onChange={(e) => setBio(e.currentTarget.value)}
          required
          mt="md"
        />

        <MultiSelect
          fullWidth
          data={allSongs}
          value={selectedSongs}
          onChange={setSelectedSongs}
          label="Songs"
          placeholder="Select songs…"
          searchable
          withinPortal // 🛠 teleport dropdown to body
          zIndex={999} // 🛠 ensure it floats above everything
          mt="md"
        />

        <Center mt="xl">
          <Button type="submit" color="#346d67">
            {mode === "create" ? "Create Artist" : "Update Artist"}
          </Button>
        </Center>
      </form>
    </PageContainer>
  );
}
