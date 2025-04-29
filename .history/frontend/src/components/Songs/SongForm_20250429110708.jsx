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
    <PageContainer center={true} >
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
          hideWeekdays
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

        <Center>
          <Button type="submit" mt="md" color="#346d67">
            {mode === "create" ? "Create" : "Update"}
          </Button>
        </Center>
      </form>
    </PageContainer>
  );
}

// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import {
//   TextInput,
//   NumberInput,
//   Button,
//   Alert,
//   Select,
//   Center,
// } from "@mantine/core";
// import { DatePicker } from "@mantine/dates";
// import {
//   fetchSongById,
//   fetchArtists,
//   createSong,
//   updateSong,
//   createArtist,
// } from "../../api/index";
// import PageContainer from "../PageContainer";

// export default function SongForm({ mode }) {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [title, setTitle] = useState("");
//   const [duration, setDuration] = useState(0);
//   const [releaseDate, setReleaseDate] = useState(null);
//   const [artistOptions, setArtistOptions] = useState([]);
//   const [selectedArtist, setSelectedArtist] = useState("");
//   const [error, setError] = useState(null);

//   // 1) Load *all* artists into the dropdown in one go
//   useEffect(() => {
//     (async () => {
//       try {
//         const wrapper = await fetchArtists(1, "", 1000);
//         const items = Array.isArray(wrapper)
//           ? wrapper
//           : Array.isArray(wrapper.items)
//           ? wrapper.items
//           : Array.isArray(wrapper.data)
//           ? wrapper.data
//           : [];
//         setArtistOptions(items.map((a) => ({ value: a._id, label: a.name })));
//       } catch (e) {
//         console.error("Error loading artists", e);
//         setArtistOptions([]);
//       }
//     })();
//   }, []);

//   // 2) If editing, preload the song record
//   useEffect(() => {
//     if (mode !== "edit") return;
//     fetchSongById(id)
//       .then((res) => {
//         const s = res.data;
//         setTitle(s.title);
//         setDuration(s.duration);
//         setReleaseDate(s.releaseDate ? new Date(s.releaseDate) : null);
//         setSelectedArtist(s.artist?._id || "");
//       })
//       .catch((e) => setError(e.message));
//   }, [mode, id]);

//   // 3) Submit: create a new artist on‐the‐fly if needed, then save the song
//   const onSubmit = async (e) => {
//     e.preventDefault();
//     setError(null);
//     try {
//       let aid = selectedArtist;
//       if (!/^[0-9a-fA-F]{24}$/.test(aid)) {
//         // user typed a new name, create it
//         const res = await createArtist({ name: aid, genre: "", bio: "" });
//         aid = res.data._id;
//       }

//       const payload = {
//         title,
//         duration,
//         releaseDate,
//         artist: aid,
//       };

//       if (mode === "create") {
//         await createSong(payload);
//       } else {
//         await updateSong(id, payload);
//       }
//       navigate("/songs");
//     } catch (e) {
//       setError(e.response?.data?.error || e.message);
//     }
//   };

//   return (
//     <PageContainer center>
//       <h2>{mode === "create" ? "New Song" : "Edit Song"}</h2>
//       {error && <Alert color="red">{error}</Alert>}
//       <form onSubmit={onSubmit}>
//         <TextInput
//           label="Title"
//           value={title}
//           onChange={(e) => setTitle(e.currentTarget.value)}
//           required
//         />

//         <NumberInput
//           label="Duration (sec)"
//           value={duration}
//           onChange={setDuration}
//           required
//           mt="md"
//         />

//         <DatePicker
//           label="Release Date"
//           placeholder="Pick a date"
//           value={releaseDate}
//           onChange={setReleaseDate}
//           mt="md"
//           hideWeekdays
//         />

//         <Select
//           label="Artist"
//           placeholder="Select or type new"
//           searchable
//           creatable
//           getCreateLabel={(q) => `+ Create "${q}"`}
//           value={selectedArtist}
//           onChange={setSelectedArtist}
//           data={artistOptions}
//           mt="md"
//           required
//         />

//         <Center mt="xl">
//           <Button type="submit" color="#346d67">
//             {mode === "create" ? "Create Song" : "Update Song"}
//           </Button>
//         </Center>
//       </form>
//     </PageContainer>
//   );
// }
