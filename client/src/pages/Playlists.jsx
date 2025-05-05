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
  Alert,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import {
  fetchSongs,
  createPlaylist,
  updatePlaylist,
  fetchPlaylistById,
} from "../api/index";
import PageContainer from "../components/PageContainer";
import "../css/Card.css";

export default function Playlist({ mode }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [songOptions, setSongOptions] = useState([]);
  const [submitError, setSubmitError] = useState(null);
  const form = useForm({
    initialValues: {
      name: "",
      description: "",
      songs: [],
    },
    validate: {
      name: (value) =>
        value.length < 3 ? "Name must be at least 3 characters" : null,
      description: (value) =>
        value.length < 10 ? "Description must be at least 10 characters" : null,
      songs: (value) =>
        value.length === 0 ? "Please select at least one song" : null,
    },
  });

  useEffect(() => {
    async function init() {
      try {
        let page = 1;
        let allItems = [];
        let totalPages = 1;

        do {
          const res = await fetchSongs(page, 9);
          allItems = allItems.concat(res.data.items);
          totalPages = res.data.totalPages;
          page++;
        } while (page <= totalPages);

        const options = allItems.map((s) => ({ value: s._id, label: s.title }));
        setSongOptions(options);

       
        if (mode === "edit") {
          const res = await fetchPlaylistById(id);
          const { name, description, songs } = res.data;
          form.setValues({
            name,
            description,
            songs: songs.map((s) => s._id),
          });
        }
      } catch (err) {
        console.error("PlaylistForm init failed:", err);
        if (err.response?.status === 401) {
          navigate("/login", { replace: true });
        }
      }
    }
    init();
  }, [mode, id]);

  const handleFormSubmit = async (values) => {
    setSubmitError(null);
    try {
      const payload = {
        name: values.name.trim(),
        description: values.description.trim(),
        songs: values.songs,
      };
      const action =
        mode === "create"
          ? createPlaylist(payload)
          : updatePlaylist(id, payload);
      await action;
      navigate("/playlists");
    } catch (err) {
      console.error("save playlist failed:", err.response?.data || err);
      setSubmitError(err.response?.data?.error || "Save failed");
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
        {mode === "create" ? "New Playlist" : "Edit Playlist"}
      </h2>
      {submitError && <Alert color="red">{submitError}</Alert>}

      <form onSubmit={form.onSubmit(handleFormSubmit)}>
        <Stack spacing="md">
          <TextInput
            fullWidth
            label="Name"
            placeholder="Playlist name"
            required
            description="At least 3 characters"
            {...form.getInputProps("name")}
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
          <Textarea
            fullWidth
            label="Description"
            placeholder="Playlist description"
            description="at least 10 characters"
            withAsterisk
            {...form.getInputProps("description")}
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
          <MultiSelect
            fullWidth
            placeholder="Select songs"
            data={songOptions}
            searchable
            label="Songs"
            mt={"md"}
            withAsterisk
            description="Pick one or more songs"
            {...form.getInputProps("songs")}
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
          <Center mt="xl">
            <Button type="submit" className="v-btn">
              {mode === "create" ? "Create" : "Update"}
            </Button>
          </Center>
        </Stack>
      </form>
    </PageContainer>
  );
}
