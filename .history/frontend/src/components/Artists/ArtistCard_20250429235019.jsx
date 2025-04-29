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
  return (
    <Card className="card">
      <div className="card-container">
        {/* Title (clamped to 2 lines) */}
        <div className="title-container">
          <Text className="title">{artist.name}</Text>
          {/* Metadata */}
          <Text className="duration">Genre: {artist.genre}</Text>
        </div>

        <div className="card-btn-container">
          {/* View/Edit at bottom */}
          <Button className="v-btn">View / Edit</Button>
          {/* Delete button fixed at top-right */}
          <Button className="d-btn">Delete</Button>
        </div>
      </div>
    </Card>
  );
}
