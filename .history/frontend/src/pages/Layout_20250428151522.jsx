import { useState } from "react";
import {
  AppShell,
  Flex,
  Container,
  Anchor,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

// Define your main navigation links
const links = [
  { link: "/", label: "Home" },
  { link: "/songs", label: "Songs" },
  { link: "/artists", label: "Artists" },
  { link: "/playlists", label: "Playlists" },
];

export default function Layout() {
  const [active, setActive] = useState(links[0].link);
  const { user, logout } = useAuth();
  const isAuthenticated = !!user;
  const theme = useMantineTheme();

  // Build menu items
  const items = links.map((item) => (
    <Anchor
      key={item.link}
      component={Link}
      to={item.link}
      // onClick={() => setActive(item.link)}
      onClick={() => setOpened(false)}
      styles={(theme) => ({
        root: {
          color:
            active === item.link ? theme.colors.teal[9] : theme.colors.gray[9],
          fontWeight: active === item.link ? 700 : 400,
          fontSize: "1.2rem",
          fontFamily: "Bellota",
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
      header={{ height: 60, padding: 0 }}
      padding="md"
      navbarOffsetBreakpoint="sm"
      styles={{
        header: {
          backgroundColor: "#D5CFE1",
        },
      }}
    >
      {/* Header */}
      <AppShell.Header>
        <Container size="lg" style={{ height: "100%" }}>
          {/* Full-height Flex for vertical centering, spaced for horizontal */}
          <Flex
            style={{ height: "100%" }}
            align="center"
            justify="space-between"
          >
            {/* Logo / Title */}
            <Text
              size="xl"
              weight={900}
              color={theme.colors.teal[9]}
              style={{
                fontFamily: "Bellota",
                fontSize: "1.5rem",
                fontWeight: 700,
              }}
            >
              Music House
            </Text>

            {/* Burger for mobile */}
            <Burger
              opened={opened}
              onClick={() => setOpened((o) => !o)}
              display={{ base: "block", md: "none" }}
            />

            {/* Desktop nav */}
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
                        fontFamily: "Bellota",
                        fontSize: "1.2rem",
                        fontWeight: 400,
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
                        fontFamily: "Bellota",
                        fontSize: "1.2rem",
                        fontWeight: 400,
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
                      fontFamily: "Bellota",
                      fontSize: "1.2rem",
                      fontWeight: 400,
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
      {/* Mobile drawer */}
      <Drawer
        opened={opened}
        onClose={() => setOpened(false)}
        padding="md"
        size="xs"
        display={{ base: "block", md: "none" }}
      >
        {items}
        {authLinks}
      </Drawer>

      {/* Main Content */}
      <AppShell.Main style={{ width: "100%", minHeight: "calc(100vh - 60px)" }}>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
