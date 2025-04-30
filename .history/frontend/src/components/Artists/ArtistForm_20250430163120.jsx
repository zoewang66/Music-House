// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { useForm } from "@mantine/form";
// import {
//   TextInput,
//   Button,
//   Center,
//   Alert,
//   MultiSelect,
//   Loader,
// } from "@mantine/core";
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
//   const [allSongs, setAllSongs] = useState([]);
//   const [selectedSongs, setSelectedSongs] = useState([]);
//   const [error, setError] = useState(null);
//   const [loadingSongs, setLoadingSongs] = useState(true);
//   const [loadingArtist, setLoadingArtist] = useState(mode === "edit");

//   // form with validation
//   const form = useForm({
//     initialValues: {
//       name: "",
//       genre: "",
//       bio: "",
//       songs: [],
//     },
//     validate: {
//       name: (value) =>
//         value.trim().length >= 3 ? null : "Name must be at least 3 characters",
//       genre: (value) => (value.trim().length > 0 ? null : "Genre is required"),
//       bio: (value) =>
//         value.trim().length >= 10 ? null : "Bio must be at least 10 characters",
//       songs: (value) => (value.length > 0 ? null : "Select at least one song"),
//     },
//   });
//   // Load song options first
//   useEffect(() => {
//     const loadAllSongs = async () => {
//       try {
//         let page = 1;
//         let allItems = [];
//         let totalPages = 1;

//         do {
//           const res = await fetchSongs(page, 9);
//           const { items, totalPages: tp } = res.data;
//           allItems = allItems.concat(items);
//           totalPages = tp;
//           page++;
//         } while (page <= totalPages);

//         setAllSongs(allItems.map((s) => ({ value: s._id, label: s.title })));
//       } catch (e) {
//         console.error("🚨 loadAllSongs failed:", e);
//       } finally {
//         setLoadingSongs(false);
//       }
//     };

//     loadAllSongs();
//   }, []);

//   // Then fetch artist data
//   useEffect(() => {
//     if (mode !== "edit" || loadingSongs) return;

//     setLoadingArtist(true);
//     fetchArtistById(id)
//       .then((res) => {
//         const a = res.data;
//         setName(a.name);
//         setGenre(a.genre);
//         setBio(a.bio);
//         setSelectedSongs((a.songs || []).map((s) => s._id));
//       })
//       .catch((e) => {
//         console.error("🚨 fetchArtistById failed:", e);
//         setError(e.message);
//       })
//       .finally(() => {
//         setLoadingArtist(false);
//       });
//   }, [mode, id, loadingSongs]);

//   const onSubmit = async (e) => {
//     e.preventDefault();
//     setError(null);

//     try {
//       const payload = { name, genre, bio, songs: selectedSongs };
//       if (mode === "create") await createArtist(payload);
//       else await updateArtist(id, payload);
//       navigate("/artists");
//     } catch (e) {
//       console.error("🚨 ArtistForm save failed:", e);
//       setError(
//         e.response?.data?.errors?.[0]?.msg ||
//           e.response?.data?.error ||
//           e.message
//       );
//     }
//   };

//   // Show loader until all data ready
//   if (loadingSongs || loadingArtist) {
//     return (
//       <PageContainer center>
//         <Center style={{ minHeight: 200 }}>
//           <Loader size="lg" />
//         </Center>
//       </PageContainer>
//     );
//   }

//   return (
//     <PageContainer center>
//       <div style={{ maxWidth: 600, width: "100%" }}>
//         <h2>{mode === "create" ? "New Artist" : "Edit Artist"}</h2>
//         {error && <Alert color="red">{error}</Alert>}

//         <form onSubmit={onSubmit}>
//           <TextInput
//             label="Name"
//             value={name}
//             onChange={(e) => setName(e.currentTarget.value)}
//             required
//           />

//           <TextInput
//             label="Genre"
//             value={genre}
//             onChange={(e) => setGenre(e.currentTarget.value)}
//             required
//             mt="md"
//           />

//           <TextInput
//             label="Bio"
//             value={bio}
//             onChange={(e) => setBio(e.currentTarget.value)}
//             required
//             mt="md"
//           />

//           <MultiSelect
//             fullWidth
//             data={allSongs}
//             value={selectedSongs}
//             onChange={setSelectedSongs}
//             label="Songs"
//             placeholder="Select songs…"
//             searchable
//             mt="md"
//           />

//           <Center mt="xl">
//             <Button type="submit" color="#346d67">
//               {mode === "create" ? "Create Artist" : "Update Artist"}
//             </Button>
//           </Center>
//         </form>
//       </div>
//     </PageContainer>
//   );
// }
