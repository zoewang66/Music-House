import React from "react";
import { Card, Text, Button, useMantineTheme, Box } from "@mantine/core";
import { Link } from "react-router-dom";
import "../../css/Card.css";

export default function SongCard({ song, onDelete }) {
  return (
    <Card className="card">
      <div className="card-container">
        <div className="title-container">
          <Text className="title">{song.title}</Text>
          <Text className="duration">Duration: {song.duration} sec</Text>
        </div>

        <div className="card-btn-container">
          <Button className="v-btn" component={Link} to={`/songs/${song._id}`}>
            View / Edit
          </Button>
          <Button className="d-btn" onClick={() => onDelete(song._id)}>
            Delete
          </Button>
        </div>
      </div>
    </Card>
  );
}
