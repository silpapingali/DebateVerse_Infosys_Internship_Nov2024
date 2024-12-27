const mongoose = require('mongoose');

const DebateSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  likes: { type: Number, default: 0 }, // Field to track the likes for the debate
  voteCount: [{ type: Number, default: 0 }], // Array of vote counts for each option
  addedDate: { type: Date, default: Date.now }, // Added date (auto-set to current date)
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  voted: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

const Debate = mongoose.model('Debate', DebateSchema);
module.exports = Debate;
