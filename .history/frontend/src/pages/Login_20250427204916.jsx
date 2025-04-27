import React, { useState } from "react";
import { TextInput, PasswordInput, Button, Alert } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import PageContainer from "../components/PageContainer";

export default function Login() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(username, password);
      navigate("/songs"); // or wherever you want to land
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer center={true}>
      <div style={{ maxWidth: 400, margin: "auto" }}>
        <h2>Login</h2>
        {error && <Alert color="red">{error}</Alert>}
        <form onSubmit={handleLogin}>
          <TextInput
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.currentTarget.value)}
            required
          />
          <PasswordInput
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.currentTarget.value)}
            required
          />
          <Button
            type="submit"
            fullWidth
            mt="sm"
            loading={loading}
            disabled={loading}
          >
            Log In
          </Button>
        </form>
      </div>
    </PageContainer>
  );
}
