const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const UserModel = require("./models/employee");

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["GET","POST"],
    credentials: true,
  })
);
app.use(cookieParser());

mongoose.connect("mongodb://localhost:27017/employee");

app.post("/Login", (req, res) => {
  const { email, password } = req.body;
  UserModel.findOne({ email: email }).then((user) => {
    if (user) {
      bcrypt.compare(password, user.password, (err, response) => {
        if (response) {
          const token = jwt.sign(
            { email: user.email, role: user.role },
            "jwt-secret-key",
            { expiresIn: "1d" }
          );
          res.cookie("token", token);
          return res.json({ Status: "Success", role: user.role });
        } else {
          return res.json("Password id incorrect");
        }
      });
    } else {
      return res.json("no record existed");
    }
  });
});

app.post("/register", (req, res) => {
  const { name, email, password } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => {
      UserModel.create({ name, email, password: hash })
        .then((user) => res.json("success "))
        .catch((err) => res.json(err));
    })
    .catch((err) => res.json(err));
});

app.listen(3001, () => {
  console.log("server is running");
});
