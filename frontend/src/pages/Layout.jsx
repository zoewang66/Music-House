import React from "react";
import { AppShell, Container, Group, Anchor, Text } from "@mantine/core";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const links = [
  { link: "/", label: "Home" },
  { link: "/songs", label: "Songs" },
  { link: "/artists", label: "Artists" },
  { link: "/playlists", label: "Playlists" },
];

function Layout() {
  const { user, logout } = useAuth();
  const [active, setActive] = React.useState(window.location.pathname);
  const isAuthenticated = Boolean(user);

  // Dynamically create menu items based on authentication status
  const items = links.map((link) => (
    <Anchor
      key={link.label}
      component={Link}
      to={link.link}
      onClick={() => setActive(link.link)}
      style={{ marginRight: "15px" }}
      color={active === link.link ? "blue" : "gray"}
    >
      {link.label}
    </Anchor>
  ));

  return (
    <AppShell
      header={{ height: 50, padding: "md" }}
      padding="md"
      navbarOffsetBreakpoint="sm"
    >
      {/* Header */}
      <AppShell.Header>
        <Container size="md">
          <Group position="apart">
            <Text size="xl" weight={500}>
              Task Manager
            </Text>
            <Group spacing="xs" align="center">
              {items}
              {/* Conditionally render login, register, or logout links */}
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
                <Anchor component="button" onClick={logout}>
                  Logout
                </Anchor>
              )}
            </Group>
          </Group>
        </Container>
      </AppShell.Header>

      {/* Main Content (Where React Router Renders Pages) */}
      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}

export default Layout;
