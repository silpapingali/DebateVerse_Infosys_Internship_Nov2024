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

mongoose.connect("mongodb+srv://213j1a4254:ABG693oD4mksdMlT@cluster0.fjfkt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0").then(
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
    const verificationToken = crypto.randomBytes(32).toString('hex');

    let newUser = new Registeruser({
      email,
      password: hashedPassword,
      role: email === '213j1a4254@raghuinstech.com' ? 'admin' : 'user',
      isVerified: false,
      verificationToken,
    });

    await newUser.save();

    const verificationLink = `http://localhost:3000/verify-email/${verificationToken}`;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'karasaleelalakshmi9@gmail.com',
        pass: 'eqpc dsia kpoi imsf',
      },
    });

    const mailOptions = {
      from: 'karasaleelalakshmi9@gmail.com',
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
app.get('/verify-email/:token', async (req, res) => {
  try {
    const { token } = req.params;

    let user = await Registeruser.findOne({ verificationToken: token });
    if (!user) {
      return res.status(400).send({ error: 'Invalid or expired token' });
    }

    user.isVerified = true;
    user.verificationToken = null;
    await user.save();

    res.status(200).send({ message: 'Email successfully verified! You can now log in.' });
    res.redirect('http://localhost:3000/login?verified=true'); 
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
    /*if (!exist.isVerified) {
      return res.status(400).send('Email not verified');
    }*/
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

    const resetLink = `http://localhost:3000/reset-password/${resetToken}`;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'karasaleelalakshmi9@gmail.com',
        pass: 'eqpc dsia kpoi imsf',
      },
    });

    const mailOptions = {
      from: 'karasaleelalakshmi9@gmail.com',
      to: email,
      subject: 'Password Reset',
      html: `<p>Click <a href="${resetLink}">here</a> to reset your password. This link will expire in 1 hour.</p>`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Password reset link sent to your email.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/reset-password/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    let user = await Registeruser.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }, 
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired token' });
    }

    
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    
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
