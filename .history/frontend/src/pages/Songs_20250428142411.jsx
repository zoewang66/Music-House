import React, { useEffect, useState } from "react";
import { SimpleGrid, Card, Text } from "@mantine/core";
import { fetchSongs } from "../api/index";
import { Link } from "react-router-dom";
import PageContainer from "../components/PageContainer";

export default function Songs() {
  const [songs, setSongs] = useState([]);

  useEffect(() => {
    fetchSongs()
      .then((res) => setSongs(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <PageContainer center={true} >
      <SimpleGrid cols={3} spacing="md">
        {songs.map((song) => (
          <Card
            key={song._id}
            shadow="sm"
            padding="md"
            component={Link}
            to={`/songs/${song._id}`}
          >
            <Text weight={500}>{song.title}</Text>
            <Text size="sm">Duration: {song.duration} sec</Text>
          </Card>
        ))}
      </SimpleGrid>
    </PageContainer>
  );
}
