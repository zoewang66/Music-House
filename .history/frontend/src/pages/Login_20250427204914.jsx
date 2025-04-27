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
    
  );
}
