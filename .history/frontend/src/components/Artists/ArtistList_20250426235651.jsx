import React, { useState, useEffect } from "react";
import {
  SimpleGrid,
  Text,
  Button,
  Group,
  Loader,
  Center,
  Pagination,
} from "@mantine/core";
import { fetchArtists, deleteArtist } from "../../api/index";
import { Link } from "react-router-dom";
import PageContainer from "../PageContainer";
import ArtistCard from "./ArtistCard";

export default function ArtistsList() {
  // const [artists, setArtists] = useState([]);
  // const [page, setPage] = useState(1);
  // const [loading, setLoading] = useState(false);
  // const limit = 9;
  const [artists, setArtists] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasPrevPage, setHasPrevPage] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [loading, setLoading] = useState(false);
  const limit = 9;


  // load page p
  const loadPage = async (p) => {
    setLoading(true);
    try {
      // const res = await fetchArtists(p, "", limit);
      // setArtists(res.data);
      // setPage(p);
      const {
        docs,
        totalPages: tp,
        hasPrevPage: prev,
        hasNextPage: next,
        page: current,
      } = res.data;

      setArtists(docs);
      setTotalPages(tp);
      setHasPrevPage(prev);
      setHasNextPage(next);
      setPage(current);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // initial load
  useEffect(() => {
    loadPage(1);
  }, []);

  // const totalPages = Math.ceil(artists.length < limit ? page : page + 1);

  // simpler: disable Next if fetched artists < limit

  const onDelete = async (id) => {
    if (!window.confirm("Delete this artist?")) return;
    await deleteArtist(id);
    // reload current page
    loadPage(page);
  };

  return (
    <PageContainer center={true}>
      <Button component={Link} to="/songs/create" mb="md" color="#346d67">
        Add New Song
      </Button>
      {loading ? (
        <Center mt="md">
          <Loader />
        </Center>
      ) : (
        <>
          <SimpleGrid
            spacing="md"
            style={{
              gridTemplateColumns: "repeat(3, 300px)",
              justifyContent: "center",
            }}
          >
            {artists.map((a) => (
              <ArtistCard key={a._id} artist={a} onDelete={onDelete} />
            ))}
          </SimpleGrid>

          <Center>
            <Group spacing="md" mt="md">
              <Button
                color="#346d67"
                // disabled={page === 1}
                disabled={!hasPrevPage}
                onClick={() => loadPage(page - 1)}
              >
                Prev
              </Button>
              <Text>
                Page {page} of {totalPages}
              </Text>
              <Button
                color="#346d67"
                disabled={artists.length < limit}
                onClick={() => loadPage(page + 1)}
              >
                Next
              </Button>
            </Group>
          </Center>
        </>
      )}
    </PageContainer>
  );
}
