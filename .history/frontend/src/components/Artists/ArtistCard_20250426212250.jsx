import React from "react";
import { Card, Text, Button, useMantineTheme, Box } from "@mantine/core";
import { Link } from "react-router-dom";

/**
 * A fixed-size, hoverable card for displaying a song.
 */
export default function ArtistCard({
  artist,
  onDelete,
  width = 300,
  height = 380,
}) {
  const theme = useMantineTheme();
  return (
    <Card
      style={{ backgroundColor: "white" }}
      radius="md"
      shadow="md"
      p="md"
      sx={{
        position: "relative",
        width,
        height,
        display: "flex",
        flexDirection: "column",
        transition: "transform 150ms ease, box-shadow 150ms ease",
        "&:hover": {
          transform: "scale(1.03)",
          boxShadow: theme.shadows.lg,
        },
      }}
    >
      {/* Delete button fixed at top-right */}
      <Button
        size="sm"
        color="#AF1B3F"
        variant="light"
        mb="md"
        onClick={() => onDelete(artist._id)}
        sx={{
          position: "absolute",
          top: theme.spacing.sm,
          right: theme.spacing.sm,
        }}
      >
        Delete
      </Button>

      {/* Title (clamped to 2 lines) */}
      <Box mb="xs" sx={{ minHeight: theme.spacing.xl * 2 }}>
        <Text weight={900} size="lg" lineClamp={2}>
          {artist.name}
        </Text>
      </Box>

      {/* Metadata */}
      <Text color="dimmed" size="md" mb="auto">
        Genre: {artist.genre}
      </Text>

      {/* View/Edit at bottom */}
      <Button
        component={Link}
        to={`/artists/${artist._id}`}
        variant="outline"
        color="#346d67"
        size="sm"
        fullWidth
        mt="md"
      >
        View / Edit
      </Button>
    </Card>
  );
}
