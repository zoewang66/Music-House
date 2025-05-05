import React from "react";
import { Card, Text, Button, useMantineTheme, Box } from "@mantine/core";
import { Link } from "react-router-dom";
import "../../css/Card.css";

/**
 * A fixed-size, hoverable card for displaying a song.
 */
export default function PlaylistCard({ pl, onDelete }) {
  const theme = useMantineTheme();
  return (
    <Card className="card">
      <div className="card-container">
        <div className="title-container">
          <Text className="title">{pl.name}</Text>
          <Text className="duration">Description: {pl.description}</Text>
        </div>

        <div className="card-btn-container">
          <Button
            className="v-btn"
            component={Link}
            to={`/playlists/${pl._id}`}
          >
            View / Edit
          </Button>
          
          <Button className="d-btn" onClick={onDelete}>
            Delete
          </Button>
        </div>
      </div>
    </Card>
  );
}
