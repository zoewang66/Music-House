import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "@mantine/form";
import {
  TextInput,
  NumberInput,
  Button,
  Alert,
  Select,
  Center,
  Loader,
  InputWrapper,
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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import "../../css/Card.css";

export default function SongForm({ mode }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [artistOptions, setArtistOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const queryClient = useQueryClient();

 
  const saveSong = useMutation({
    mutationFn: (values) =>
      mode === 'edit' ? updateSong(id, values) : createSong(values),
    onSuccess() {
      queryClient.invalidateQueries(['songs']);
      navigate('/songs');
    },
    onError(err) {
      setError(err.message);
    },
  });


  const form = useForm({
    initialValues: {
      title: "",
      duration: 0,
      releaseDate: null,
      artist: "",
    },
    validate: {
      title: (v) =>
        v.trim().length >= 2 ? null : "Title must be at least 2 characters",
      duration: (v) => (v > 0 ? null : "Duration must be greater than zero"),
      releaseDate: (v) =>
        v instanceof Date ? null : "Release date is required",
      artist: (v) => (v ? null : "Please select an artist"),
    },
  });

  useEffect(() => {
    let cancelled = false;
  
    async function loadData() {
      try {
        const pageSize = 50;
        let page = 1;
        let totalPages = 1;
        const allArtists = [];
  
        do {
          const res = await fetchArtists(page, "", pageSize);
          const items = res.items || [];
          totalPages = res.totalPages ?? res.pages ?? 1;
  
          allArtists.push(...items);
          page++;
          if (page <= totalPages) {
            await new Promise((r) => setTimeout(r, 200));
          }
        } while (page <= totalPages);
  
        if (!cancelled) {
          setArtistOptions(
            allArtists.map((a) => ({ value: a._id, label: a.name }))
          );
        }
  
        if (mode === "edit" && !cancelled) {
          const { data: song } = await fetchSongById(id);
          form.setValues({
            title: song.title,
            duration: song.duration,
            releaseDate: song.releaseDate ? new Date(song.releaseDate) : null,
            artist: song.artist?._id || "",
          });
        }
      } catch (e) {
        console.error("SongForm loadData error:", e);
        if (!cancelled) setError("Failed to load data");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
  
    loadData();
  
    return () => {
      cancelled = true;
    };
  }, [id, mode]); 

  const handleSubmit = async (values) => {
    setError(null);

    try {
      let artistId = values.artist;
      if (!/^[0-9a-fA-F]{24}$/.test(artistId)) {
        const res = await createArtist({ name: artistId, genre: "" });
        artistId = res.data._id;
      }

      const payload = {
        title: values.title.trim(),
        duration: values.duration,
        releaseDate: values.releaseDate.toISOString(),
        artist: artistId,
      };

      saveSong.mutate(payload);
    } catch (e) {
      setError("Save failed");
    }
  };

  if (loading) {
    return (
      <PageContainer center>
        <Center style={{ minHeight: 200 }}>
          <Loader size="lg" color="#346d67"/>
        </Center>
      </PageContainer>
    );
  }

  return (
    <PageContainer center>
      <h2 style={{
          color: "black",
          fontFamily: "Henny Penny, system-ui",
          fontSize: "1.5rem",
          fontWeight: "bold",
          textAlign: "center",
          marginTop: "2.5rem",
        }}>
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
          description="At least 2 characters"
          placeholder="Enter song title"
          {...form.getInputProps("title")}
          required
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
          placeholder="e.g. 230"
          description="Must at least 1 second"
          mt="md"
          {...form.getInputProps("duration")}
          required
          styles={{
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

        <InputWrapper label="Release Date" mt="md" styles={{
            // The <label> element
            label: {
              color: "white",
              fontFamily: "Bellota, sans-serif",
              fontSize: "1.2rem",
              fontWeight: "bold",
            },
          }}>
        
        <DatePicker
            placeholder="Pick a date"
            description="Must pick a date"
            {...form.getInputProps("releaseDate")}
            required
            styles={{
              width: "100%",
              backgroundColor: "white",
              borderRadius: "6px",
              color: "black",
              fontFamily: "Bellota, sans-serif",
              fontSize: "1.2rem",
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
          </InputWrapper>

        <Select
          label="Artist"
          placeholder="Select or type to add new"
          data={artistOptions}
          searchable
          creatable
          description="Must pick/create an artist"
          getCreateLabel={(q) => `+ Create ${q}`}
          onCreate={(q) => {
            const item = { value: q, label: q };
            setArtistOptions((a) => [...a, item]);
            return q;
          }}
          {...form.getInputProps("artist")}
          required
          mt="md"
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
      </form>
    </PageContainer>
  );
}
