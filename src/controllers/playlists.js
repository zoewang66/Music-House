const Playlist = require("../models/playlist");
const asyncHandler = require("express-async-handler");

const { body, query, validationResult } = require("express-validator");
const { generatePaginationLinks } = require("../utils/generatePaginationLinks");
const artist = require("../models/artist");

exports.list = asyncHandler(async (req, res) => {
  const playlists = await Playlist.find()
    .populate("songs")
    .populate("user")
    .sort({ name: 1 });
  res.json(playlists);
});

exports.detail = asyncHandler(async (req, res) => {
  const playlist = await Playlist.findById(req.params.id)
    .populate("songs")
    .populate("user");
  if (!playlist) {
    return res.status(404).json({ error: "Playlist not found" });
  }
  res.json(playlist);
});

exports.create = [
  body("name").notEmpty().withMessage("Playlist name is required"),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // The creator is the current user (set by your JWT authentication middleware)
    const playlist = new Playlist({
      name: req.body.name,
      description: req.body.description,
      songs: req.body.songs || [],
      user: req.user.id,
    });
    await playlist.save();
    res.status(201).json(playlist);
  }),
];

exports.delete = asyncHandler(async (req, res) => {
  const playlist = await Playlist.findById(req.params.id);
  if (!playlist) {
    return res.status(404).json({ error: "Playlist not found" });
  }
  // Only the creator is allowed to delete the playlist
  if (playlist.user.toString() !== req.user.id) {
    return res
      .status(403)
      .json({ error: "You are not authorized to delete this playlist" });
  }
  await Playlist.findByIdAndDelete(req.params.id);
  res.json({ message: "Playlist deleted" });
});

exports.update = [
  body("name")
    .optional()
    .notEmpty()
    .withMessage("Playlist name cannot be empty"),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const playlist = await Playlist.findById(req.params.id);
    if (!playlist) {
      return res.status(404).json({ error: "Playlist not found" });
    }
    // Check if the logged-in user is the creator of the playlist
    if (playlist.user.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ error: "You are not authorized to update this playlist" });
    }
    // Update the playlist fields
    playlist.name = req.body.name;
    playlist.description = req.body.description;
    if (req.body.songs) {
      playlist.songs = req.body.songs;
    }
    await playlist.save();
    res.json(playlist);
  }),
];
