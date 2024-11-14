const userModels = require("../models/userModels");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Login = async (req, res) => {
  const { email, password } = req.body;
  console.log({ email, password });

  try {
    const user = await userModels.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "email or password is incorrect" });
    }
    const token = jwt.sign({ email, password }, process.env.JWT_SECRET, {
      expiresIn: "10m",
    });
    res.status(200).json({
      message: "logged in",
      token,
    });
  } catch {
    console.log("error during login");
    res.status(400).json({
      message: "server error",
    });
  }
};

const Register = async (req, res) => {
  const { email, password, role } = req.body;
  console.log({ email, password, role });

  try {
    const user = await userModels.findOne({ email });
    console.log(user);
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new userModels({
      email,
      password: hashedPassword,
      role,
    });
    await newUser.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    // console.error("Error during registration:", error);
    res.status(400).json({ error, message: "Server error" });
  }
};

const ResetPassword =async (req, res)=>{
  const {email, password }= req.body;
  console.log(email, password);
  if (!password){
    const user= await userModels.findOne({email});
    if(!user){
      return res.json({message: "email not found"});
    }
    return res.json({message: "email exist"});
  } else {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user= await userModels.findOneAndUpdate({email},{password: hashedPassword});
    console.log(user);
    res.status(200).json({message: "password reseted"})
  }
}

module.exports = { Login, Register, ResetPassword };