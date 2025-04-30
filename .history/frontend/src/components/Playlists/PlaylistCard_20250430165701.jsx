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
        {/* Title (clamped to 2 lines) */}
        <div className="title-container">
          <Text className="title">{pl.name}</Text>
          {/* Metadata */}
          <Text className="duration">Description: {pl.description}</Text>
        </div>

        <div className="card-btn-container">
          {/* View/Edit at bottom */}
          <Button
            className="v-btn"
            component={Link}
            to={`/playlists/${pl._id}`}
          >
            View / Edit
          </Button>
          {/* Delete button fixed at top-right */}
          <Button className="d-btn" onClick={() => onDelete(pl._id)}>
            Delete
          </Button>
        </div>
      </div>mantine-zv9bbah9h-label
    </Card>
  );
}
