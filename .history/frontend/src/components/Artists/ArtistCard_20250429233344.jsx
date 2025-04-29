import React from "react";
import { Card, Text, Button, useMantineTheme, Box } from "@mantine/core";
import { Link } from "react-router-dom";
import "../../css/Card.css";

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
    <Card className="card">
      

      {/* Title (clamped to 2 lines) */}
      <Box mb="xs" sx={{ minHeight: theme.spacing.xl * 2 }}>
        <Text weight={900} size="lg" lineClamp={2}>
          {artist.name}
        </Text>
      </Box>

      {/* Metadata */}
      <Text className="duration">
        Genre: {artist.genre}
      </Text>

      <div className="card-btn-container">
      {/* View/Edit at bottom */}
      <Button className="v-btn">
        View / Edit
      </Button>
      {/* Delete button fixed at top-right */}
      <Button className="d-btn" >
        Delete
      </Button>
      </div>
    </Card>
  );
}
