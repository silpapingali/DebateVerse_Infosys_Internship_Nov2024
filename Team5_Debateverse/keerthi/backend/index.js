const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const nodemailer = require("nodemailer");

// Import the UsersModel
const UsersModel = require("./models/Users");

// Configurations
const PORT = 3001;
const MONGO_URI = "mongodb://127.0.0.1:27017/users";
const JWT_SECRET = "your_jwt_secret_key";
const EMAIL_USER = "nunekeerthi05@gmail.com";
const EMAIL_PASS = "kxbeytmjmwcpucyi";

// Middleware
const app = express();
app.use(express.json());
app.use(cors({
  origin: ["http://localhost:5173"],
  methods: ["GET", "POST"],
  credentials: true,
}));
app.use(cookieParser());

// Database Connection
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB Connection Error:", err));

// Registration Route
app.post("/register", async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await UsersModel.findOne({ email });
    if (existingUser) return res.json("EMAIL_ALREADY_EXISTS");

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new UsersModel({ email, password: hashedPassword });
    await newUser.save();

    res.json("Success");
  } catch (error) {
    console.error(error);
    res.status(500).json("Error occurred during registration.");
  }
});

// Login Route
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UsersModel.findOne({ email });
    if (!user) return res.json({ Status: "Error", Message: "Invalid Email" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.json({ Status: "Error", Message: "Invalid Password" });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });
    res.json({ Status: "Success", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ Status: "Error", Message: "Login failed." });
  }
});

// Forgot Password Route
app.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await UsersModel.findOne({ email });
    if (!user) {
      return res.json({ Message: "If the email exists, a reset link will be sent." });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });
    const resetLink = `http://localhost:5173/reset-password/${user._id}/${token}`;

    // Configure Nodemailer
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: EMAIL_USER,
      to: email,
      subject: "Reset Your Password",
      text: `Click on the link to reset your password: ${resetLink}`,
    };

    await transporter.sendMail(mailOptions);

    res.json({ Status: "Success", Message: "Reset link sent to your email!" });
  } catch (error) {
    console.error("Error in forgot-password:", error);
    res.status(500).json({ Message: "Failed to send reset link. Please try again." });
  }
});

// Reset Password Route
app.post("/reset-password/:userId/:token", async (req, res) => {
  const { userId, token } = req.params;
  const { password } = req.body;

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.id !== userId) {
      return res.status(400).json({ Message: "Invalid token or user ID." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await UsersModel.findByIdAndUpdate(userId, { password: hashedPassword });

    res.json({ Status: "Success", Message: "Password reset successfully!" });
  } catch (error) {
    console.error("Error in reset-password:", error);
    res.status(500).json({ Message: "Failed to reset password. Please try again." });
  }
});

// Start Server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
