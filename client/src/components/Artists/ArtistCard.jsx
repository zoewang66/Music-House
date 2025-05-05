import React from "react";
import { Card, Text, Button, useMantineTheme, Box } from "@mantine/core";
import { Link } from "react-router-dom";
import "../../css/Card.css";

export default function ArtistCard({
  artist,
  onDelete,
}) {
  return (
    <Card className="card">
      <div className="card-container">
        <div className="title-container">
          <Text className="title">{artist.name}</Text>
          <Text className="duration">Genre: {artist.genre}</Text>
        </div>

        <div className="card-btn-container">
          <Button
            className="v-btn"
            component={Link}
            to={`/artists/${artist._id}`}
          >
            View / Edit
          </Button>
          <Button className="d-btn" onClick={() => onDelete(artist._id)}>Delete</Button>
        </div>
      </div>
    </Card>
  );
}
