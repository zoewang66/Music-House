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
export const fetchArtists = (page = 1, name = "", limit = 100) =>
  api.get("/artist", { params: { page, name, limit } });
export const fetchArtistById = (id) => api.get(`/artist/${id}`);
export const createArtist = (data) => api.post("/artist", data);
export const updateArtist = (id, d) => api.put(`/artist/${id}`, d);
export const deleteArtist = (id) => api.delete(`/artist/${id}`);

// songs
export function fetchSongs(page = 1, opts = {}) {
  return axios.get('/api/song', { params: { page, ...opts } });
}

export const fetchSongById = (id) => api.get(`/song/${id}`);
export const createSong = (data) => api.post("/song", data);
export const updateSong = (id, d) => api.put(`/song/${id}`, d);
export const deleteSong = (id) => api.delete(`/song/${id}`);

// playlists
export const fetchPlaylists = () => api.get("/playlist");
export const fetchPlaylistById = (id) => api.get(`/playlist/${id}`);
export const createPlaylist = (data) => api.post("/playlist", data);
export const updatePlaylist = (id, d) => api.put(`/playlist/${id}`, d);
export const deletePlaylist = (id) => api.delete(`/playlist/${id}`);

export default api;
