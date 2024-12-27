const mongoose = require('mongoose');

const RegisterUserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
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
    default: false
  },
    resetPasswordToken: { 
      type: String,
      default: null },
    resetPasswordExpires: { 
      type: Date, 
      default: null },
});


const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
});

const DebateSchema=new mongoose.Schema({
  question:{
    type:String,
    required: true,
    trim: true
  },
  options: [
    {
      optionText: { type: String, required: true }, 
      votes: { type: Number, default: 0 },         
    },
  ],
  createdBy: { 
    type: String, 
    required: true
   },  
  createdDate: { 
    type: Date,
    default: Date.now
   },
   likes: {
    type: Number,
    default: 0, 
  },
  likedBy: { 
    type: [String],
    default: [] 
  },
  totalVotes:{
   type: Number,
   default:0,
  },
  votedUsers: [String],

});

const Registeruser = mongoose.model('Registeruser', RegisterUserSchema, 'registerusers');
const User = mongoose.model('User', UserSchema, 'users');
const Debate=mongoose.model('Debate',DebateSchema,'debates');
module.exports = {
  Registeruser,
  User,
  Debate
};