require("dotenv").config();
const mongoose = require("mongoose");
const Artist = require("../src/models/artist");
const Song = require("../src/models/song");

async function seed() {
  // Connect to MongoDB
  const mongoDB =
    process.env.MONGODB_URI || "mongodb://localhost:27017/musicdb";
  await mongoose.connect(mongoDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("Connected to MongoDB for seeding");

  // Clear existing data (optional)
  await Artist.deleteMany({});
  await Song.deleteMany({});

  // Create 4 artists
  const artists = await Artist.insertMany([
    {
      name: "The Beatles",
      genre: "Rock",
      bio: "Legendary rock band from Liverpool.",
    },
    {
      name: "Adele",
      genre: "Pop",
      bio: "English singer-songwriter known for her soulful voice.",
    },
    { name: "Drake", genre: "Hip Hop", bio: "Canadian rapper and singer." },
    {
      name: "Coldplay",
      genre: "Alternative",
      bio: "British rock band formed in London.",
    },
  ]);
  console.log(
    "Seeded artists:",
    artists.map((a) => a.name)
  );

  // Create 10 songs for these artists
  const songs = await Song.insertMany([
    {
      title: "Hey Jude",
      duration: 431,
      releaseDate: new Date("1968-08-26"),
      artist: artists[0]._id,
    },
    {
      title: "Let It Be",
      duration: 243,
      releaseDate: new Date("1970-03-06"),
      artist: artists[0]._id,
    },
    {
      title: "Hello",
      duration: 295,
      releaseDate: new Date("2015-10-23"),
      artist: artists[1]._id,
    },
    {
      title: "Rolling in the Deep",
      duration: 228,
      releaseDate: new Date("2010-11-29"),
      artist: artists[1]._id,
    },
    {
      title: "Skyfall",
      duration: 286,
      releaseDate: new Date("2012-10-05"),
      artist: artists[1]._id,
    },
    {
      title: "God’s Plan",
      duration: 198,
      releaseDate: new Date("2018-01-19"),
      artist: artists[2]._id,
    },
    {
      title: "Hotline Bling",
      duration: 267,
      releaseDate: new Date("2015-07-31"),
      artist: artists[2]._id,
    },
    {
      title: "Yellow",
      duration: 269,
      releaseDate: new Date("2000-06-26"),
      artist: artists[3]._id,
    },
    {
      title: "Fix You",
      duration: 295,
      releaseDate: new Date("2005-09-05"),
      artist: artists[3]._id,
    },
    {
      title: "Viva La Vida",
      duration: 242,
      releaseDate: new Date("2008-05-25"),
      artist: artists[3]._id,
    },
  ]);
  console.log(
    "Seeded songs:",
    songs.map((s) => s.title)
  );

  // Update each artist's songs array to include only their own songs
  const songsByArtist = songs.reduce((map, song) => {
    const key = song.artist.toString();
    if (!map[key]) map[key] = [];
    map[key].push(song._id);
    return map;
  }, {});

  for (const [artistId, songIds] of Object.entries(songsByArtist)) {
    await Artist.findByIdAndUpdate(artistId, { $set: { songs: songIds } });
  }
  console.log("Updated artists with their songs arrays");

  // Disconnect
  await mongoose.disconnect();
  console.log("Seeding complete and MongoDB connection closed");
}

seed().catch((err) => {
  console.error("Error during seeding:", err);
  mongoose.disconnect();
});
