import React, { useState, useEffect } from "react";
import { SimpleGrid, Text, Button, Group, Center } from "@mantine/core";
import { fetchSongs, deleteSong } from "../../api/index";
import { Link } from "react-router-dom";
import PageContainer from "../PageContainer";
import SongCard from "./SongCard";

export default function SongsList() {
  const [allSongs, setAllSongs] = useState([]);
  const [songs, setSongs] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 9;

  // fetch one page at a time
  const loadPage = async (p) => {
    try {
      const res = await fetchSongs(p, { limit });
      const allSongs = res.data;
      setSongs(allSongs);
      // compute how many pages at 'limit' per page:
      setTotalPages(Math.ceil(allSongs.length / limit));
      setPage(p);
    } catch (err) {
      console.error("Failed to load songs", err);
    }
  };

  useEffect(() => {
        fetchSongs()
          .then((res) => {
            // ⚡ full data array received
            setAllSongs(res.data);
            // compute total pages based on limit
           setTotalPages(Math.ceil(res.data.length / limit));
          })
          .catch(console.error);
       }, []);

  const onDelete = async (id) => {
    if (!confirm("Delete this song?")) return;
    await deleteSong(id);
    loadPage(page);
  };

  // fetch all songs once
  // useEffect(() => {
  //   fetchSongs()
  //     .then((res) => setAllSongs(res.data))
  //     .catch(console.error);
  // }, []);

  // const totalPages = Math.ceil(allSongs.length / limit);
  // const start = (page - 1) * limit;
  // const displaySongs = allSongs.slice(start, start + limit);

  // const onDelete = async (id) => {
  //   if (!confirm("Delete this song?")) return;
  //   await deleteSong(id);
  //   setAllSongs((prev) => prev.filter((s) => s._id !== id));
  //   if (page > 1 && displaySongs.length === 1) {
  //     // go back if last item removed
  //     setPage(page - 1);
  //   }
  // };

  return (
    <PageContainer center={true}>
      <Button component={Link} to="/songs/create" mb="md" color="#346d67">
        Add New Song
      </Button>
      <SimpleGrid
        spacing="md"
        mb="lg"
        style={{
          gridTemplateColumns: "repeat(3, 300px)",
          justifyContent: "center",
        }}
      >
        {songs.map((s) => (
          <SongCard key={s._id} song={s} onDelete={onDelete} />
        ))}
      </SimpleGrid>

      <Center mt="xxxl">
        <Group position="center" spacing="md" mt="md">
          <Button
            color="#346d67"
            disabled={page === 1}
            // onClick={() => setPage(page - 1)}
            onClick={() => loadPage(page - 1)}
          >
            Prev
          </Button>
          <Text>
            {/* Page {page} of {totalPages || 1} */}
            Page {page} of {totalPages}
          </Text>
          <Button
            color="#346d67"
            // disabled={page === totalPages || totalPages === 0}
            // onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
            onClick={() => loadPage(page + 1)}
          >
            Next
          </Button>
        </Group>
      </Center>
    </PageContainer>
  );
}
