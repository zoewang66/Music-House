import React, { useEffect, useState } from "react";
import { Container, TextInput, SimpleGrid, Card, Text } from "@mantine/core";
import { fetchArtists } from "../api/index";
import { Link } from "react-router-dom";
import PageContainer from "../components/PageContainer";

export default function Artists() {
  const [artists, setArtists] = useState([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    fetchArtists(1, filter)
      .then((res) => setArtists(res.data))
      .catch((err) => console.error(err));
  }, [filter]);

  return (
    <>
    
      <TextInput
        placeholder="Search artists"
        value={filter}
        onChange={(e) => setFilter(e.currentTarget.value)}
        mt="md"
      />
      <SimpleGrid cols={3} spacing="md" mt="md">
        {artists.map((a) => (
          <Card
            key={a._id}
            shadow="sm"
            padding="md"
            component={Link}
            to={`/artists/${a._id}`}
          >
            <Text weight={500}>{a.name}</Text>
            <Text size="sm" color="dimmed">
              {a.genre}
            </Text>
          </Card>
        ))}
      </SimpleGrid>
    </>
  );
}
