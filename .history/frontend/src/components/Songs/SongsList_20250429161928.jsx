import React, { useState, useEffect, useRef } from "react";
import { SimpleGrid, Text, Button, Group, Center, Loader } from "@mantine/core";
import { fetchSongs, deleteSong } from "../../api/index";
import { Link } from "react-router-dom";
import PageContainer from "../PageContainer";
import SongCard from "./SongCard";

export default function SongsList() {
  const [songs, setSongs] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const limit = 9;
  const lastLoadRef = useRef(0);

  // fetch one page at a time
  const loadPage = async (p) => {
    // rate-limit: ignore any calls <300ms after the previous
    const now = Date.now();
    if (now - lastLoadRef.current < 300 || loading) return;
    setLoading(true);
    try {
      const res = await fetchSongs(p, limit);
      setSongs(res.data.items);
      setTotalPages(res.data.totalPages);
      setPage(p);
    } catch (err) {
      console.error("Failed to load songs", err);
    } finally {
      lastLoadRef.current = now;
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPage(1).catch(console.error);
  }, []);

  const onDelete = async (id) => {
    if (!confirm("Delete this song?")) return;
    await deleteSong(id);
    loadPage(page);
  };

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
            disabled={page === 1 || loading}
            onClick={() => loadPage(page - 1)}
          >
            Prev
          </Button>
          <Text>
            Page {page} of {totalPages}
          </Text>
          <Button
            color="#346d67"
            disabled={page === totalPages || loading}
            onClick={() => loadPage(page + 1)}
          >
            Next
          </Button>
        </Group>
      </Center>
    </PageContainer>
  );
}
