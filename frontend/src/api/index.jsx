// src/api/index.js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// auth
export const login = (u, p) =>
  api.post("/auth/login", { username: u, password: p });
export const register = (u, p) =>
  api.post("/auth/register", { username: u, password: p });

// artists
export const fetchArtists = (page, name) =>
  api.get("/artist", { params: { page, name } });
export const fetchArtistById = (id) => api.get(`/artist/${id}`);

// songs
export const fetchSongs = () => api.get("/song");
export const fetchSongById = (id) => api.get(`/song/${id}`);

// playlists
export const fetchPlaylists = () => api.get("/playlist");
export const fetchPlaylistById = (id) => api.get(`/playlist/${id}`);
export const createPlaylist = (data) => api.post("/playlist", data);
export const updatePlaylist = (id, d) => api.put(`/playlist/${id}`, d);
export const deletePlaylist = (id) => api.delete(`/playlist/${id}`); 

export default api;
