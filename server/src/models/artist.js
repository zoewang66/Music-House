const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const Schema = mongoose.Schema;

const artistSchema = new Schema({
  name: { type: String, required: true },
  genre: { type: String, required: true },
  bio: { type: String, required: true },
  songs: [{ type: Schema.Types.ObjectId, ref: "Song", required: true }],
});

// Add pagination plugin
artistSchema.plugin(mongoosePaginate);

// Text index for relevance search
artistSchema.index({ name: "text" });
module.exports = mongoose.model("Artist", artistSchema);
