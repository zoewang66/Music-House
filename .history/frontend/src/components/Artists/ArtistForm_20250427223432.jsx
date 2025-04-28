import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { TextInput, Button, Center, Alert, MultiSelect } from "@mantine/core";
import {
  fetchArtistById,
  fetchSongs,
  createArtist,
  updateArtist,
  deleteSong,
} from "../../api/index";
import PageContainer from "../PageContainer";

export default function ArtistForm({ mode }) {
  const { id } = useParams();
  const navigate = useNavigate();

  // form state
  const [name, setName] = useState("");
  const [genre, setGenre] = useState("");
  const [bio, setBio] = useState("");
  const [allSongs, setAllSongs] = useState([]);
  const [selectedSongs, setSelectedSongs] = useState([]);
  const [originalSongs, setOriginalSongs] = useState([]);
  const [error, setError] = useState(null);

  // load all songs for the dropdown
  useEffect(() => {
    fetchSongs()
      .then((res) =>
        setAllSongs(res.data.map((s) => ({ value: s._id, label: s.title })))
      )
      .catch(console.error);
  }, []);

  // if we're editing, preload the artist
  useEffect(() => {
    if (mode === "edit") {
      fetchArtistById(id)
        .then((res) => {
          const artist = res.data;
          setName(artist.name);
          setGenre(artist.genre);
          setBio(artist.bio);
          const ids = (artist.songs || []).map((s) => s._id);
          setOriginalSongs(ids);
          setSelectedSongs(ids);
        })
        .catch((e) => setError(e.message));
    }
  }, [mode, id]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      // 1) create or update the artist record
      let artistId = id;
      if (mode === "create") {
        const res = await createArtist({ name, genre, bio });
        artistId = res.data._id;
      } else {
        await updateArtist(id, { name, genre, bio });
      }

      // 2) figure out which songs were removed, and delete them
      const toDelete = originalSongs.filter(
        (sid) => !selectedSongs.includes(sid)
      );
      await Promise.all(toDelete.map((sid) => deleteSong(sid)));

      // 3) go back to list
      navigate("/artists");
    } catch (e) {
      setError(
        e.response?.data?.errors?.[0]?.msg ||
          e.response?.data?.error ||
          e.message
      );
    }
  };

  return (
    <PageContainer center={true}>
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
          label="Songs"
          data={allSongs}
          value={selectedSongs}
          onChange={setSelectedSongs}
          placeholder="Select songs (or type to add new)"
          creatable
          searchable
          getCreateLabel={(q) => `+ Add "${q}"`}
          onCreate={(q) => {
            setSelectedSongs((curr) => [...curr, q]);
            return { value: q, label: q };
          }}
          mt="md"
        />

        <Center mt="xl">
          <Button type="submit" mt="md" color="#346d67">
            {mode === "create" ? "Create" : "Update"}
          </Button>
        </Center>
      </form>
    </PageContainer>
  );
}
