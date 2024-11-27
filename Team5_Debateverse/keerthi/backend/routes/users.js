// routes/users.js
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const User = require("../models/Users");  // Assuming you have a User model

const router = express.Router();

module.exports = (JWT_SECRET, EMAIL_USER, EMAIL_PASS) => {
  // Example of a user registration route
  router.post("/register", async (req, res) => {
    const { username, email, password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    try {
      await newUser.save();
      res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
      res.status(500).json({ error: "Error registering user" });
    }
  });

  // Add more user routes (login, JWT, etc.) as needed...

  return router;
};
