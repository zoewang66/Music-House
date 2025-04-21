const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
var morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();
// Import consolidated routes
const indexRouter = require("./src/routes/index");

const app = express();
app.use(morgan("combined"));

// Set secure HTTP headers
app.use(helmet());

// Parse JSON and URL-encoded payloads
app.use(cors());
app.options("*", cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use((req, res, next) => {
  console.log(`Request URL: ${req.originalUrl}`);
  next();
});

//Set up HTTP request logging
app.use(morgan("combined"));

// Set up rate limiting
const limiter = rateLimit({
  windowMs: 20 * 60 * 1000,
  max: 100,
  message: "Request limit exceeded. Try again later!",
});
app.use(limiter);

//Set up MongoDB connection
const mongoDB = process.env.MONGODB_URI || "mongodb://localhost:27017/musicdb";
main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect(mongoDB);
}
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Set up routes
app.use((req, res, next) => {
  console.log(`Received request for route: ${req.originalUrl}`);
  next();
});

app.use("/api", indexRouter);
app.use((err, req, res, next) => {
  console.error("🔥 Unhandled error:", err.stack);
  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
  });
});
// Port
const PORT = process.env.PORT || 5010;
app.listen(PORT, () => {
  console.log(`Sever is running on port ${PORT}`);
});

module.exports = app;
