// import { useState } from "react";
// import { TextInput, PasswordInput, Button, Alert } from "@mantine/core";
// import { useForm } from "@mantine/form";
// import { useNavigate } from "react-router-dom";
// import PageContainer from "../components/PageContainer";

// const API_BASE_URL = import.meta.env.VITE_API_URL;

// const Register = () => {
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   // Initialize the form using Mantine's useForm hook
//   const form = useForm({
//     initialValues: {
//       username: "",
//       password: "",
//     },
//     validate: {
//       username: (value) => (value.length === 0 ? "Username is required" : null),
//       password: (value) =>
//         value.length < 3 ? "Password must be at least 6 characters" : null,
//     },
//   });

//   const handleRegister = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);

//     // Validate the form before sending the request
//     const { username, password } = form.values;

//     if (form.validate()) {
//       // ← Build the URL once
//       const url = `${API_BASE_URL}/auth/register`;
//       // ← Log it before you call fetch
//       console.log("📡 Register POST to:", url);
//       try {
//         const response = await fetch(url, {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ username, password }),
//         });

//         if (!response.ok) {
//           const data = await response.json();
//           throw new Error(data.error || "Registration failed");
//         }

//         // Redirect to the login page after successful registration
//         navigate("/login");
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     } else {
//       setLoading(false);
//     }
//   };

//   return (
//     <PageContainer center={true}>
//       <div style={{ maxWidth: 400, margin: "auto" }}>
//         <h2>Register</h2>
//         {error && <Alert color="red">{error}</Alert>}
//         <form onSubmit={handleRegister}>
//           <TextInput
//             label="Username"
//             {...form.getInputProps("username")}
//             required
//             error={form.errors.username}
//           />
//           <PasswordInput
//             label="Password"
//             {...form.getInputProps("password")}
//             required
//             error={form.errors.password}
//           />
//           <Button
//             type="submit"
//             fullWidth
//             mt="sm"
//             loading={loading}
//             disabled={loading}
//           >
//             Register
//           </Button>
//         </form>
//       </div>
//     </PageContainer>
//   );
// };

// export default Register;

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
      username: (value) => (value ? null : "Username is required"),
      password: (value) =>
        value.length >= 6 ? null : "Password must be at least 6 characters",
    },
  });

  const handleRegister = async (event) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    if (!form.validate()) {
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

      navigate("/login");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer center={}>
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
