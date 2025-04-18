const Artist = require("../models/artist");
const asyncHandler = require("express-async-handler");

const { body, query, validationResult } = require("express-validator");
const { generatePaginationLinks } = require("../utils/generatePaginationLinks");
const artist = require("../models/artist");

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
      .withMessage("Bio introduction must be a string"),

    body("songs")
      .notEmpty()
      .withMessage("Song is required")
      .withMessage("Songs must be a string"),
  ];
};

exports.list = [
  query("name").optional().trim(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const name = req.query.name || "";

    const artistPage = await Artist.find(
      { $text: { $search: name } },
      { score: { $meta: "textScore" } }
    )
      .sort({ score: { $meta: "textScore" } })
      .paginate({ ...req.paginate });

    res
      .status(200)
      .links(
        generatePaginationLinks(
          req.originalUrl,
          req.paginate.page,
          artistPage.totalPages,
          req.paginate.limit
        )
      )
      .json(artistPage.docs);

    next();
  }),
];

exports.detail = asyncHandler(async (req, res, next) => {
  const artist = await Artist.findById(req.params.id).exec();

  if (artist === null) {
    res.status(204).json({ error: "Artist not found" });
  }

  res.json(artist);
});

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
      songs: req.body.songs,
    });
    await artist.save();
    res.status(201).json(artist);

    next();
  }),
];

exports.delete = asyncHandler(async (req, res, next) => {
  const artist = await Artist.findById(req.params.id).exec();

  if (artist == null) {
    return res.status(204).json({ error: "Artist not found" });
  }

  await Artist.findByIdAndDelete(req.params.id);
  res.status(200);

  next();
});

exports.update = [
  artistValidator(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Check if the artist exists
    const artist = await Artist.findOne({ _id: req.params.id });
    if (artist == null) {
      return res.status(204).json({ error: "Artist not found" });
    }

    const newArtist = new Artist({
      name: req.body.name,
      genre: req.body.genre,
      bio: req.body.bio,
      songs: req.body.songs,
    });

    const updatedArtist = await Artist.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          name: req.body.name,
          genre: req.body.genre,
          bio: req.body.bio,
          songs: req.body.songs,
        },
      },
      { new: true, runValidators: true } // `new: true` returns the updated document
    );
    res.status(200).json(updatedArtist);

    next();
  }),
];
