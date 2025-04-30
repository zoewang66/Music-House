import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "@mantine/form";
import {
  TextInput,
  Button,
  Center,
  Alert,
  MultiSelect,
  Loader,
} from "@mantine/core";
import {
  fetchArtistById,
  fetchSongs,
  createArtist,
  updateArtist,
} from "../../api/index";
import PageContainer from "../PageContainer";
import "../../css/Validation.css";
import "../../css/Card.css";

export default function ArtistForm({ mode }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [allSongs, setAllSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // initialize form
  const form = useForm({
    initialValues: { name: "", genre: "", bio: "", songs: [] },
    validate: {
      name: (v) =>
        v.trim().length >= 3 ? null : "Name must be at least 3 characters",
      genre: (v) => (v.trim() ? null : "Genre is required"),
      bio: (v) =>
        v.trim().length >= 10 ? null : "Bio must be at least 10 characters",
    },
  });

  // load songs and (optionally) artist
  useEffect(() => {
    const loadData = async () => {
      try {
        // fetch all songs
        let page = 1;
        let items = [];
        let totalPages = 1;
        do {
          const res = await fetchSongs(page, 50);
          items = items.concat(res.data.items);
          totalPages = res.data.totalPages;
          page++;
        } while (page <= totalPages);
        setAllSongs(items.map((s) => ({ value: s._id, label: s.title })));

        if (mode === "edit") {
          // fetch artist details
          const res = await fetchArtistById(id);
          const a = res.data;
          form.setValues({
            name: a.name || "",
            genre: a.genre || "",
            bio: a.bio || "",
            songs: (a.songs || []).map((s) => s._id),
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
      const payload = {
        name: values.name.trim(),
        genre: values.genre.trim(),
        bio: values.bio.trim(),
        songs: values.songs,
      };
      if (mode === "create") await createArtist(payload);
      else await updateArtist(id, payload);
      navigate("/artists");
    } catch (e) {
      console.error(e);
      setError(
        e.response?.data?.errors?.[0]?.msg ||
          e.response?.data?.error ||
          "Failed to save."
      );
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
      <div className="artist-form-container">
        <h2 className="h2">
          {mode === "create" ? "New Artist" : "Edit Artist"}
        </h2>
        {error && (
          <Alert color="red" mb="md">
            {error}
          </Alert>
        )}

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <input
          type="text"
            label="Name"
            placeholder="Enter artist name"
            description="At least 3 characters"
            withAsterisk
            {...form.getInputProps("name")}
          />

          <input
          type="text"
            label="Genre"
            placeholder="e.g. Pop, Rock, Jazz"
            description="Required"
            mt="md"
            withAsterisk
            {...form.getInputProps("genre")}
          />

          <input
            label="Bio"
            placeholder="Brief description (min. 10 chars)"
            description="Required"
            mt="md"
            withAsterisk
            {...form.getInputProps("bio")}
          />

          <MultiSelect
            label="Songs"
            placeholder="Select songs…"
            // description="Optional"
            searchable
            mt="md"
            data={allSongs}
            {...form.getInputProps("songs")}
          />

          <Center mt="xl">
            <Button type="submit" color="#346d67">
              {mode === "create" ? "Create Artist" : "Update Artist"}
            </Button>
          </Center>
        </form>
      </div>
    </PageContainer>
  );
}
