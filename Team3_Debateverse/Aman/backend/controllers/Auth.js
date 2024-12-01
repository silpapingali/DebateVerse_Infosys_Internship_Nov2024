const userModel = require("../models/usersModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { verifyMail, resetMail } = require("../utils/Mailer");

const Login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const databaseUser = await userModel.findOne({ email });
    if (!databaseUser) {
      return res
        .status(400)
        .json({ message: "Email not found ! Please register" });
    }
    if (!databaseUser.isVerified) {
      const send = await verifyMail(email);
      if (send) {
        res
          .status(400)
          .json({ message: "Not Verified ! Verification link sent to email" });
      } else {
        res.status(400).json({
          message: "Verification link not sent ! Register again later",
        });
      }
      return;
    }

    const isMatch = await bcrypt.compare(password, databaseUser.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Email or password is incorrect !" });
    }
    const token = jwt.sign(
      { email, password, role: databaseUser.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "24h",
      }
    );
    res.status(200).json({
      message: "Welcome Back ! You are Logged In",
      token,
      role: databaseUser.role,
    });
  } catch (err) {
    res.status(500).json({
      message: "Server error ! Please refresh the page",
    });
  }
};

const Register = async (req, res) => {
  const { email, password } = req.body;
  console.log({ email, password }, "in register");

  try {
    const user = await userModel.findOne({ email });
    if (user && user.isVerified) {
      return res
        .status(200)
        .json({ message: "User already exists ! Please Login" });
    }
    if (!user) {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new userModel({
        email,
        password: hashedPassword,
      });
      await newUser.save();
    }
    const send = await verifyMail(email);
    if (send) {
      res
        .status(201)
        .json({ message: "Success ! Verify your email from inbox" });
    } else {
      res.status(400).json({
        message: "Verification link not sent ! Register again later",
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error ! Please refresh the page" });
  }
};

const Verify = async (req, res) => {
  const { token } = req.query;
  try {
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    const { email } = decoded;
    const user = await userModel.findOneAndUpdate(
      { email },
      { isVerified: true }
    );
    if (user) {
      return res.redirect("http://localhost:5173/login?status=true");
    }
    return res.redirect("http://localhost:5173/login?status=false");
  } catch (err) {
    return res.redirect("http://localhost:5173/login?status=false");
  }
};

const ResetRequest = async (req, res) => {
  const { email } = req.body;
  console.log(email, " in request reset");
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Email not found !" });
    }
    const mailed = await resetMail(email);
    if (!mailed) {
      return res
        .status(400)
        .json({ message: "Unable to sent ! Please try again later" });
    }
    return res
      .status(200)
      .json({ message: "Reset password link sent to your email !" });
  } catch {
    res.status(400).json({ message: "Server error ! Please try again" });
  }
};

const ResetPassword = async (req, res) => {
  const { token, password } = req.body;
  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res
        .status(400)
        .json({ message: "Expire or Invalid link ! Request again" });
    }
    console.log(decoded);
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
      const user = await userModel.updateOne(
        { email: decoded.email },
        { password: hashedPassword }
      );
      console.log(user);
      res.status(200).json({ message: "Password reset successful !" });
    } catch (err) {
      res
        .status(400)
        .json({ message: "Server error ! Please try again later" });
    }
  });
};

const AuthCheck = (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json();
    }
    return res.status(200).json({ role: decoded.role });
  });
};

module.exports = {
  Login,
  Register,
  ResetPassword,
  Verify,
  ResetRequest,
  AuthCheck,
};
