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
import { useNavigate, Link } from "react-router-dom";
import PageContainer from "../components/PageContainer";
import { useForm } from "@mantine/form";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export default function Register() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const form = useForm({
    initialValues: {
      username: "",
      password: "",
    },
    validate: {
      username: (value) => {
        if (value.length < 5 || value.length > 20) {
          return "Username must be 5–20 characters";
        }
        if (!/^[A-Za-z0-9_]+$/.test(value)) {
          return "Only letters, numbers, and underscores allowed";
        }
        return null;
      },
      password: (value) => {
        // ≥8 chars, uppercase, lowercase, digit, special char
        const PASSWORD_REGEX =
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
        return PASSWORD_REGEX.test(value)
          ? null
          : "Password must be ≥8 chars with upper, lower, number & special char";
      },
    },
  });

  const handleRegister = async (event) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const validation = form.validate();
    if (validation.hasErrors) {
      setLoading(false);
      return;
    }

    const { username, password } = form.values;
    const url = `${API_BASE_URL}/auth/register`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Registration failed");
      }

      alert("Registration succeeded! Please log in.");
      navigate("/login");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer center={true}>
      <Center sx={{ width: "100%" }}>
        <Card
          withBorder
          shadow="lg"
          radius="md"
          p="xl"
          sx={{ minWidth: "650px", width: "100vw" }}
        >
          <Title order={2} align="center" mb="sm">
            Create Account
          </Title>
          <Text color="dimmed" size="sm" align="center" mb="lg">
            Create an account to join our community
          </Text>

          {error && (
            <Alert color="red" mb="md">
              {error}
            </Alert>
          )}

          <form onSubmit={handleRegister}>
            <TextInput
              label="Username"
              placeholder="Enter your username"
              {...form.getInputProps("username")}
              required
              mb="sm"
            />

            <PasswordInput
              label="Password"
              placeholder="Enter a strong password"
              {...form.getInputProps("password")}
              required
              mb="md"
            />

            <Button
              color="#346d67"
              type="submit"
              fullWidth
              loading={loading}
              disabled={loading}
            >
              Register
            </Button>
          </form>

          <Space h="lg" />

          <Text size="sm" align="center">
            Already have an account?{" "}
            <Anchor
              component={Link}
              to="/login"
              styles={{
                root: {
                  color: "#5DA399",
                },
              }}
            >
              Log in
            </Anchor>
          </Text>
        </Card>
      </Center>
    </PageContainer>
  );
}
