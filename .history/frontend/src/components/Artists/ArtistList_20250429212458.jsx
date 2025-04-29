import React, { useState, useRef } from "react";
import { SimpleGrid, Text, Button, Group, Center, Loader } from "@mantine/core";
import { fetchArtists, deleteArtist } from "../../api/index";
import { Link } from "react-router-dom";
import PageContainer from "../PageContainer";
import ArtistCard from "./ArtistCard";
import { useQuery } from "@tanstack/react-query";
import "../../css/ArtistPage.css";

export default function ArtistsList() {
  const [blocked, setBlocked] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 9;
  const lastClick = useRef(0);

  const { data, isFetching } = useQuery({
    queryKey: ["artists", page],
    queryFn: () => fetchArtists(page, "", limit), // fetchArtists already returns res.data
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  // adjust these to whatever your API payload uses:
  const items = data?.items || [];
  const totalPages = data?.totalPages || 1;

  const changePage = (newPage) => {
    const now = Date.now();
    if (now - lastClick.current < 300) {
      setBlocked(true);
      setTimeout(() => setBlocked(false), 300);
      return;
    }
    lastClick.current = now;
    setPage(newPage);
  };

  const onDelete = async (id) => {
    if (!confirm("Delete this artist?")) return;
    await deleteArtist(id);
    // optionally: invalidate or refetch
    // queryClient.invalidateQueries(["artists", page]);
  };

  return (
    <>
      {blocked && (
        <Center
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            zIndex: 10000,
          }}
        >
          <Loader size="xl" />
        </Center>
      )}

      <PageContainer center>
        <Button component={Link} to="/artists/create" mb="md" color="#346d67">
          Add New Artist
        </Button>

        <SimpleGrid
          className="artist-card-list"
          spacing="md"
          mb="lg"
        >
          {items.map((a) => (
            <ArtistCard key={a._id} artist={a} onDelete={onDelete} />
          ))}
        </SimpleGrid>

        <Center mt="xxxl">
          <Group position="center" spacing="md" mt="md">
            <Button
              color="#346d67"
              disabled={page === 1 || isFetching}
              onClick={() => changePage(page - 1)}
            >
              Prev
            </Button>

            <Text>
              Page {page} of {totalPages}
            </Text>

            <Button
              color="#346d67"
              disabled={page === totalPages || isFetching}
              onClick={() => changePage(page + 1)}
            >
              Next
            </Button>
          </Group>
        </Center>
      </PageContainer>
    </>
  );
}
