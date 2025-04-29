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
    // load *all* songs, page by page
  (async () => {
  +    try {
  +      const pageSize = 9;             // match your backend per-page size
  +      // first page
  +      const { items: firstPage = [], totalPages } = await fetchSongs(
  +        1,
  +        "",
  +        pageSize
  +      );
  +      let all = firstPage;
  +
  +      // remaining pages
  +      for (let p = 2; p <= totalPages; p++) {
  +        const { items = [] } = await fetchSongs(p, "", pageSize);
  +        all = all.concat(items);
  +      }
  +
  +      setAllSongs(all.map((s) => ({ value: s._id, label: s.title })));
  +    } catch (e) {
  +      console.error("Error loading songs:", e);
  +      setAllSongs([]);
  +    }
  +  })();
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
    <PageContainer center={true} >
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
// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { TextInput, Button, Center, Alert, MultiSelect } from "@mantine/core";
// import {
//   fetchArtistById,
//   fetchSongs,
//   createArtist,
//   updateArtist,
// } from "../../api/index";
// import PageContainer from "../PageContainer";

// export default function ArtistForm({ mode }) {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [name, setName] = useState("");
//   const [genre, setGenre] = useState("");
//   const [bio, setBio] = useState("");
//   const [allSongs, setAllSongs] = useState([]); // dropdown options
//   const [selectedSongs, setSelectedSongs] = useState([]);
//   const [error, setError] = useState(null);

//   // ── Fixed: load *all* songs into the MultiSelect ─────────────
//   useEffect(() => {
//     (async () => {
//       try {
//         // ask for many so you get everything in one go
//         const wrapper = await fetchSongs(1, "", 1000);
//         // unwrap the array from whatever shape the API gives
//         const items = Array.isArray(wrapper)
//           ? wrapper
//           : Array.isArray(wrapper.items)
//           ? wrapper.items
//           : Array.isArray(wrapper.data)
//           ? wrapper.data
//           : [];

//         setAllSongs(
//           items.map((s) => ({
//             value: s._id,
//             label: s.title,
//           }))
//         );
//       } catch (e) {
//         console.error("Error loading songs:", e);
//         setAllSongs([]);
//       }
//     })();
//   }, []);
//   // ───────────────────────────────────────────────────────────────

//   // preload for “edit”
//   useEffect(() => {
//     if (mode !== "edit") return;
//     fetchArtistById(id)
//       .then((res) => {
//         const a = res.data;
//         setName(a.name);
//         setGenre(a.genre);
//         setBio(a.bio);
//         // if you want to pre-select existing songs:
//         // setSelectedSongs((a.songs||[]).map((s) => s._id));
//       })
//       .catch((e) => setError(e.message));
//   }, [mode, id]);

//   const onSubmit = async (e) => {
//     e.preventDefault();
//     setError(null);

//     try {
//       if (mode === "create") {
//         await createArtist({ name, genre, bio });
//       } else {
//         await updateArtist(id, { name, genre, bio });
//       }
//       navigate("/artists");
//     } catch (e) {
//       setError(
//         e.response?.data?.errors?.[0]?.msg ||
//           e.response?.data?.error ||
//           e.message
//       );
//     }
//   };

//   return (
//     <PageContainer center>
//       <h2>{mode === "create" ? "New Artist" : "Edit Artist"}</h2>
//       {error && <Alert color="red">{error}</Alert>}
//       <form onSubmit={onSubmit}>
//         <TextInput
//           label="Name"
//           value={name}
//           onChange={(e) => setName(e.currentTarget.value)}
//           required
//         />
//         <TextInput
//           label="Genre"
//           value={genre}
//           onChange={(e) => setGenre(e.currentTarget.value)}
//           required
//           mt="md"
//         />
//         <TextInput
//           label="Bio"
//           value={bio}
//           onChange={(e) => setBio(e.currentTarget.value)}
//           required
//           mt="md"
//         />

//         <MultiSelect
//           label="Songs"
//           data={allSongs}
//           value={selectedSongs}
//           onChange={setSelectedSongs}
//           placeholder="Select existing songs…"
//           searchable
//           creatable={false}
//           mt="md"
//         />

//         <Center mt="xl">
//           <Button type="submit" color="#346d67">
//             {mode === "create" ? "Create Artist" : "Update Artist"}
//           </Button>
//         </Center>
//       </form>
//     </PageContainer>
//   );
// }
