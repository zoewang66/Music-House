import React, { useState, useEffect } from "react";
import {
  Container,
  SimpleGrid,
  Card,
  Text,
  Button,
  Group,
} from "@mantine/core";
import { fetchSongs, deleteSong } from "../../api/index";
import { Link } from "react-router-dom";

export default function SongsList() {
  const [allSongs, setAllSongs] = useState([]);
  const [displaySongs, setDisplaySongs] = useState([]);
  const [page, setPage] = useState(1);
  const limit = 10;

  // fetch all and initialize page 1
  useEffect(() => {
    fetchSongs().then((res) => {
      setAllSongs(res.data);
      setDisplaySongs(res.data.slice(0, limit));
    });
  }, []);

  const loadMore = () => {
    const nextPage = page + 1;
    const start = (nextPage - 1) * limit;
    const nextSlice = allSongs.slice(start, start + limit);
    setDisplaySongs((prev) => [...prev, ...nextSlice]);
    setPage(nextPage);
  };

  const onDelete = async (id) => {
    if (!confirm("Delete this song?")) return;
    await deleteSong(id);
    // remove from both lists
    setAllSongs((prev) => prev.filter((s) => s._id !== id));
    setDisplaySongs((prev) => prev.filter((s) => s._id !== id));
  };

  return (
    <Container mt="md">
      <Button component={Link} to="/songs/create" mb="md">
        + New Song
      </Button>
      <SimpleGrid cols={3} spacing="md">
        {displaySongs.map((s) => (
          <Card key={s._id} shadow="sm" padding="md">
            <Group position="apart" mb="sm">
              <Text weight={500}>{s.title}</Text>
              <Button
                size="xs"
                color="red"
                variant="subtle"
                onClick={() => onDelete(s._id)}
              >
                Delete
              </Button>
            </Group>
            <Text>Duration: {s.duration} sec</Text>
            <Button component={Link} to={`/songs/${s._id}`} size="xs" mt="sm">
              View/Edit
            </Button>
          </Card>
        ))}
      </SimpleGrid>

      {displaySongs.length < allSongs.length && (
        <Button fullWidth mt="md" onClick={loadMore}>
          Load More
        </Button>
      )}

      {displaySongs.length >= allSongs.length && (
        <Text color="dimmed" align="center" mt="md">
          No more songs.
        </Text>
      )}
    </Container>
  );
}
