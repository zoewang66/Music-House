const Song = require("../models/song");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

const songValidator = () => {
  return [
    body("title").notEmpty().withMessage("Title is required").trim(),

    body("duration").isNumeric().withMessage("Duration must be a number"),

    body("releaseDate")
      .notEmpty()
      .withMessage("Release date is required")
      .isISO8601()
      .withMessage("Release date must be a valid date")
      .toDate(),

    body("artist").notEmpty().withMessage("Artist ID is required"),
  ];
};

// List all songs, sorted by title and with populated artist
exports.list = asyncHandler(async (req, res) => {
  const songs = await Song.find()
    .populate("artist")
    .populate("playlists")
    .sort({ title: 1 });
  res.status(200).json(songs);
});

// Get details of a specific song
exports.detail = asyncHandler(async (req, res) => {
  const song = await Song.findById(req.params.id)
    .populate("artist")
    .populate("playlists");
  if (!song) {
    return res.status(404).json({ error: "Song not found" });
  }
  res.status(200).json(song);
});

// Create a new song
exports.create = [
  // Validate and sanitize input
  songValidator(),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const song = new Song({
      title: req.body.title,
      duration: req.body.duration,
      releaseDate: req.body.releaseDate, // ensure your model field matches this name
      artist: req.body.artist,
      playlists: req.body.playlists || [],
    });
    await song.save();
    res.status(201).json(song);
  }),
];

// Update an existing song
exports.update = [
  songValidator(),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const song = await Song.findById(req.params.id);
    if (!song) {
      return res.status(404).json({ error: "Song not found" });
    }
    // Update fields if provided
    song.title = req.body.title || song.title;
    song.duration = req.body.duration || song.duration;
    song.releaseDate = req.body.releaseDate || song.releaseDate;
    song.artist = req.body.artist || song.artist;
    if (req.body.playlists) {
      song.playlists = req.body.playlists;
    }
    await song.save();
    res.status(200).json(song);
  }),
];

// Delete a song
exports.delete = asyncHandler(async (req, res) => {
  const song = await Song.findById(req.params.id);
  if (!song) {
    return res.status(404).json({ error: "Song not found" });
  }
  await Song.findByIdAndDelete(req.params.id);
  res.status(200).json({ message: "Song deleted" });
});
