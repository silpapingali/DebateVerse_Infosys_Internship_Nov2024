const mongoose = require("mongoose");

const debatesSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [
    {
      answer: { type: String, required: true },
      votes: { type: Number, required: true, default: 0 },
    },
  ],
  totalVotes: { type: Number, required: true, default: 0 },
  totalLikes: { type: Number, required: true, default: 0 },
  createdBy: { type: String, required: true },
  createdOn: { type: String, required: true },
});

module.exports = mongoose.model("Debate", debatesSchema);