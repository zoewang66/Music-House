import React, { useState, useEffect } from "react";
import { SimpleGrid, Text, Button, Center } from "@mantine/core";
import { Link } from "react-router-dom";
import { fetchPlaylists, deletePlaylist } from "../../api/index";
import PageContainer from "../PageContainer";
import PlaylistCard from "./PlaylistCard";
import "../../css/Page.css";

export default function PlaylistsList({ mode }) {
  const [playlists, setPlaylists] = useState([]);

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

      setPlaylists((pls) => pls.filter((pl) => pl._id !== id));

      window.alert("Playlist deleted successfully");
    } catch (err) {
      console.error("Failed to delete playlist:", err);

      window.alert(
        err.response?.data?.error ||
          "Could not delete playlist. Please try again later."
      );
    }
  };

  return (
    <PageContainer center={true}>
      <Button component={Link} to="/playlists/create" id="add-btn">
        Add New Playlist
      </Button>

      {playlists.length === 0 ? (
        <Center>
          <Text className="pagination-text" mt="lg">
            You have no playlists yet.
          </Text>
        </Center>
      ) : (
        <SimpleGrid className="card-list">
          {playlists.map((pl) => (
            <PlaylistCard
              key={pl._id}
              pl={pl}
              onDelete={() => handleDelete(pl._id)}
            />
          ))}
        </SimpleGrid>
      )}
    </PageContainer>
  );
}
