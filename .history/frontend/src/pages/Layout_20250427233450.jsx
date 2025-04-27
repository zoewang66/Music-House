import { useState } from "react";
import {
  AppShell,
  Flex,
  Container,
  Anchor,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { Link, Outlet, useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const isAuthenticated = !!user;
  const theme = useMantineTheme();

  // Build menu items
  const items = links.map((item) => (
    <Anchor
      key={item.link}
      component={Link}
      to={item.link}
      onClick={() => setActive(item.link)}
      color={active === item.link ? "blue" : "gray"}
      sx={{ fontWeight: active === item.link ? 600 : 400 }}
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
        // target the header slot
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
            <Text size="xl" weight={900} color={theme.colors.teal[9]}>
              Music House
            </Text>

            {/* Nav items + auth links */}
            <Flex align="center" gap="md" color={theme.colors.teal[9]}>
              {items}

              {!isAuthenticated ? (
                <>
                  <Anchor component={Link} to="/login" color="blue">
                    Login
                  </Anchor>
                  <Anchor component={Link} to="/register" color="blue">
                    Register
                  </Anchor>
                </>
              ) : (
                <Anchor component="button" onClick={logout} color={theme.colors.teal[9]}>
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
