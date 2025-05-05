const Playlist = require("../models/playlist");
const Song = require("../models/song");
const asyncHandler = require("express-async-handler");

const { body, query, validationResult } = require("express-validator");
const { generatePaginationLinks } = require("../utils/generatePaginationLinks");

const playlistValidator = () => [
  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .isString()
    .withMessage("Name must be a string"),
  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string"),
  body("songs")
    .optional()
    .isArray()
    .withMessage("Songs must be an array of IDs"),
  body("songs.*")
    .optional()
    .isMongoId()
    .withMessage("Each song ID must be valid"),
];

const updatePlaylistValidator = () => [
  body("name")
    .optional()
    .notEmpty()
    .withMessage("Name is required")
    .isString()
    .withMessage("Name must be a string"),
  body("description")
    .optional()
    .optional()
    .isString()
    .withMessage("Description must be a string"),
  body("songs")
    .optional()
    .optional()
    .isArray()
    .withMessage("Songs must be an array of IDs"),
  body("songs.*")
    .optional()
    .isMongoId()
    .withMessage("Each song ID must be valid"),
];

exports.list = asyncHandler(async (req, res) => {
  // optional: allow name filtering
  const filter = {};
  if (req.query.name) {
    filter.name = new RegExp(req.query.name, "i");
  }

  const playlists = await Playlist.find(filter)
    .sort({ name: 1 })
    .populate({ path: "songs", select: "title" })
    .populate({ path: "user", select: "username" });

  res.status(200).json(playlists);
});

exports.detail = asyncHandler(async (req, res) => {
  const playlist = await Playlist.findById(req.params.id)
    .populate({ path: "songs", select: "title" })
    .populate({ path: "user", select: "username" });
  if (!playlist) return res.status(404).json({ error: "Playlist not found" });
  res.status(200).json(playlist);
});

exports.create = [
  playlistValidator(),
  asyncHandler(async (req, res) => {
    // 🔍 DEBUG: log what we received and who’s making the request
    console.log("🛠 create playlist:", {
      user: req.user, // should be set by your JWT middleware
      body: req.body, // name, description, songs
    });
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const playlist = new Playlist({
      name: req.body.name,
      description: req.body.description,
      songs: req.body.songs || [],
      user: req.user.user_id,
    });
    await playlist.save();

    // Sync: add this playlist to each song's playlists array
    if (playlist.songs.length) {
      await Song.updateMany(
        { _id: { $in: playlist.songs } },
        { $addToSet: { playlists: playlist._id } }
      );
    }

    const populated = await Playlist.findById(playlist._id)
      .populate({ path: "songs", select: "title" })
      .populate({ path: "user", select: "username" });
    res.status(201).json(populated);
  }),
];

exports.update = [
  updatePlaylistValidator(),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const playlist = await Playlist.findById(req.params.id);
    if (!playlist) return res.status(404).json({ error: "Playlist not found" });

    if (playlist.user.toString() !== req.user.user_id && !req.user.is_admin) {
      return res.status(403).json({ error: "Not authorized" });
    }

    const oldSongs = playlist.songs.map((id) => id.toString());
    const newSongs = req.body.songs !== undefined ? req.body.songs : oldSongs;

    // Apply updates
    if (req.body.name !== undefined) playlist.name = req.body.name;
    if (req.body.description !== undefined)
      playlist.description = req.body.description;
    if (req.body.songs !== undefined) playlist.songs = req.body.songs;
    await playlist.save();

    // Sync: compute differences
    const toAdd = newSongs.filter((id) => !oldSongs.includes(id));
    const toRemove = oldSongs.filter((id) => !newSongs.includes(id));

    if (toAdd.length) {
      await Song.updateMany(
        { _id: { $in: toAdd } },
        { $addToSet: { playlists: playlist._id } }
      );
    }
    if (toRemove.length) {
      await Song.updateMany(
        { _id: { $in: toRemove } },
        { $pull: { playlists: playlist._id } }
      );
    }

    const populated = await Playlist.findById(playlist._id)
      .populate({ path: "songs", select: "title" })
      .populate({ path: "user", select: "username" });
    res.status(200).json(populated);
  }),
];

exports.delete = asyncHandler(async (req, res) => {
  const playlist = await Playlist.findById(req.params.id);
  if (!playlist) return res.status(404).json({ error: "Playlist not found" });

  // safely pull ownerId (or null if missing)
  const ownerId = playlist.user ? playlist.user.toString() : null;

  // only enforce ownership if we actually have an owner recorded
  if (ownerId && ownerId !== req.user.user_id && !req.user.is_admin) {
    return res.status(403).json({ error: "Not authorized" });
  }

  // Sync: remove playlist from all songs
  await Song.updateMany(
    { playlists: playlist._id },
    { $pull: { playlists: playlist._id } }
  );

  await Playlist.findByIdAndDelete(req.params.id);
  res.status(200).json({ message: "Playlist deleted" });
});
