const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Import bcrypt

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
     type: String, 
     default: 'user' },
  isVerified:{
    type: Boolean,
    default: 'false'
  },
  createdAt: {
     type: Date, default: Date.now, index: { expires: '1h' }
     },
    resetPasswordToken: { 
      type: String,
      default: null },
    resetPasswordExpires: { 
      type: Date, 
      default: null },
});


module.exports = mongoose.model('Registeruser', UserSchema);
