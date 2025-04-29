// import React, { useState, useEffect } from "react";
// import { SimpleGrid, Text, Button, Group, Loader, Center } from "@mantine/core";
// import { fetchArtists, deleteArtist } from "../../api/index";
// import { Link } from "react-router-dom";
// import PageContainer from "../PageContainer";
// import ArtistCard from "./ArtistCard";

// export default function ArtistsList() {
//   const [artists, setArtists] = useState([]);
//   const [page, setPage] = useState(1);
//   const [loading, setLoading] = useState(false);
//   const limit = 9;

//   // load page p
//   const loadPage = async (p) => {
//     setLoading(true);
//     try {
//       const res = await fetchArtists(p, "", limit);
//       setArtists(res.data);
//       setPage(p);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // initial load
//   useEffect(() => {
//     loadPage(1);
//   }, []);

//   useEffect(() => {
//     fetchArtists()
//       .then((res) => setArtists(res.data))
//       .catch(console.error);
//   }, []);

//   const totalPages = Math.ceil(artists.length < limit ? page : page + 1);

//   // simpler: disable Next if fetched artists < limit

//   const onDelete = async (id) => {
//     if (!window.confirm("Delete this artist?")) return;
//     await deleteArtist(id);
//     // reload current page
//     loadPage(page);
//   };

//   return (
//     <PageContainer center={true} >
//       <Button component={Link} to="/songs/create" mb="md" color="#346d67">
//         Add New Song
//       </Button>
//       {loading ? (
//         <Center mt="md">
//           <Loader />
//         </Center>
//       ) : (
//         <>
//           <SimpleGrid
//             spacing="md"
//             style={{
//               gridTemplateColumns: "repeat(3, 300px)",
//               justifyContent: "center",
//             }}
//           >
//             {artists.map((a) => (
//               <ArtistCard key={a._id} artist={a} onDelete={onDelete} />
//             ))}
//           </SimpleGrid>

//           <Center>
//             <Group spacing="md" mt="md">
//               <Button
//                 color="#346d67"
//                 disabled={page === 1}
//                 onClick={() => loadPage(page - 1)}
//               >
//                 Prev
//               </Button>
//               <Text>
//                 Page {page} of {totalPages}
//               </Text>
//               <Button
//                 color="#346d67"
//                 disabled={artists.length < limit}
//                 onClick={() => loadPage(page + 1)}
//               >
//                 Next
//               </Button>
//             </Group>
//           </Center>
//         </>
//       )}
//     </PageContainer>
//   );
// }

import React, { useState, useEffect } from "react";
import { SimpleGrid, Text, Button, Group, Loader, Center } from "@mantine/core";
import { fetchArtists, deleteArtist } from "../../api/index";
import { Link } from "react-router-dom";
import PageContainer from "../PageContainer";
import ArtistCard from "./ArtistCard";

export default function ArtistsList() {
  // ⚡ mirror SongsList client-side pagination
  const [allArtists, setAllArtists] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const limit = 9;

  // fetch full artist list once
  useEffect(() => {
    setLoading(true);
    fetchArtists()
      .then((res) => {
        setAllArtists(res.data); // ⚡ full data array
        setTotalPages(Math.ceil(res.data.length / limit)); // ⚡ compute pages
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const onDelete = async (id) => {
    if (!window.confirm("Delete this artist?")) return;
    await deleteArtist(id);
    // remove deleted and recalc pages
    setAllArtists((prev) => prev.filter((a) => a._id !== id));
    const newTotal = Math.ceil((allArtists.length - 1) / limit);
    setTotalPages(newTotal);
    if (page > newTotal) setPage(newTotal);
  };

  // derive slice for current page
  const start = (page - 1) * limit;
  const displayArtists = allArtists.slice(start, start + limit);

  return (
    <PageContainer center>
      <Button component={Link} to="/artists/create" mb="md" color="#346d67">
        Add New Artist
      </Button>
      {loading ? (
        <Center mt="md">
          <Loader />
        </Center>
      ) : (
        <>
          <SimpleGrid
            spacing="md"
            style={{
              gridTemplateColumns: "repeat(3, 300px)",
              justifyContent: "center",
            }}
          >
            {/* ⚡ render only current page slice */}
            {displayArtists.map((a) => (
              <ArtistCard key={a._id} artist={a} onDelete={onDelete} />
            ))}
          </SimpleGrid>

          <Center>
            <Group spacing="md" mt="md">
              <Button
                color="#346d67"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                Prev
              </Button>
              <Text>
                Page {page} of {totalPages}
              </Text>
              <Button
                color="#346d67"
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
              >
                Next
              </Button>
            </Group>
          </Center>
        </>
      )}
    </PageContainer>
  );
}
