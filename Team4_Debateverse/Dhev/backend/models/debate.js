import mongoose from "mongoose";

const OptionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  votes: { type: Number, default: 0 },
});

const DebateSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  createdBy: { type: String, default: "Anonymous" },
  options: { type: [OptionSchema], required: true },
  createdAt: { type: Date, default: Date.now },
  votes: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
});

const Debate = mongoose.model("Debate", DebateSchema);

export default Debate;
