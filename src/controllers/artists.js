const Artist = require("../models/artist");
const asyncHandler = require("express-async-handler");

const { body, query, validationResult } = require("express-validator");
const { generatePaginationLinks } = require("../utils/generatePaginationLinks");

// Validator for creating/updating artists
const artistValidator = () => {
  return [
    body("name")
      .notEmpty()
      .withMessage("Name is required")
      .isString()
      .withMessage("Name must be a string"),
    body("genre")
      .notEmpty()
      .withMessage("Genre is required")
      .isString()
      .withMessage("Genre must be a string"),
    body("bio")
      .notEmpty()
      .withMessage("Bio introduction is required")
      .isString()
      .withMessage("Bio introduction must be a string"),
    body("songs")
      .isArray()
      .withMessage("Songs must be an array of IDs")
      .optional(),
    body("songs.*")
      .isMongoId()
      .withMessage("Each song ID must be a valid MongoDB ID")
      .optional(),
  ];
};

const updateArtistValidator = () => {
  return [
    body("name")
      .optional()
      .notEmpty()
      .withMessage("Name is required")
      .isString()
      .withMessage("Name must be a string"),
    body("genre")
      .optional()
      .notEmpty()
      .withMessage("Genre is required")
      .isString()
      .withMessage("Genre must be a string"),
    body("bio")
      .optional()
      .notEmpty()
      .withMessage("Bio introduction is required")
      .isString()
      .withMessage("Bio introduction must be a string"),
    body("songs")
      .optional()
      .isArray()
      .withMessage("Songs must be an array of IDs")
      .optional(),
    body("songs.*")
      .optional()
      .isMongoId()
      .withMessage("Each song ID must be a valid MongoDB ID")
      .optional(),
  ];
};

// GET /api/artist?name=&page=&limit=
exports.list = [
  query("name").optional().trim(),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const name = req.query.name || "";
    const filter = name ? { $text: { $search: name } } : {};
    const options = {
      page: req.paginate.page,
      limit: req.paginate.limit,
      sort: name ? { score: { $meta: "textScore" } } : { name: 1 },
      select: name ? { score: { $meta: "textScore" } } : {},
      populate: { path: "songs", select: "title" },
    };

    const artistPage = await Artist.paginate(filter, options);

    res
      .status(200)
      .links(
        generatePaginationLinks(
          req.originalUrl,
          artistPage.page,
          artistPage.totalPages,
          artistPage.limit
        )
      )
      .json(artistPage.docs);
  }),
];

// GET /api/artist/:id
exports.detail = asyncHandler(async (req, res, next) => {
  const artist = await Artist.findById(req.params.id)
    // NEW: populate songs array with song titles
    .populate({ path: "songs", select: "title" });
  if (!artist) {
    return res.status(404).json({ error: "Artist not found" });
  }
  res.status(200).json(artist);
});

// POST /api/artist
exports.create = [
  artistValidator(),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const artist = new Artist({
      name: req.body.name,
      genre: req.body.genre,
      bio: req.body.bio,
      songs: req.body.songs || [],
    });
    await artist.save();
    const populated = await Artist.findById(artist._id).populate({
      path: "songs",
      select: "title",
    });
    res.status(201).json(populated);
  }),
];

// PUT /api/artist/:id
exports.update = [
  updateArtistValidator(),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const artist = await Artist.findById(req.params.id);
    if (!artist) {
      return res.status(404).json({ error: "Artist not found" });
    }

    // Only update fields if provided
    if (req.body.name !== undefined) {
      artist.name = req.body.name;
    }
    if (req.body.genre !== undefined) {
      artist.genre = req.body.genre;
    }
    if (req.body.bio !== undefined) {
      artist.bio = req.body.bio;
    }
    if (req.body.songs !== undefined) {
      artist.songs = req.body.songs;
    }
    await artist.save();
    const populated = await Artist.findById(artist._id).populate({
      path: "songs",
      select: "title",
    });
    res.status(200).json(populated);
  }),
];

// DELETE /api/artist/:id
exports.delete = asyncHandler(async (req, res, next) => {
  const artist = await Artist.findById(req.params.id);
  if (!artist) {
    return res.status(404).json({ error: "Artist not found" });
  }
  await Artist.findByIdAndDelete(req.params.id);
  res.status(200).json({ message: "Artist deleted" });
});
