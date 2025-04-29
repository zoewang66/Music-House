import React, { useState, useEffect, useRef } from "react";
import { SimpleGrid, Text, Button, Group, Loader, Center } from "@mantine/core";
import { fetchArtists, deleteArtist } from "../../api/index";
import { Link } from "react-router-dom";
import PageContainer from "../PageContainer";
import ArtistCard from "./ArtistCard";

export default function ArtistsList() {
  const [blocked, setBlocked] = useState(false);
  const [artists, setArtists] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const limit = 9;
  const lastLoadRef = useRef(0);

  const loadPage = async (p, onUserAction = false) => {
    // rate-limit: ignore any calls <300ms after the previous
    const now = Date.now();
    if (onUserAction && now - lastLoadRef.current < 300) {
      setBlocked(true);
      setTimeout(() => setBlocked(false), 300);
      return;
    }
    if (onUserAction) lastLoadRef.current = now;
    setLoading(true);
    try {
      // fetch the full wrapper
      const {
        items,
        page: currentPage,
        totalPages: tp,
      } = await fetchArtists(p, "", limit);
      // set state from server metadata
      setArtists(Array.isArray(items) ? items : []);
      setPage(currentPage);
      setTotalPages(tp);
    } catch (err) {
      console.error("Failed to load artists", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPage(1);
  }, []);

  const onDelete = async (id) => {
    if (!window.confirm("Delete this artist?")) return;
    await deleteArtist(id);
    loadPage(page);
  };

  return (
    <>
      {blocked && !loading && (
        <Center
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            zIndex: 10,
          }}
        >
          <Loader size="xl" color="#346d67" />
        </Center>
      )}
      <PageContainer center>
        <Button component={Link} to="/artists/create" mb="md" color="#346d67">
          Add New Artist
        </Button>

        <>
          <SimpleGrid
            spacing="md"
            style={{
              gridTemplateColumns: "repeat(3, 300px)",
              justifyContent: "center",
            }}
          >
            {/* guard so .map never crashes */}
            {(Array.isArray(artists) ? artists : []).map((a) => (
              <ArtistCard key={a._id} artist={a} onDelete={onDelete} />
            ))}
          </SimpleGrid>

          <Center>
            <Group spacing="md" mt="md">
              <Button
                color="#346d67"
                disabled={page === 1}
                onClick={() => loadPage(page - 1)}
              >
                Prev
              </Button>

              <Text>
                Page {page} of {totalPages}
              </Text>

              <Button
                color="#346d67"
                disabled={page === totalPages}
                onClick={() => loadPage(page + 1)}
              >
                Next
              </Button>
            </Group>
          </Center>
        </>
      </PageContainer>
    </>
  );
}
