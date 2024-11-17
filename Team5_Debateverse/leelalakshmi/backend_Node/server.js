const express = require('express');
const mongoose = require('mongoose');
const Registeruser = require('./model');
const jwt = require('jsonwebtoken');
const middleware = require('./middleware');
const cors = require('cors');
const bcrypt = require('bcryptjs'); // Import bcrypt
const app = express();

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
      return res.status(400).send('User Already Exist');
    }
    if (password !== confirmpassword) {
      return res.status(400).send("Passwords are not matching");
    }

    // Hash the password before saving it
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

    let newUser = new Registeruser({
      email,
      password: hashedPassword, // Save hashed password
      confirmpassword: hashedPassword, // Save hashed password for confirmation as well
      role: email === '213j1a4254@raghuinstech.com' ? 'admin' : 'user', // Role assignment
    });

    await newUser.save();
    res.status(200).send('Registered Successfully');
  } catch (error) {
    console.log(error);
    return res.status(500).send('Internal Server Error');
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

    const isMatch = await bcrypt.compare(password, exist.password);
    if (!isMatch) {
      return res.status(400).send('PASSWORD_MISSMATCH');
    }

    // Create JWT payload
    let payload = {
      user: {
        id: exist.id,
        role: exist.role, // Include role
      },
    };

    // Sign the JWT
    jwt.sign(payload, 'jwtSecret', { expiresIn: 3600000 }, (error, token) => {
      if (error) throw error;
      return res.json({ token, role: exist.role }); // Send token and role
    });
  } catch (error) {
    console.log(error);
     // Specific error handling for server/database issues
     if (error.message.includes('ECONNREFUSED') || error.message.includes('ENOTFOUND')) {
      return res.status(500).send({ error: 'DATABASE_ISSUE' });
    }

    if (error.message.includes('ECONNRESET') || error.message.includes('ETIMEDOUT')) {
      return res.status(500).send({ error: 'SERVER_ISSUE' });
    }

    return res.status(500).send({ error: 'SERVER_ERROR' });
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

app.listen(5000, () => {
  console.log('Server running...');
});
