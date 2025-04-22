import React, { useState, useEffect } from "react";
import {
  Container,
  SimpleGrid,
  Card,
  Text,
  Button,
  Group,
  Loader,
  Center,
} from "@mantine/core";
import { fetchArtists, deleteArtist } from "../../api/index";
import { Link } from "react-router-dom";

export default function ArtistsList() {
  const [artists, setArtists] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const limit = 10;

  // Fetch page 1 on mount
  useEffect(() => {
    loadPage(1);
  }, []);

  // Highlight: load artists page-by-page via API parameters
  const loadPage = async (p) => {
    setLoading(true);
    try {
      const res = await fetchArtists(p, "", limit);
      const data = res.data;
      setArtists((prev) => (p === 1 ? data : [...prev, ...data]));
      setHasMore(data.length === limit);
      setPage(p);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (hasMore && !loading) loadPage(page + 1);
  };

  const onDelete = async (id) => {
    if (!window.confirm("Delete this artist?")) return;
    await deleteArtist(id);
    setArtists((prev) => prev.filter((a) => a._id !== id));
  };

  return (
    <Container mt="md">
      <Button component={Link} to="/artists/create" mb="md">
        + New Artist
      </Button>
      <SimpleGrid cols={3} spacing="md">
        {artists.map((a) => (
          <Card key={a._id} shadow="sm" padding="md">
            <Group position="apart" mb="sm">
              <Text weight={500}>{a.name}</Text>
              <Button
                size="xs"
                color="red"
                variant="subtle"
                onClick={() => onDelete(a._id)}
              >
                Delete
              </Button>
            </Group>
            <Text size="sm" color="dimmed">
              {a.genre}
            </Text>
            <Button component={Link} to={`/artists/${a._id}`} size="xs" mt="sm">
              View / Edit
            </Button>
          </Card>
        ))}
      </SimpleGrid>

      {loading && (
        <Center mt="md">
          <Loader />
        </Center>
      )}

      {!loading && hasMore && (
        <Button fullWidth mt="md" onClick={loadMore}>
          Load More
        </Button>
      )}

      {!hasMore && (
        <Text color="dimmed" align="center" mt="md">
          No more artists.
        </Text>
      )}
    </Container>
  );
}
