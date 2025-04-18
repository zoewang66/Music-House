const express = require("express");

const AuthenticationRouter = require("./auth");
const ArtistRouter = require("./artist");
const SongRouter = require("./song");
const PlaylistRouter = require("./playlist");

const router = express.Router();

router.use("/auth", AuthenticationRouter);
router.use("/artist", ArtistRouter);
router.use("/song", SongRouter);
router.use("/playlist", PlaylistRouter);

module.exports = router;
