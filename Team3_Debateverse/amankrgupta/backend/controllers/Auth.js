const userModel = require("../models/userModels");
const bcrypt = require("bcrypt");

const Login = (req, res) => {
  const { email, password } = req.body;
  console.log({ email, password });
  res.send("Logined successfully");
};

const Register = async (req, res) => {
  const { name, email, password, role } = req.body;
  console.log({ name, email, password, role });

  try {
    const user = await userModel.findOne({ email });
    console.log(user);
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
      role,
    });
    await newUser.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { Login, Register };
