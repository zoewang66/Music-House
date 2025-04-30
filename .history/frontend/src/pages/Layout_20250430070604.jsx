import { useState } from "react";
import {
  AppShell,
  Flex,
  Container,
  Anchor,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

// Define your main navigation links
const links = [
  { link: "/", label: "Home" },
  { link: "/songs", label: "Songs" },
  { link: "/artists", label: "Artists" },
  { link: "/playlists", label: "Playlists" },
];

export default function Layout() {
  const location = useLocation();
  const active = location.pathname;
  const theme = useMantineTheme();
  const { user, logout } = useAuth();
  const isAuthenticated = !!user;
  // Build menu items
  const items = links.map((item) => (
    <Anchor
      key={item.link}
      component={Link}
      to={item.link}
      onClick={() => setActive(item.link)}
      styles={(theme) => ({
        root: {
          color:
            active === item.link
              ? theme.colors.teal[9] // active link color
              : theme.colors.gray[9], // default link color
          fontWeight: active === item.link ? 500 : 400,
          textDecoration: "none",
          padding: "0.25rem 0.5rem",
          borderRadius: theme.radius.sm,
        },
      })}
    >
      {item.label}
    </Anchor>
  ));

  return (
    <AppShell
      padding="md"
      navbarOffsetBreakpoint="sm"
      styles={{
        // target the header slot
        header: {
          backgroundColor: "#D5CFE1",
        },
      }}
    >
      {/* Header */}
      <AppShell.Header height={60} p="xs">
        <Container size="lg" style={{ height: "100%" }}>
          {/* Full-height Flex for vertical centering, spaced for horizontal */}
          <Flex
            style={{ height: "100%" }}
            align="center"
            justify="space-between"
          >
            {/* Logo / Title */}
            <Text size="xl" weight={900} color={theme.colors.teal[9]}>
              Music House
            </Text>

            {/* Nav items + auth links */}
            <Flex align="center" gap="md">
              {items}

              {!isAuthenticated ? (
                <>
                  <Anchor
                    component={Link}
                    to="/login"
                    styles={{
                      root: {
                        color: theme.colors.yellow[8],
                        textDecoration: "none",
                      },
                    }}
                  >
                    Login
                  </Anchor>
                  <Anchor
                    component={Link}
                    to="/register"
                    styles={{
                      root: {
                        color: theme.colors.yellow[8],
                        textDecoration: "none",
                      },
                    }}
                  >
                    Register
                  </Anchor>
                </>
              ) : (
                <Anchor
                  component="button"
                  onClick={logout}
                  styles={{
                    root: {
                      color: theme.colors.yellow[8],
                      textDecoration: "none",
                    },
                  }}
                >
                  Logout
                </Anchor>
              )}
            </Flex>
          </Flex>
        </Container>
      </AppShell.Header>

      {/* Main Content */}
      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
