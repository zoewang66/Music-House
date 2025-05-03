import React from "react";
import { Card, Text, Button, useMantineTheme, Box } from "@mantine/core";
import { Link } from "react-router-dom";
import "../../css/Card.css";

/**
 * A fixed-size, hoverable card for displaying a song.
 */
export default function SongCard({ song, onDelete }) {
  return (
    <Card className="card">
      <div className="card-container">
        {/* Title (clamped to 2 lines) */}
        <div className="title-container">
          <Text className="title">{song.title}</Text>
          {/* Metadata */}
          <Text className="duration">Duration: {song.duration} sec</Text>
        </div>

        <div className="card-btn-container">
          {/* View/Edit at bottom */}
          <Button className="v-btn" component={Link} to={`/songs/${song._id}`}>
            View / Edit
          </Button>
          {/* Delete button fixed at top-right */}
          <Button className="d-btn" onClick={() => onDelete(song._id)}>
            Delete
          </Button>
        </div>
      </div>
    </Card>
  );
}
