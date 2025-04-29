import React, { useState, useEffect } from "react";
import { SimpleGrid, Text, Button, Group, Loader, Center } from "@mantine/core";
import { fetchArtists, deleteArtist } from "../../api/index";
import { Link } from "react-router-dom";
import PageContainer from "../PageContainer";
import ArtistCard from "./ArtistCard";

export default function ArtistsList() {
  const [artists, setArtists] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const limit = 9;

  // ⚡ Server-side pagination loader
  const loadPage = async (p) => {
    setLoading(true);
    try {
      const res = await fetchArtists(p, "", limit);
      // assume API returns { items, totalPages }
      setArtists(res.data.items);
      setTotalPages(res.data.totalPages);
      setPage(p);
    } catch (err) {
      console.error("Failed to load artists:", err);
    } finally {
      setLoading(false);
    }
  };

  // initial load
  useEffect(() => {
    loadPage(1);
  }, []);

  const onDelete = async (id) => {
    if (!window.confirm("Delete this artist?")) return;
    await deleteArtist(id);
    loadPage(page);
  };

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
