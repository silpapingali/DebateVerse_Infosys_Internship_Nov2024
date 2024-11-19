const mongoose = require("mongoose");

const debateSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Debate", debateSchema);
