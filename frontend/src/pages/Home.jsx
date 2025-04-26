import React from "react";
import { AppShell, Box, Container, Title, Text } from "@mantine/core";

function App() {
  return (
    <AppShell.Main>
      {/* full-width wrapper with optional background */}
      <Box style={{ width: "100vw", minHeight: "calc(100vh - 60px)" }}>
        <Container
          size="md"
          style={{ textAlign: "center", paddingTop: "4rem" }}
        >
          <Title order={2}>Welcome to Music Streaming</Title>
          <Text size="lg">
            Browse artists, songs, and manage your playlists!
          </Text>
        </Container>
      </Box>
    </AppShell.Main>
  );
}

export default App;
