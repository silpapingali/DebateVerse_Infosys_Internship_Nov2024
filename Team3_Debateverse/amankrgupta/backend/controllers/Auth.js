const userModels = require("../models/userModels");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { verifyMail, resetMail } = require("../utils/Mailer");

const Login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModels.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    if (!user.isVerified) {
      const result= await verifyMail(user);
      return res.status(400).json({ message: "verify email" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "email or password is incorrect" });
    }
    const token = jwt.sign({ email, password }, process.env.JWT_SECRET, {
      expiresIn: "5m",
    });
    res.status(200).json({
      message: "logged in",
      token,
    });
  } catch(err) {
    console.log("error during login");
    res.status(500).json({
      message: "server error",
      err,
    });
  }
};

const Register = async (req, res) => {
  const { email, password, role, isVerified } = req.body;
  console.log({ email, password, role, isVerified });

  try {
    const user = await userModels.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new userModels({
      email,
      password: hashedPassword,
      role,
      isVerified,
    });
    await newUser.save();
    const send = await verifyMail(newUser);
    if (send) {
      res
        .status(201)
        .json({ message: "User created successfully && email sent" });
    } else {
      res.status(400).json({ message: "could not sent mail" });
    }
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ error, message: "Server error" });
  }
};

const Verify = async (req, res) => {
  const { e: email, p } = req.query;
  try {
    const user = await userModels.findOne({ email });
    console.log(user);
    if (!user) {
      return res.render("verified", { message: "Invalid URL: user not found" });
    }
    if (!p == user.password) {
      return res.render("verified", {
        message: "Invalid url password not matched",
      });
    }
    await userModels.updateOne({ email }, { isVerified: true });
    return res.render("verified", {
      message: "Congratulations! You are Verified",
    });
  } catch (err) {
    console.log(err, "in catch");
    return res.render("verified", { message: "server error" });
  }
};

const ResetPassword = async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);
  if (!password) {
    const user = await userModels.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "email not found" });
    }
    const mailed= await resetMail(email);
    return res.status(400).json({ message: "email exist" });
  } else {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userModels.updateOne(
      { email },
      { password: hashedPassword }
    );
    console.log(user);
    res.status(200).json({ message: "password reseted" });
  }
};

module.exports = { Login, Register, ResetPassword, Verify };
