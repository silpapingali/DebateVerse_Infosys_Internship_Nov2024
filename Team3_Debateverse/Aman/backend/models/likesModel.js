const mongoose = require("mongoose");
const likeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  debateId: { type: mongoose.Schema.Types.ObjectId, ref: "Debate" },
});

module.exports = mongoose.model("Likes", likeSchema);