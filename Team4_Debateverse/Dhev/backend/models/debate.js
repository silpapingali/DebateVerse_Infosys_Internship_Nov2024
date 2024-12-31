import mongoose from "mongoose";



const OptionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  upvotes: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        
      },
      count: { type: Number, default: 0 },
    },
  ],
  downvotes: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        
      },
      count: { type: Number, default: 0 },
    },
  ],
  
  
  userVotes: {
    type: Number,
    default: 0,
  },
});

const DebateSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  createdBy: { type: String, default: "Anonymous" },
  options: { type: [OptionSchema], required: true },
  createdAt: { type: Date, default: Date.now },
  likes: [{ type: [mongoose.Schema.Types.ObjectId], ref: "User" ,default: []}],
  dislikes: [{ type: [mongoose.Schema.Types.ObjectId], ref: "User" ,default: []}],
  isActive: {type: Boolean,default: true},
});

const Debate = mongoose.model("Debate", DebateSchema);

export default Debate;
