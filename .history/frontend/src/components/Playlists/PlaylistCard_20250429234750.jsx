import React from "react";
import { Card, Text, Button, useMantineTheme, Box } from "@mantine/core";
import { Link } from "react-router-dom";
import "../../css/Card.css";

/**
 * A fixed-size, hoverable card for displaying a song.
 */
export default function PlaylistCard({
  pl,
  onDelete,
  width = 300,
  height = 380,
}) {
  const theme = useMantineTheme();
  return (
    <Card className="card">
      <div className="card-container">
      {/* Delete button fixed at top-right */}
      <Button >
        Delete
      </Button>

      {/* Title (clamped to 2 lines) */}
      <Box mb="xs" sx={{ minHeight: theme.spacing.xl * 2 }}>
        <Text weight={900} size="lg" lineClamp={2}>
          {pl.name}
        </Text>
      </Box>

      {/* Metadata */}
      <Text color="dimmed" size="md" mb="auto">
        Description: {pl.description}
      </Text>

      {/* View/Edit at bottom */}
      <Button
        component={Link}
        to={`/playlists/${pl._id}`}
        variant="outline"
        color="#346d67"
        size="sm"
        fullWidth
        mt="md"
      >
        View / Edit
      </Button>
</div>
    </Card>
  );
}
