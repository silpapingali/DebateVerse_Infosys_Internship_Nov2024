const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const userModel = require("../models/userModels");

const Login = (req, res) => {
  const { email, password } = req.body;
  console.log({ email, password });
  res.send("Logined successfully");
};
const Register = async (req, res) => {
  const { name, email, password, role } = req.body;
  console.log({ name, email, password, role });

  try {
    const user =await userModel.findOne({ email });
    console.log(user);
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }
    const newUser = new userModel({ name, email, password, role });
    newUser.password = await bcrypt.hash(password, process.env.SALT);
    console.log(newData);
    await newUser.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.log(error);
  }
};
module.exports = { Login, Register };
