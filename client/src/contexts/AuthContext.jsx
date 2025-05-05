import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api, { login as apiLogin, register as apiRegister } from "../api/index";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("token"));

  useEffect(() => {
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUser({ user_id: payload.user_id, is_admin: payload.is_admin });
    }
  }, [token]);

  const login = async (username, password) => {
    const res = await apiLogin(username, password);
    const jwt = res.data.token;
    localStorage.setItem("token", jwt);
    api.defaults.headers.common["Authorization"] = `Bearer ${jwt}`;
    setToken(jwt);
    const payload = JSON.parse(atob(jwt.split(".")[1]));
    setUser({ user_id: payload.user_id, is_admin: payload.is_admin });
    navigate("/", { replace: true });
  };

  const register = async (username, password) => {
    await apiRegister(username, password);
    navigate("/login", { replace: true });
  };

  const logout = () => {
    localStorage.removeItem("token");
    delete api.defaults.headers.common["Authorization"];
    setUser(null);
    setToken(null);
    navigate("/login", { replace: true });
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
