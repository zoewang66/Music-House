const Artist = require("../models/artist");
const Song = require("../models/song");
const asyncHandler = require("express-async-handler");
const { body, query, validationResult } = require("express-validator");
const { generatePaginationLinks } = require("../utils/generatePaginationLinks");

// Validator for creating a new artist (all fields required)
const artistValidator = () => [
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
    .withMessage("Bio is required")
    .isString()
    .withMessage("Bio must be a string"),
];

// Validator for updating an artist (fields optional)
const updateArtistValidator = () => [
  body("name")
    .optional()
    .notEmpty()
    .withMessage("Name cannot be empty")
    .isString()
    .withMessage("Name must be a string"),
  body("genre")
    .optional()
    .notEmpty()
    .withMessage("Genre cannot be empty")
    .isString()
    .withMessage("Genre must be a string"),
  body("bio")
    .optional()
    .notEmpty()
    .withMessage("Bio cannot be empty")
    .isString()
    .withMessage("Bio must be a string"),
];

// GET /api/artist?name=&page=&limit=
exports.list = [
  query("name").optional().trim(),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const nameFilter = req.query.name || "";
    const filter = nameFilter ? { $text: { $search: nameFilter } } : {};
    const options = {
      page: req.paginate.page,
      limit: req.paginate.limit,
      sort: nameFilter ? { score: { $meta: "textScore" } } : { name: 1 },
      select: nameFilter ? { score: { $meta: "textScore" } } : {},
    };

    // Get paginated artists
    const artistPage = await Artist.paginate(filter, options);

    // For each artist, fetch their songs separately
    const docsWithSongs = await Promise.all(
      artistPage.docs.map(async (art) => {
        const songs = await Song.find({ artist: art._id }).select("title");
        return { ...art.toObject(), songs };
      })
    );

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
      // .json(docsWithSongs);
      .json({
        docs: docsWithSongs,
        totalDocs: artistPage.totalDocs,
        limit: artistPage.limit,
        page: artistPage.page,
        totalPages: artistPage.totalPages,
        hasPrevPage: artistPage.hasPrevPage,
        hasNextPage: artistPage.hasNextPage,
        prevPage: artistPage.prevPage,
        nextPage: artistPage.nextPage,
        pagingCounter: artistPage.pagingCounter,
        isFirstPage: artistPage.isFirstPage,
        isLastPage: artistPage.isLastPage,
  }),
];

// GET /api/artist/:id
exports.detail = asyncHandler(async (req, res) => {
  const artist = await Artist.findById(req.params.id);
  if (!artist) return res.status(404).json({ error: "Artist not found" });

  // Fetch songs belonging to this artist
  const songs = await Song.find({ artist: artist._id }).select("title");
  res.status(200).json({ ...artist.toObject(), songs });
});

// POST /api/artist
exports.create = [
  artistValidator(),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const artist = new Artist({
      name: req.body.name,
      genre: req.body.genre,
      bio: req.body.bio,
    });
    await artist.save();

    // Newly created artist has no songs yet
    res.status(201).json({ ...artist.toObject(), songs: [] });
  }),
];

// PUT /api/artist/:id
exports.update = [
  updateArtistValidator(),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const artist = await Artist.findById(req.params.id);
    if (!artist) return res.status(404).json({ error: "Artist not found" });

    if (req.body.name !== undefined) artist.name = req.body.name;
    if (req.body.genre !== undefined) artist.genre = req.body.genre;
    if (req.body.bio !== undefined) artist.bio = req.body.bio;
    await artist.save();

    // Fetch updated songs list
    const songs = await Song.find({ artist: artist._id }).select("title");
    res.status(200).json({ ...artist.toObject(), songs });
  }),
];

// DELETE /api/artist/:id
exports.delete = asyncHandler(async (req, res) => {
  const artist = await Artist.findByIdAndDelete(req.params.id);
  if (!artist) return res.status(404).json({ error: "Artist not found" });
  res.status(200).json({ message: "Artist deleted" });
});
