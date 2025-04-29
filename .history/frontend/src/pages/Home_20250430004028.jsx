// src/pages/Home.jsx
import React from "react";
import {
  Container,
  Title,
  Text,
  Group,
  Button,
  Center,
  useMantineTheme,
} from "@mantine/core";
import { Link } from "react-router-dom";
import { Carousel } from "@mantine/carousel";
import PageContainer from "../components/PageContainer";
import slide1 from "../../src/images/picture3.png";
import slide2 from "../../src/images/picture2.png";
import slide3 from "../../src/images/picture1.png";
import "../css/Home.css";

export default function Home() {
  const theme = useMantineTheme();
  const slides = [
    { src: slide1, caption: "Discover New Tracks" },
    { src: slide2, caption: "Your Favorite Artists" },
    { src: slide3, caption: "Build Custom Playlists" },
  ];

  return (
    <PageContainer center={true}>
      <Container>
        <h1 className="home-title">Welcome to Music House</h1>
        <p className="description">
          Browse songs, explore artists, and manage your personalized playlists
          all in one place.
        </Text>

        <Carousel
          withIndicators
          height={550}
          slideSize="100%"
          slideGap="md"
          align="start"
          loop
        >
          {slides.map((slide, idx) => (
            <Carousel.Slide key={idx}>
              <div className="slide">
                <img src={slide.src} alt={slide.caption} />
              </div>
            </Carousel.Slide>
          ))}
        </Carousel>

        <Center>
          <Group className="btn-group">
            <Link to="/songs" style={{ textDecoration: "none" }}>
              <Button className="s-btn">Browse Songs</Button>
            </Link>
            <Link to="/artists" style={{ textDecoration: "none" }}>
              <Button className="a-btn">Explore Artists</Button>
            </Link>

            <Link to="/playlists" style={{ textDecoration: "none" }}>
              <Button className="p-btn">Your Playlists</Button>
            </Link>
          </Group>
        </Center>
      </Container>
    </PageContainer>
  );
}
