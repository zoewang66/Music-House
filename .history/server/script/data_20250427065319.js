require("dotenv").config();
const mongoose = require("mongoose");
const Artist = require("../src/models/artist");
const Song = require("../src/models/song");

async function seed() {
  // 1) Connect
  const mongoDB =
    process.env.MONGODB_URI || "mongodb://localhost:27017/musicdb";
  await mongoose.connect(mongoDB);
  console.log("✅ Connected to MongoDB for seeding");

  // 2) Clear existing
  await Artist.deleteMany({});
  await Song.deleteMany({});
  console.log("🗑️  Cleared existing artists & songs");

  // 3) Real artists list
  const artistsData = [
    {
      name: "The Beatles",
      genre: "Rock",
      bio: "Legendary rock band from Liverpool.",
    },
    {
      name: "Adele",
      genre: "Pop/Soul",
      bio: "English singer-songwriter known for soul-stirring ballads.",
    },
    { name: "Drake", genre: "Hip Hop", bio: "Canadian rapper and singer." },
    {
      name: "Coldplay",
      genre: "Alternative",
      bio: "British rock band with melodic anthems.",
    },
    {
      name: "Queen",
      genre: "Rock",
      bio: "Iconic British rock band fronted by Freddie Mercury.",
    },
    {
      name: "Michael Jackson",
      genre: "Pop",
      bio: "King of Pop, one of the best-selling music artists.",
    },
    {
      name: "Madonna",
      genre: "Pop",
      bio: "Queen of Pop, known for reinventing her music and image.",
    },
    {
      name: "Prince",
      genre: "Funk",
      bio: "Innovative musician blending funk, rock, and pop.",
    },
    {
      name: "Elvis Presley",
      genre: "Rock & Roll",
      bio: "The King of Rock and Roll.",
    },
    {
      name: "Whitney Houston",
      genre: "R&B",
      bio: "Powerhouse vocalist with chart-topping hits.",
    },
    {
      name: "Mariah Carey",
      genre: "Pop/R&B",
      bio: "Known for her five-octave vocal range.",
    },
    {
      name: "Elton John",
      genre: "Pop/Rock",
      bio: "Singer-songwriter and pianist with enduring career.",
    },
    { name: "U2", genre: "Rock", bio: "Irish rock band led by Bono." },
    {
      name: "Taylor Swift",
      genre: "Pop/Country",
      bio: "Singer-songwriter crossing genres from country to pop.",
    },
    {
      name: "Ed Sheeran",
      genre: "Pop/Folk",
      bio: "English singer-songwriter with global hits.",
    },
    {
      name: "Eminem",
      genre: "Hip Hop",
      bio: "One of the best-selling rappers of all time.",
    },
    {
      name: "Beyoncé",
      genre: "R&B/Pop",
      bio: "Multi-platinum singer and performer.",
    },
    {
      name: "Bruno Mars",
      genre: "Pop/Funk",
      bio: "Singer known for retro-pop and funk influences.",
    },
  ];

  // 4) Insert artists
  const artists = await Artist.insertMany(artistsData);
  console.log(`✅ Seeded ${artists.length} artists`);

  // 5) Explicit songs per artist
  const songsData = [
    // 1. The Beatles
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
      title: "Come Together",
      duration: 259,
      releaseDate: new Date("1969-10-06"),
      artist: artists[0]._id,
    },

    // 2. Adele
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

    // 3. Drake
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
      title: "In My Feelings",
      duration: 210,
      releaseDate: new Date("2018-07-10"),
      artist: artists[2]._id,
    },

    // 4. Coldplay
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

    // 5. Queen
    {
      title: "Bohemian Rhapsody",
      duration: 354,
      releaseDate: new Date("1975-10-31"),
      artist: artists[4]._id,
    },
    {
      title: "Don’t Stop Me Now",
      duration: 210,
      releaseDate: new Date("1978-11-10"),
      artist: artists[4]._id,
    },
    {
      title: "We Will Rock You",
      duration: 122,
      releaseDate: new Date("1977-10-07"),
      artist: artists[4]._id,
    },

    // 6. Michael Jackson
    {
      title: "Thriller",
      duration: 358,
      releaseDate: new Date("1982-11-30"),
      artist: artists[5]._id,
    },
    {
      title: "Billie Jean",
      duration: 294,
      releaseDate: new Date("1983-01-02"),
      artist: artists[5]._id,
    },
    {
      title: "Beat It",
      duration: 258,
      releaseDate: new Date("1983-02-14"),
      artist: artists[5]._id,
    },

    // 7. Madonna
    {
      title: "Like a Virgin",
      duration: 235,
      releaseDate: new Date("1984-11-06"),
      artist: artists[6]._id,
    },
    {
      title: "Vogue",
      duration: 331,
      releaseDate: new Date("1990-03-27"),
      artist: artists[6]._id,
    },
    {
      title: "Material Girl",
      duration: 240,
      releaseDate: new Date("1985-11-30"),
      artist: artists[6]._id,
    },

    // 8. Prince
    {
      title: "Purple Rain",
      duration: 515,
      releaseDate: new Date("1984-06-25"),
      artist: artists[7]._id,
    },
    {
      title: "When Doves Cry",
      duration: 355,
      releaseDate: new Date("1984-05-16"),
      artist: artists[7]._id,
    },
    {
      title: "Kiss",
      duration: 203,
      releaseDate: new Date("1986-09-10"),
      artist: artists[7]._id,
    },

    // 9. Elvis Presley
    {
      title: "Heartbreak Hotel",
      duration: 145,
      releaseDate: new Date("1956-01-27"),
      artist: artists[8]._id,
    },
    {
      title: "Hound Dog",
      duration: 136,
      releaseDate: new Date("1956-07-13"),
      artist: artists[8]._id,
    },
    {
      title: "Jailhouse Rock",
      duration: 147,
      releaseDate: new Date("1957-09-24"),
      artist: artists[8]._id,
    },

    // 10. Whitney Houston
    {
      title: "I Will Always Love You",
      duration: 273,
      releaseDate: new Date("1992-11-03"),
      artist: artists[9]._id,
    },
    {
      title: "I Wanna Dance with Somebody",
      duration: 294,
      releaseDate: new Date("1987-05-02"),
      artist: artists[9]._id,
    },
    {
      title: "How Will I Know",
      duration: 277,
      releaseDate: new Date("1985-11-05"),
      artist: artists[9]._id,
    },

    // 11. Mariah Carey
    {
      title: "All I Want for Christmas Is You",
      duration: 220,
      releaseDate: new Date("1994-11-01"),
      artist: artists[10]._id,
    },
    {
      title: "Hero",
      duration: 275,
      releaseDate: new Date("1993-10-19"),
      artist: artists[10]._id,
    },
    {
      title: "We Belong Together",
      duration: 217,
      releaseDate: new Date("2005-03-29"),
      artist: artists[10]._id,
    },

    // 12. Elton John
    {
      title: "Your Song",
      duration: 241,
      releaseDate: new Date("1970-10-26"),
      artist: artists[11]._id,
    },
    {
      title: "Rocket Man",
      duration: 281,
      releaseDate: new Date("1972-04-17"),
      artist: artists[11]._id,
    },
    {
      title: "Tiny Dancer",
      duration: 304,
      releaseDate: new Date("1972-02-11"),
      artist: artists[11]._id,
    },

    // 13. U2
    {
      title: "With or Without You",
      duration: 296,
      releaseDate: new Date("1987-03-01"),
      artist: artists[12]._id,
    },
    {
      title: "One",
      duration: 276,
      releaseDate: new Date("1991-02-24"),
      artist: artists[12]._id,
    },
    {
      title: "Beautiful Day",
      duration: 248,
      releaseDate: new Date("2000-10-09"),
      artist: artists[12]._id,
    },

    // 14. Taylor Swift
    {
      title: "Love Story",
      duration: 235,
      releaseDate: new Date("2008-09-12"),
      artist: artists[13]._id,
    },
    {
      title: "Shake It Off",
      duration: 219,
      releaseDate: new Date("2014-08-18"),
      artist: artists[13]._id,
    },
    {
      title: "Blank Space",
      duration: 231,
      releaseDate: new Date("2014-11-10"),
      artist: artists[13]._id,
    },

    // 15. Ed Sheeran
    {
      title: "Shape of You",
      duration: 263,
      releaseDate: new Date("2017-01-06"),
      artist: artists[14]._id,
    },
    {
      title: "Perfect",
      duration: 263,
      releaseDate: new Date("2017-03-03"),
      artist: artists[14]._id,
    },
    {
      title: "Photograph",
      duration: 258,
      releaseDate: new Date("2015-05-11"),
      artist: artists[14]._id,
    },

    // 16. Eminem
    {
      title: "Lose Yourself",
      duration: 326,
      releaseDate: new Date("2002-10-28"),
      artist: artists[15]._id,
    },
    {
      title: "The Real Slim Shady",
      duration: 284,
      releaseDate: new Date("2000-05-16"),
      artist: artists[15]._id,
    },
    {
      title: "Stan",
      duration: 404,
      releaseDate: new Date("2000-11-21"),
      artist: artists[15]._id,
    },

    // 17. Beyoncé
    {
      title: "Crazy in Love",
      duration: 235,
      releaseDate: new Date("2003-05-14"),
      artist: artists[16]._id,
    },
    {
      title: "Single Ladies",
      duration: 196,
      releaseDate: new Date("2008-10-13"),
      artist: artists[16]._id,
    },
    {
      title: "Halo",
      duration: 261,
      releaseDate: new Date("2008-01-20"),
      artist: artists[16]._id,
    },

    // 18. Bruno Mars
    {
      title: "Just the Way You Are",
      duration: 221,
      releaseDate: new Date("2010-07-20"),
      artist: artists[17]._id,
    },
    {
      title: "Grenade",
      duration: 223,
      releaseDate: new Date("2010-09-28"),
      artist: artists[17]._id,
    },
    {
      title: "Uptown Funk",
      duration: 269,
      releaseDate: new Date("2014-11-10"),
      artist: artists[17]._id,
    },
  ];

  // 6) Insert songs
  const songs = await Song.insertMany(songsData);
  console.log(`✅ Seeded ${songs.length} songs`);

  // 7) Update each artist’s songs array
  const mapping = songs.reduce((map, song) => {
    const key = song.artist.toString();
    map[key] = map[key] || [];
    map[key].push(song._id);
    return map;
  }, {});

  for (const [artistId, songIds] of Object.entries(mapping)) {
    await Artist.findByIdAndUpdate(artistId, { $set: { songs: songIds } });
  }
  console.log("✅ Updated artists with their songs arrays");

  // 8) Disconnect
  await mongoose.disconnect();
  console.log("🎉 Seeding complete and disconnected");
}

seed().catch((err) => {
  console.error("❌ Error during seeding:", err);
  mongoose.disconnect();
});
