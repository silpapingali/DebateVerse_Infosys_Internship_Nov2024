const mongoose = require('mongoose');

const OptionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  votes: { type: Number, default: 0 },
});

const DebateSchema = new mongoose.Schema({
  title: { type: String, required: true },
  options: [OptionSchema],
  likes: { type: Number, default: 0 },
});

module.exports = mongoose.model('Debate', DebateSchema);
