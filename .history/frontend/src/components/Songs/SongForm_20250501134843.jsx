// src/components/SongForm.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  TextInput,
  NumberInput,
  Button,
  Alert,
  Select,
  Center,
  Loader,
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { useForm } from "@mantine/form";
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
  const [artistOptions, setArtistOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const form = useForm({
    initialValues: {
      title: "",
      duration: 0,
      releaseDate: null,
      artist: null,
    },
    validate: {
      title: (v) =>
        v.trim().length >= 2 ? null : "Title must be at least 2 characters",
      duration: (v) => (v > 0 ? null : "Duration must be greater than zero"),
      releaseDate: (v) =>
        v instanceof Date ? null : "Release date is required",
    },
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        // fetch all artists (multiple pages)
        let page = 1;
        let items = [];
        let totalPages = 1;
        do {
          const res = await fetchArtists(page, "", 50);
          items = items.concat(res.data.items);
          totalPages = res.data.totalPages;
          page++;
        } while (page <= totalPages);
        setArtistOptions(items.map((a) => ({ value: a._id, label: a.name })));

        if (mode === "edit") {
          const res = await fetchSongById(id);
          const song = res.data;
          form.setValues({
            title: song.title || "",
            duration: song.duration || 0,
            releaseDate: song.releaseDate ? new Date(song.releaseDate) : null,
            artist: song.artist?._id || null,
          });
        }
      } catch (e) {
        console.error(e);
        setError("Failed to load data. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id, mode, form]);

  const handleSubmit = async (values) => {
    setError(null);
    try {
      let payload = {
        title: values.title.trim(),
        duration: values.duration,
        releaseDate: values.releaseDate,
        artist: values.artist,
      };
      // create new artist if not existing ID
      if (!/^[0-9a-fA-F]{24}$/.test(values.artist)) {
        const res = await createArtist({ name: values.artist, genre: "" });
        payload.artist = res.data._id;
      }
      if (mode === "create") await createSong(payload);
      else await updateSong(id, payload);
      navigate("/songs");
    } catch (e) {
      console.error(e);
      setError(e.response?.data?.error || e.message);
    }
  };

  if (loading) {
    return (
      <PageContainer center>
        <Center style={{ minHeight: 200 }}>
          <Loader size="lg" />
        </Center>
      </PageContainer>
    );
  }

  return (
    <PageContainer center>
      <h2 style={{ textAlign: "center" }}>
        {mode === "create" ? "New Song" : "Edit Song"}
      </h2>
      {error && (
        <Alert color="red" mb="md">
          {error}
        </Alert>
      )}
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          label="Title"
          placeholder="Enter song title"
          withAsterisk
          {...form.getInputProps("title")}
          styles={{
            // The <input> element
            input: {
              color: "black",
              fontFamily: "Bellota, sans-serif",
              fontSize: "1.2rem",
            },
            // The <label> element
            label: {
              color: "white",
              fontFamily: "Bellota, sans-serif",
              fontSize: "1.2rem",
              fontWeight: "bold",
            },
            // The description text under the field
            description: {
              color: "#b24c66",
              fontFamily: "Bellota, sans-serif",
              fontSize: "1rem",
            },
            // The error message
            error: {
              color: "yellow",
              fontFamily: "Bellota, sans-serif",
              fontSize: "1.2rem",
            },
          }}
        />

        <NumberInput
          label="Duration (sec)"
          mt="md"
          withAsterisk
          {...form.getInputProps("duration")}
          styles={{
            // The <input> element
            input: {
              color: "black",
              fontFamily: "Bellota, sans-serif",
              fontSize: "1.2rem",
            },
            // The <label> element
            label: {
              color: "white",
              fontFamily: "Bellota, sans-serif",
              fontSize: "1.2rem",
              fontWeight: "bold",
            },
            // The description text under the field
            description: {
              color: "#b24c66",
              fontFamily: "Bellota, sans-serif",
              fontSize: "1rem",
            },
            // The error message
            error: {
              color: "yellow",
              fontFamily: "Bellota, sans-serif",
              fontSize: "1.2rem",
            },
          }}
        />

        <DatePicker
          label="Release Date"
          placeholder="Pick a date"
          mt="md"
          withAsterisk
          {...form.getInputProps("releaseDate")}
        />

        <Select
          label="Artist"
          placeholder="Select or type to add new"
          searchable
          creatable
          getCreateLabel={(query) => `+ Create ${query}`}
          onCreate={(query) => {
            const item = { value: query, label: query };
            setArtistOptions((current) => [...current, item]);
            return query;
          }}
          mt="md"
          withAsterisk
          data={artistOptions}
          {...form.getInputProps("artist")}
        />

        <Center mt="xl">
          <Button type="submit" color="#346d67">
            {mode === "create" ? "Create" : "Update"}
          </Button>
        </Center>
      </form>
    </PageContainer>
  );
}
