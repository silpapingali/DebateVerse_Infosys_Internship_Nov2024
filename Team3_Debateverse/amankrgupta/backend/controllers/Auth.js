const userModels = require("../models/userModels");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { verifyMail, resetMail } = require("../utils/Mailer");

const Login = async (req, res) => {
  const { email, password } = req.body;
  console.log({ email, password });
  try {
    const databaseUser = await userModels.findOne({ email });
    if (!databaseUser) {
      return res
        .status(400)
        .json({ message: "Email not found ! Please register" });
    }
    const isMatch = await bcrypt.compare(password, databaseUser.password);
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
  console.log({ email, password, role, isVerified }, "in register");

  try {
    const user = await userModels.findOne({ email });
    if (user) {
      return res.status(200).json({ message: "User already exists !" });
    }

    const newUser = {
      email,
      password,
      role,
      isVerified,
    };
    const send = await verifyMail(newUser);
    if (send) {
      res
        .status(201)
        .json({ message: "Success ! Verify your email from inbox" });
    } else {
      res.status(400).json({ message: "Server issue ! Please try again" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error !" });
  }
};

const Verify = async (req, res) => {
  const { token } = req.query;
  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      // console.log(err);
      return res.render("verified", {
        message: "Invalid URL ! Verification is failed",
      });
    }
    const { email, password, role, isVerified } = decoded;
    const hashedPassword= await bcrypt.hash(password, 10);
    try {
      const newUser = new userModels({
        email,
        password: hashedPassword,
        role,
        isVerified,
      });
      await newUser.save();
      return res.render("verified", {
        message: "Congratulations! You are Verified",
      });
    } catch (err) {
      return res.render("verified", {
        message: "Server error ! Verification failed",
      });
    }
  });
};

const ResetRequest= async (req, res)=>{
  const {email}= req.body;
  console.log(email, " in request reset");
  try{
    const user = await userModels.findOne({email});
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
    res.status(400).json({message: "Server error ! Please try again"})
  }
}

const ResetPassword = async (req, res) => {
  const { token, password } = req.body;
  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded)=>{
    if(err){
      res.status(400).json({message: "Expire or Invalid link ! Request again"})
    }
    console.log(decoded);
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userModels.updateOne(
      { email: decoded.email },
      { password: hashedPassword }
    );
    console.log(user);
    res.status(200).json({ message: "Password reset successful !" });
  })
};

module.exports = { Login, Register, ResetPassword, Verify, ResetRequest };
