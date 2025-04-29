import React, { useState, useRef } from "react";
import { SimpleGrid, Text, Button, Group, Center, Loader } from "@mantine/core";
import { fetchSongs, deleteSong } from "../../api/index";
import { Link } from "react-router-dom";
import PageContainer from "../PageContainer";
import SongCard from "./SongCard";
import { useQuery } from "@tanstack/react-query";
import "../../css/Page.css";

export default function SongsList() {
  const [blocked, setBlocked] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 9;
  const lastClick = useRef(0);

  // fetch & cache pages; never flashes empty thanks to keepPreviousData
  const { data, isFetching } = useQuery({
    queryKey: ["songs", page],
    queryFn: () => fetchSongs(page, limit).then((res) => res.data),
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5, // 5m cache
    refetchOnWindowFocus: false,
  });
  const items = data?.items || [];
  const totalPages = data?.totalPages || 1;

  // throttle rapid clicks, show overlay for the blocked double‐click
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
    if (!confirm("Delete this song?")) return;
    await deleteSong(id);
    // invalidate or refetch current page
    // optional: useQueryClient().invalidateQueries(["songs", page]);
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
          <Loader size="xl" color="#346d67" />
        </Center>
      )}

      <PageContainer center>
        <Button component={Link} to="/songs/create" id="add-btn">
          Add New Song
        </Button>

        <SimpleGrid
          className="card-list"
        >
          {items.map((s) => (
            <SongCard key={s._id} song={s} onDelete={onDelete} />
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
