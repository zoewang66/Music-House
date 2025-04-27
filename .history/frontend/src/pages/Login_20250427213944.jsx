import React, { useState } from "react";
import {
  Card,
  Title,
  Text,
  Anchor,
  TextInput,
  PasswordInput,
  Button,
  Alert,
  Center,
  Space,
} from "@mantine/core";
import { Link } from "react-router-dom";
import PageContainer from "../components/PageContainer";
import { useAuth } from "../contexts/AuthContext";

export default function Login() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(username, password);
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer center>
      <Center sx={{ width: "100%" }}>
        <Card
          withBorder
          shadow="lg"
          radius="md"
          p="xl"
          sx={{
            minWidth: "650px",
            width: "80vw",
            maxWidth: "900px",
          }}
        >
          <Title order={2} align="center" mb="sm">
            Welcome Back
          </Title>
          <Text color="dimmed" size="sm" align="center" mb="lg">
            Please log in to continue
          </Text>

          {error && (
            <Alert color="red" mb="md">
              {error}
            </Alert>
          )}

          <form onSubmit={handleLogin}>
            <TextInput
              label="Username"
              placeholder="your username"
              value={username}
              onChange={(e) => setUsername(e.currentTarget.value)}
              required
              mb="sm"
            />

            <PasswordInput
              label="Password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.currentTarget.value)}
              required
              mb="md"
            />

            <Button
              type="submit"
              fullWidth
              loading={loading}
              disabled={loading}
            >
              Log In
            </Button>
          </form>

          <Space h="md" />

          <Text size="sm" align="center">
            Don’t have an account?{" "}
            <Anchor component={Link} to="/register">
              Register here
            </Anchor>
          </Text>
        </Card>
      </Center>
    </PageContainer>
  );
}
