const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { jwtSecret } = require("../config");
const { sendVerificationEmail } = require("../services/emailService");

const register = async (req, res) => {
  const { email, password, confirmPassword } = req.body;

  // Check if passwords match
  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save the user with a fixed role as "user"
    const newUser = await User.create({ email, password: hashedPassword, role: "user" });

    // Send verification email
    sendVerificationEmail(newUser);

    res.status(201).json({ message: "User registered successfully, check your email to verify" });
  } catch (err) {
    res.status(500).json({ message: "Server error", err });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid email or password" });

    // Verify the password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid email or password" });

    // Generate a JWT token
    const token = jwt.sign({ id: user._id, role: user.role }, jwtSecret, { expiresIn: "1h" });
    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const verifyEmail = async (req, res) => {
  const { token } = req.query;
  try {
    // Decode and verify the token
    const decoded = jwt.verify(token, jwtSecret);

    // Find the user by ID
    const user = await User.findById(decoded.id);
    if (!user) return res.status(400).json({ message: "Invalid token" });

    // Mark the user's email as verified
    user.isVerified = true;
    await user.save();

    // Respond with a success message
    res.render("verification", { message: "Email verified successfully" });
  } catch (err) {
    res.status(500).json({ message: "Invalid or expired token" });
  }
};

module.exports = { register, login, verifyEmail };
