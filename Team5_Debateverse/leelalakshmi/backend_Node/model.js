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
  confirmpassword:{
    type: String,
    required: true,
  },
  role: {
     type: String, 
     default: 'user' }
});


module.exports = mongoose.model('Registeruser', UserSchema);
