const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user', required: true }, // Role field
  resetToken: { type: String },
  resetTokenExpiration: { type: Date },
  addedDate: { type: Date, default: Date.now, required: true }, // Date the user was added
  likes: { type: Number, default: 0, required: true }, // Number of likes the user received
  questionsCount: { type: Number, default: 0, required: true }, // Number of questions the user has asked
  suspended: { type: Boolean, default: false }, // Suspended field
});

// Middleware to ensure 'suspended' applies only to users with the 'user' role
userSchema.pre('save', function (next) {
  if (this.role !== 'user') {
    this.questionsCount=undefined;
    this.likes=undefined;
    this.suspended = undefined; // Remove the field if role is not 'user'
  }
  next();
});

module.exports = mongoose.model('User', userSchema);
