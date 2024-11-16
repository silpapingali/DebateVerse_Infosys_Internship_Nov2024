const userModels = require("../models/userModels");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { verifyMail, resetMail } = require("../utils/Mailer");

const Login = async (req, res) => {
  const { email, password } = req.body;
  console.log({email, password});
  try {
    const user = await userModels.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Email not found ! Please register" });
    }
    if (!user.isVerified) {
      const result = await verifyMail(user);
      return res
        .status(400)
        .json({
          message: "Not verified ! Verification link sent to your email",
        });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Email or password is incorrect !" });
    }
    const token = jwt.sign({ email, password }, process.env.JWT_SECRET, {
      expiresIn: "1m",
    });
    res.status(200).json({
      message: "Welcome Back ! You are Logged In",
      token,
    });
  } catch (err) {
    res.status(500).json({
      message: "Server error !",
    });
  }
};

const Register = async (req, res) => {
  const { email, password, role, isVerified } = req.body;
  // console.log({ email, password, role, isVerified });

  try {
    const user = await userModels.findOne({ email });
    if (user) {
      return res.status(200).json({ message: "User already exists !" });
    }
    // const hashedPassword = await bcrypt.hash(password, 10);

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
        .json({ message: "Success ! Verify your email from inbox" });
    } else {
      res.status(400).json({ message: "Server issue ! Please try again" });
    }
  } catch (error) {
    res.status(500).json({ error, message: "Server error !" });
  }
};

const Verify = async (req, res) => {
  const { e: email, p } = req.query;
  try {
    const user = await userModels.findOne({ email });
    console.log(user);
    if (!user) {
      return res.render("verified", {
        message: "Invalid URL ! Verification failed",
      });
    }
    if (!p == user.password) {
      return res.render("verified", {
        message: "Invalid URL ! Verification failed",
      });
    }
    await userModels.updateOne({ email }, { isVerified: true });
    return res.render("verified", {
      message: "Congratulations! You are Verified",
    });
  } catch (err) {
    // console.log(err, "in catch");
    return res.render("verified", { message: "Server error ! Verification failed" });
  }
};

const ResetPassword = async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);
  if (!password) {
    const user = await userModels.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Email not found !" });
    }
    const mailed = await resetMail(email);
    if(!mailed){
      return res.status(400).json({ message: "Unable to sent ! Please try again later" });
    } 
    return res.status(200).json({ message: "Reset password link sent to your email !" });
  } else {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userModels.updateOne(
      { email },
      { password: hashedPassword }
    );
    console.log(user);
    res.status(200).json({ message: "Password reset successful !" });
  }
};

module.exports = { Login, Register, ResetPassword, Verify };
