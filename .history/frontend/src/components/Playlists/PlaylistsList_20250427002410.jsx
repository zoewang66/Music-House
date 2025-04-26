import React, { useState, useEffect } from "react";
import { SimpleGrid, Card, Text, Button, Group, Center } from "@mantine/core";
import { Link } from "react-router-dom";
import { fetchPlaylists, deletePlaylist } from "../../api/index";
import PageContainer from "../PageContainer";
import PlaylistCard from "./PlaylistCard";
import { fetchPlaylists, deletePlaylist } from "../../api/index";

export default function PlaylistsList() {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPlaylists()
      .then((res) => {
        console.log("fetched playlists:", res.data);
        setPlaylists(res.data);
      })
      .catch((err) => {
        console.error("Error fetching playlists:", err);
      });
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this playlist?")) {
      return;
    }
    try {
      await deletePlaylist(id);
      // remove it from local state so the UI updates
      setPlaylists((pls) => pls.filter((pl) => pl._id !== id));
    } catch (err) {
      console.error("Failed to delete playlist:", err);
      alert(
        err.response?.data?.error ||
          "Could not delete playlist. Try again later."
      );
    }
  };

  return (
    <PageContainer center={playlists.length === 0}>
      <Button component={Link} to="/playlists/create" mb="xl">
        + New Playlist
      </Button>

      {playlists.length === 0 ? (
        <Text color="dimmed">You have no playlists yet.</Text>
      ) : (
        <SimpleGrid
          spacing="md"
          style={{
            gridTemplateColumns: "repeat(3, 300px)",
            justifyContent: "center",
          }}
        >
          {playlists.map((pl) => (
            <PlaylistCard key={pl._id} pl={pl} onDelete={handleDelete} />
          ))}
        </SimpleGrid>
      )}
    </PageContainer>
  );
}
