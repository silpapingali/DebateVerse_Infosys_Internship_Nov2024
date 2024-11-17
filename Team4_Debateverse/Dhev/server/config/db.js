const mongoose = require("mongoose");

const MONGO_URI = "mongodb://localhost:27017/debatehub";  // Replace with your MongoDB URI

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("MongoDB Connected");
  } catch (err) {
    console.error(err.message);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;
