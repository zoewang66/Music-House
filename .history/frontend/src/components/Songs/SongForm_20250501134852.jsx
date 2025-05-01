import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  TextInput,
  NumberInput,
  Button,
  Alert,
  Select,
  Center,
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import {
  fetchSongById,
  fetchArtists,
  createSong,
  updateSong,
  createArtist,
} from "../../api/index";
import { useForm } from "@mantine/form";
import PageContainer from "../PageContainer";

export default function SongForm({ mode }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState(0);
  const [releaseDate, setReleaseDate] = useState(null);
  const [artistOptions, setArtistOptions] = useState([]);
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [error, setError] = useState(null);

  // ——— Load all pages of artists to ensure we get more than the backend's page limit ———
  useEffect(() => {
    (async () => {
      const pageSize = 9;
      // fetch page 1
      const { items: firstPage = [], totalPages } = await fetchArtists(
        1,
        "",
        pageSize
      );
      let all = firstPage;

      // fetch the rest
      for (let p = 2; p <= totalPages; p++) {
        // pause 200ms between each request
        await new Promise((resolve) => setTimeout(resolve, 200));
        const { items = [] } = await fetchArtists(p, "", pageSize);
        all = all.concat(items);
      }

      // populate dropdown
      setArtistOptions(all.map((a) => ({ value: a._id, label: a.name })));
    })();
  }, []);

  // If in “edit” mode, preload song data
  useEffect(() => {
    if (mode === "edit") {
      fetchSongById(id)
        .then((res) => {
          const song = res.data;
          setTitle(song.title);
          setDuration(song.duration);
          setReleaseDate(song.releaseDate ? new Date(song.releaseDate) : null);
          setSelectedArtist(song.artist?._id || null);
        })
        .catch((err) => setError(err.message));
    }
  }, [mode, id]);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      // build payload with single "artist" field
      const payload = { title, duration, releaseDate, artist: selectedArtist };

      if (!/^[0-9a-fA-F]{24}$/.test(selectedArtist)) {
        // Highlight: if user typed a new artist name, create it first
        const res = await createArtist({ name: selectedArtist, genre: "" });
        payload.artist = res.data._id;
      }

      if (mode === "create") await createSong(payload);
      else await updateSong(id, payload);

      navigate("/songs");
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    }
  };

  return (
    <PageContainer center={true}>
      <h2
        style={{
          color: "black",
          fontFamily: "Henny Penny, system-ui",
          fontSize: "1.5rem",
          fontWeight: "bold",
          textAlign: "center",
        }}
      >
        {mode === "create" ? "New Song" : "Edit Song"}
      </h2>
      {error && <Alert color="red">{error}</Alert>}
      <form onSubmit={onSubmit}>
        <TextInput
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.currentTarget.value)}
          required
        />

        <NumberInput
          label="Duration (sec)"
          value={duration}
          onChange={setDuration}
          required
          mt="md"
        />

        <DatePicker
          label="Release Date"
          placeholder="Pick a date"
          value={releaseDate}
          onChange={setReleaseDate}
          mt="md"
          hideWeekdays
        />

        <Select
          label="Artist"
          placeholder="Select or type to add new"
          searchable
          value={selectedArtist}
          onChange={setSelectedArtist}
          data={artistOptions}
          mt="md"
          required
        />

        <Center>
          <Button type="submit" mt="md" color="#346d67">
            {mode === "create" ? "Create" : "Update"}
          </Button>
        </Center>
      </form>
    </PageContainer>
  );
}
