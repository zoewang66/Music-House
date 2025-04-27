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

  // Fetch all artists (increase limit if needed)
  // ——— Load all pages of artists to ensure we get more than the backend's page limit ———
  useEffect(() => {
    async function loadAllArtists() {
      let page = 1;
      const limit = 10; // backend page size
      let all = [];
      while (true) {
        const res = await fetchArtists(page, "", limit); // fetchArtists(page, name, limit) :contentReference[oaicite:0]{index=0}&#8203;:contentReference[oaicite:1]{index=1}
        const data = res.data;
        all = all.concat(data);
        if (data.length < limit) break;
        page++;
      }
      setArtistOptions(all.map((a) => ({ value: a._id, label: a.name })));
    }
    loadAllArtists().catch(console.error);
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
      <h2>{mode === "create" ? "New Song" : "Edit Song"}</h2>
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
          styles={(theme) => ({
            // the text input itself
            input: {
              backgroundColor: "#F4EDEA",
              color: "#000000",
              borderColor: theme.colors.gray[4],
              "&::placeholder": {
                color: theme.colors.gray[6],
              },
            },

            // the calendar pop-over
            calendar: {
              backgroundColor: "#f0f0f0",
            },

            // weekday header row (Mo, Tu, …)
            weekday: {
              color: theme.black,
            },

            // individual day cells
            day: {
              color: theme.black,
              "&:hover": {
                backgroundColor: theme.colors.gray[2],
              },
            },

            // selected day
            daySelected: {
              backgroundColor: "#346d67 ",
              color: "#ffffff",
            },

            // days in range (if you use range picker)
            dayInRange: {
              backgroundColor: theme.colors.teal[1],
            },

            // header controls (month / year arrows and title)
            calendarHeader: {
              backgroundColor: "#ffffff",
              color: theme.black,
            },
          })}
        />

        <Select
          label="Artist"
          placeholder="Select or type to add new"
          searchable
          creatable
          getCreateLabel={(query) => `+ Create "${query}"`}
          value={selectedArtist}
          onChange={setSelectedArtist}
          data={artistOptions}
          mt="md"
          required
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
