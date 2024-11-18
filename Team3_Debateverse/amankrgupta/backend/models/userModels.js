const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  role: {
    type: String,
  },
  isVerified: {
    type: Boolean,
    default: false,
  }
});

module.exports = mongoose.model("User", userSchema);
