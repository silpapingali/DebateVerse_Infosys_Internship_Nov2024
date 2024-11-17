const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const cookieParser = require('cookie-parser');
const UsersModel = require('./models/Users');
const nodemailer = require('nodemailer');

const app = express();
app.use(express.json());
app.use(cors({
  origin: ["http://localhost:5173"],
  methods: ["GET", "POST"],
  credentials: true
}));
app.use(cookieParser());

mongoose.connect("mongodb://127.0.0.1:27017/users");

const verifyUser = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.json("Token is missing");
  } else {
    jwt.verify(token, "jwt-secret-key", (err, decoded) => {
      if (err) {
        return res.json("Error with token");
      } else {
        if (decoded.role === "admin") {
          next();
        } else {
          return res.json("not admin");
        }
      }
    });
  }
};

app.post('/register', (req, res) => {
  const { email, password } = req.body;

  // Check if user already exists
  UsersModel.findOne({ email: email })
    .then(user => {
      if (user) {
        return res.status(400).json({ Status: "Error", Message: "EMAIL_ALREADY_EXISTS" });
      }

      // Proceed with registration if email does not exist
      bcrypt.hash(password, 10)
        .then(hash => {
          UsersModel.create({ email, password: hash, status: 'pending' })
            .then(newUser => {
              console.log(`User registered with email: ${newUser.email}`);
              return res.status(200).json({ Status: "Success", Message: "User registered successfully" });
            })
            .catch(err => {
              console.error(err);
              return res.status(500).json({ Status: "Error", Message: "Unable to register user" });
            });
        })
        .catch(err => {
          console.error(err);
          return res.status(500).json({ Status: "Error", Message: "Error hashing password" });
        });
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ Status: "Error", Message: "Unable to check if user exists" });
    });
});


app.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.json("Please enter both Email and password.");
  }

  UsersModel.findOne({ email: email })
    .then(user => {
      if (!user) {
        return res.json("USER_NOT_FOUND");
      }

      bcrypt.compare(password, user.password, (err, response) => {
        if (err) {
          return res.json("Error comparing password");
        }

        if (response) {
          const token = jwt.sign({ email: user.email, role: user.role }, "jwt-secret-key", { expiresIn: '1h' });

          res.json({
            Status: "Success",
            token: token,
            role: user.role
          });
        } else {
          return res.json("PASSWORD_MISMATCH");
        }
      });
    })
    .catch(err => {
      console.error(err);
      return res.json("Unable to login at this time. Please try again later.");
    });
});

app.listen(3001, () => {
    console.log("server is running")
})

app.post('/forgot-password',(req,res) => {
    const {email} = req.body;
    UsersModel.findOne({email:email})
    .then(user => {
        if(!user){
            return res.send({Status: "User not existed"})
        }
        const token = jwt.sign({id: user._id}, "jwt_secret_key", {expiresIn: "1h"})
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'nunekeerthi05@gmail.com',
              pass: 'kxbeytmjmwcpucyi'
            }
          });
          
          var mailOptions = {
            from: 'nunekeerthi05@gmail.com',
            to: 'keerthikrishna0409@gmail.com',
            subject: 'Reset your Password',
            text: `http://localhost:5173/reset-password/${user._id}/${token}`
          };
          
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.error("Failed to send email:", error.message);
                return res.status(500).json({ Status: "Error", Message: error.message });
            } else {
                console.log("Email sent successfully:", info.response);
                return res.json({ Status: "Success", Info: info.response });
            }
            
          });
    })
})