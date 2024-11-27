const express = require('express');
const mongoose = require('mongoose');
const Registeruser = require('./model');
const jwt = require('jsonwebtoken');
const middleware = require('./middleware');
const cors = require('cors');
const bcrypt = require('bcryptjs'); // Import bcrypt
const app = express();
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const cron = require('node-cron');
require('dotenv').config();

const mongoURI = process.env.MONGO_URI;
const jwtSecret = process.env.JWT_SECRET;
const emailUser = process.env.EMAIL_USER;
const emailPass = process.env.EMAIL_PASS;
const adminemail = process.env.EMAIL_ADMIN;


mongoose.connect(mongoURI).then(
  () => console.log('DB Connection established')
);


app.get('/', (req, res) => {
  res.send('hello world');
});

app.use(express.json());
app.use(cors({ origin: "*" }));

// Register Route
app.post('/register', async (req, res) => {
  try {
    const { email, password, confirmpassword } = req.body;
    let exist = await Registeruser.findOne({ email });
    if (exist) {
      return res.status(400).json({ error: 'User Already Exist' }); 
    }

    if (password !== confirmpassword) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    

    let newUser = new Registeruser({
      email,
      password: hashedPassword,
      role: email === '213j1a4254@raghuinstech.com' ? 'admin' : 'user',
      isVerified: false,
    });

    await newUser.save();

    const verificationLink = `http://localhost:5173/verify-email?token=${newUser._id}`;;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    });

    const mailOptions = {
      from: emailUser,
      to: email,
      subject: 'Verify Your Email',
      html: `<p>Click <a href="${verificationLink}">here</a> to verify your email.</p>`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).send({ message: 'Registered successfully! Check your email to verify your account.' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

// Verify Email Route
app.get('/verify-email', async (req, res) => {
  try {
    const { token } = req.query; // Extract the token from the query string

    if (!token) {
      return res.status(400).send({ error: 'Token is required' });
    }

    // Find the user by ID (using token)
    const user = await Registeruser.findById(token);
    if (!user) {
      return res.status(400).send({ error: 'Invalid or expired verification link' });
    }

    // Update the user's verification status
    if (!user.isVerified) {
      user.isVerified = true;
      await user.save();
    }

    // Respond with success to let the frontend handle UI changes
    res.status(200).json({ message: 'Email successfully verified!' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
});



// Login Route
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    let exist = await Registeruser.findOne({ email });
    if (!exist) {
      return res.status(400).send('USER_NOT_FOUND');
    }
    if (!exist.isVerified) {
      return res.status(400).send('Email not verified');
    }
    const isMatch = await bcrypt.compare(password, exist.password);
    if (!isMatch) {
      return res.status(400).send('PASSWORD_MISSMATCH');
    }

    
    let payload = {
      user: {
        id: exist.id,
        role: exist.role, 
      },
    };

    
    jwt.sign(payload, 'jwtSecret', { expiresIn: 3600000 }, (error, token) => {
      if (error) throw error;
      return res.json({ token, role: exist.role }); 
    });
  } catch (error) {
    console.log(error);
     
     if (error.message.includes('ECONNREFUSED') || error.message.includes('ENOTFOUND')) {
      return res.status(500).send('DATABASE_ISSUE');
    }

    if (error.message.includes('ECONNRESET') || error.message.includes('ETIMEDOUT')) {
      return res.status(500).send('SERVER_ISSUE');
    }

    return res.status(500).send('SERVER_ERROR');
  }
});

cron.schedule('0 * * * *', async () => {
  try {
    const result = await Registeruser.deleteMany({
      isVerified: false,
      createdAt: { $lt: new Date(Date.now() - 3600000) },
    });
    console.log(`Deleted ${result.deletedCount} unverified users`);
  } catch (error) {
    console.error('Error during cleanup:', error);
  }
});
app.post('/request-password-reset', async (req, res) => {
  try {
    const { email } = req.body;
    let user = await Registeruser.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Email not found' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; 
    await user.save();

    const resetLink = `http://localhost:5173/reset-password/${resetToken}`;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    });

    const mailOptions = {
      from: emailUser,
      to: email,
      subject: 'Password Reset',
      html: `<p>Click <a href="${resetLink}">here</a> to reset your password. This link will expire in 1 hour.</p>`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Password reset link sent to your email.Please check your email' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/reset-password/:token', async (req, res) => {
  try {
      const { token } = req.params;
      const { newPassword } = req.body;

      // Find the user with the matching reset token and check if the token has expired
      let user = await Registeruser.findOne({
          resetPasswordToken: token,
          resetPasswordExpires: { $gt: Date.now() }, // Ensure token has not expired
      });

      if (!user) {
          return res.status(400).json({ error: 'Invalid or expired token' });
      }

      // Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update the user's password and clear the reset token
      user.password = hashedPassword;
      user.resetPasswordToken = null;
      user.resetPasswordExpires = null;
      await user.save();

      res.status(200).json({ message: 'Password successfully updated! You can now log in.' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});




// User Dashboard Route
app.get('/userdashboard', middleware, async (req, res) => {
  try {
    let exist = await Registeruser.findById(req.user.id);
    if (!exist) {
      return res.status(400).send('User not found');
    }
    if (exist.role !== 'user') {
      return res.status(403).send('Access denied: Users only');
    }
    res.json({
      message: "Welcome to the User Dashboard",
      user:exist
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send('Server Error');
  }
});

app.get('/admindashboard', middleware, async (req, res) => {
  try {
    let exist = await Registeruser.findById(req.user.id);
    if (!exist) {
      return res.status(400).send('User not found');
    }
    // Check if the user has admin role
    if (exist.role !== 'admin') {
      return res.status(403).send('Access denied: Admins only');
    }
    res.json({
      message: "Welcome to the Admin Dashboard",
      user: exist
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send('Server Error');
  }
});

app.post('/registersuccess', async (req, res) => {
  try {
    const { email, password, confirmpassword } = req.body;
    let exist = await Registeruser.findOne({ email });
    if (exist) {
      return res.status(400).json({ error: 'User Already Exist' }); 
    }

    if (password !== confirmpassword) {
      return res.status(400).json({ error: 'Passwords do not match' }); 
    }

    return res.status(200).json({ message: 'Registration successful! Please check your email for confirmation.' });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' }); 
  }
});

app.listen(5000, () => {
  console.log('Server running...');
});
