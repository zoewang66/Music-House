import React, { useState, useEffect } from "react";
import { SimpleGrid, Button, Loader, Center, Group, Text } from "@mantine/core";
import { Link } from "react-router-dom";
import PageContainer from "../PageContainer";
import ArtistCard from "./ArtistCard";
import { fetchArtists, deleteArtist } from "../../api/index";

export default function ArtistsList() {
  const [artists, setArtists] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const limit = 9;

  // Load a specific page of artists, and track total pages
  const loadPage = async (p) => {
    setLoading(true);
    try {
      const res = await fetchArtists(p, "", limit);

      // Case A: JSON body has .data & .totalPages
      if (res.data.data && typeof res.data.totalPages === "number") {
        setArtists(res.data.data);
        setTotalPages(res.data.totalPages);
      } else if (Array.isArray(res.data)) {
        // Case B: you returned a raw array, totalPages in headers
        const arr = res.data;
        setArtists(arr);
        // parse the header X-Total-Pages (if you added it)
        const tp = parseInt(res.headers["x-total-pages"], 10);
        setTotalPages(Number.isFinite(tp) ? tp : Math.ceil(arr.length / limit));
      } else {
        // Fallback: maybe you returned the array in res.data
        setArtists(res.data);
        setTotalPages(Math.ceil(res.data.length / limit));
      }

      setPage(p);
    } catch (err) {
      console.error("Error loading artists:", err);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadPage(1);
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this artist?")) return;
    await deleteArtist(id);
    // reload current page
    loadPage(page);
  };

  return (
    <PageContainer center={artists.length === 0}>
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
            {artists.map((artist) => (
              <ArtistCard
                key={artist._id}
                artist={artist}
                onDelete={handleDelete}
              />
            ))}
          </SimpleGrid>

          <Center mt="md">
            <Group spacing="md">
              <Button disabled={page === 1} onClick={() => loadPage(page - 1)}>
                Prev
              </Button>
              <Text>
                Page {page} of {totalPages}
              </Text>
              <Button
                disabled={page === totalPages}
                onClick={() => loadPage(page + 1)}
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
