const Song = require("../models/song");
const Artist = require("../models/artist");
const asyncHandler = require("express-async-handler");
const { generatePaginationLinks } = require("../utils/")
const { body, validationResult } = require("express-validator");

// Validators for create vs update
const songValidator = () => [
  body("title").notEmpty().withMessage("Title is required").trim(),
  body("duration").isNumeric().withMessage("Duration must be a number"),
  body("releaseDate")
    .notEmpty()
    .withMessage("Release date is required")
    .isISO8601()
    .withMessage("Release date must be a valid date")
    .toDate(),
  body("artist")
    .notEmpty()
    .withMessage("Artist ID is required")
    .isMongoId()
    .withMessage("Artist ID must be valid"),
];

const updateSongValidator = () => [
  body("title")
    .optional()
    .notEmpty()
    .withMessage("Title cannot be empty")
    .trim(),
  body("duration")
    .optional()
    .isNumeric()
    .withMessage("Duration must be a number"),
  body("releaseDate")
    .optional()
    .isISO8601()
    .withMessage("Release date must be a valid date")
    .toDate(),
  body("artist").optional().isMongoId().withMessage("Artist ID must be valid"),
];

// GET /api/song
exports.list = asyncHandler(async (req, res) => {
  // Fetch all songs with artist name and playlists
  const rawSongs = await Song.find()
    .populate({ path: "artist", select: "name" })
    .populate("playlists")
    .sort({ title: 1 });

  // Dynamically attach each artist's songs (titles) with guard
  const songs = await Promise.all(
    rawSongs.map(async (song) => {
      const songObj = song.toObject();
      if (!songObj.artist || !songObj.artist._id) {
        // No artist populated, skip attaching songs
        return songObj;
      }
      const artistSongs = await Song.find({
        artist: songObj.artist._id,
      }).select("title");
      songObj.artist.songs = artistSongs;
      return songObj;
    })
  );

  res.status(200).json(songs);
});

// GET /api/song/:id
exports.detail = asyncHandler(async (req, res) => {
  const song = await Song.findById(req.params.id)
    .populate({ path: "artist", select: "name" })
    .populate("playlists");

  if (!song) {
    return res.status(404).json({ error: "Song not found" });
  }

  const songObj = song.toObject();
  if (songObj.artist && songObj.artist._id) {
    const artistSongs = await Song.find({ artist: songObj.artist._id }).select(
      "title"
    );
    songObj.artist.songs = artistSongs;
  }

  res.status(200).json(songObj);
});

// POST /api/song
exports.create = [
  songValidator(),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const song = new Song({
      title: req.body.title,
      duration: req.body.duration,
      releaseDate: req.body.releaseDate,
      artist: req.body.artist,
      playlists: req.body.playlists || [],
    });
    await song.save();

    // Re-query to populate artist name and playlists
    const saved = await Song.findById(song._id)
      .populate({ path: "artist", select: "name" })
      .populate("playlists");

    const result = saved.toObject();
    if (result.artist && result.artist._id) {
      const artistSongs = await Song.find({ artist: result.artist._id }).select(
        "title"
      );
      result.artist.songs = artistSongs;
    }

    res.status(201).json(result);
  }),
];

// PUT /api/song/:id
exports.update = [
  updateSongValidator(),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const song = await Song.findById(req.params.id);
    if (!song) {
      return res.status(404).json({ error: "Song not found" });
    }

    // Update only provided fields
    if (req.body.title !== undefined) song.title = req.body.title;
    if (req.body.duration !== undefined) song.duration = req.body.duration;
    if (req.body.releaseDate !== undefined)
      song.releaseDate = req.body.releaseDate;
    if (req.body.artist !== undefined) song.artist = req.body.artist;
    if (req.body.playlists) song.playlists = req.body.playlists;

    await song.save();

    // Re-query to populate artist name and playlists
    const updated = await Song.findById(song._id)
      .populate({ path: "artist", select: "name" })
      .populate("playlists");

    const result = updated.toObject();
    if (result.artist && result.artist._id) {
      const artistSongs = await Song.find({ artist: result.artist._id }).select(
        "title"
      );
      result.artist.songs = artistSongs;
    }

    res.status(200).json(result);
  }),
];

// DELETE /api/song/:id
exports.delete = asyncHandler(async (req, res) => {
  const song = await Song.findById(req.params.id);
  if (!song) {
    return res.status(404).json({ error: "Song not found" });
  }
  await Song.findByIdAndDelete(req.params.id);
  res.status(200).json({ message: "Song deleted" });
});
