import React from "react";
import { Container, Title, Text } from "@mantine/core";

function App() {
  return (
    <Container>
      <Title order={2} mt="md">
        Welcome to Music Streaming
      </Title>
      <Text mt="sm">Browse artists, songs, and manage your playlists!</Text>
    </Container>
  );
}

export default App;
