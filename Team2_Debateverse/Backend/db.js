const mongoose = require("mongoose");
const { dbUri } = require("./config");

const connectDB = async () => {
  try {
    await mongoose.connect(dbUri);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

module.exports = connectDB;
