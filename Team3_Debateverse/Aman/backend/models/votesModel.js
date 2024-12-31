const mongoose = require("mongoose");
const voteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  debateId: { type: mongoose.Schema.Types.ObjectId, ref: "Debate" },
  votes: { type: Array },
});

module.exports = mongoose.model("Votes", voteSchema);
