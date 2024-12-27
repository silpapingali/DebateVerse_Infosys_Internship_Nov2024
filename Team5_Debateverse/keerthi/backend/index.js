const express = require('express');
const mongoose = require('mongoose');
const { Registeruser, User,Debate } = require('./model');
const jwt = require('jsonwebtoken');
const middleware = require('./middleware');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const app = express();
const crypto = require('crypto');
const nodemailer = require('nodemailer');
require('dotenv').config();

const mongoURI = process.env.MONGO_URI;
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
    const { username,email, password, confirmpassword } = req.body;
    let exist = await Registeruser.findOne({ email });
    if (exist) {
      return res.status(400).json({ error: 'User Already Exist' }); 
    }

    if (password !== confirmpassword) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    

    let newUser = new Registeruser({
      username,
      email,
      password: hashedPassword,
      role: email === adminemail ? 'admin' : 'user',
      isVerified: false,
    });

    await newUser.save();

    let newUsername = new User({
      username
    });
    await newUsername.save()
  .then(() => console.log('New username saved successfully'))
  .catch(error => console.error('Error saving username:', error));

   

    const verificationLink = `http://localhost:5173/verify-email?token=${newUser._id}`;

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
    const { token } = req.query; 

    if (!token) {
      return res.status(400).send({ error: 'Token is required' });
    }

    const user = await Registeruser.findById(token);
    if (!user) {
      return res.status(400).send({ error: 'Invalid or expired verification link' });
    }

    if (!user.isVerified) {
      user.isVerified = true;
      await user.save();
    }

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
        username: exist.username,
      },
    };

    
    jwt.sign(payload, 'jwtSecret', { expiresIn: 3600000 }, (error, token) => {
      if (error) throw error;
      return res.json({ token, role: exist.role ,username: exist.username }); 
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


      let user = await Registeruser.findOne({
          resetPasswordToken: token,
          resetPasswordExpires: { $gt: Date.now() }, // Ensure token has not expired
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


// Add a new debate
app.post('/debates', async (req, res) => {
  const { question, options, createdBy } = req.body;
  try {
    
    const newDebate = new Debate({
      question,
      options,
      createdBy,
      createdAt: new Date(),
    });
    await newDebate.save();
    res.status(201).json({
      message: 'Debate created successfully.',
      debate: newDebate,
    });
  } catch (error) {
    console.error('Error creating debate:', error);
    res.status(500).json({
      error: 'Internal server error. Failed to create debate.',
    });
  }
});


//to fetch all debates
app.get('/debates',middleware, async (req, res) => {
  try {
    const username = req.user.username;
    const debates = await Debate.find({ createdBy: username });

    if (debates.length === 0) {
      return res.status(404).json({ message: 'No debates found.' });
    }

    return res.status(200).json(debates);
  } catch (error) {
    console.error('Error fetching debates:', error);
    return res.status(500).json({ error: 'Failed to fetch debates.' });
  }
});

app.get('/alldebates', middleware, async (req, res) => {
  const { page } = req.query;  // Get the page number from query
  const skip = (page - 1) * 10;  // Calculate how many debates to skip

  try {
    const createdBy = req.user.username;
    const totalRecords = await Debate.countDocuments({ createdBy: { $ne: createdBy } });


    // Fetch debates with pagination and sorting
    const debates = await Debate
      .find({ createdBy: { $ne: createdBy } })
      .skip(skip) // Skip the calculated number of records
      .limit(10) // Limit to 10 debates per page
      .sort({ createdOn: -1 }); // Sort by createdOn date in descending order
      
    // Return the response with total records, the debates for the current page, and likes (if any)
    res.status(200).json({ totalRecords, debates });
  } catch (err) {
    // Handle any errors
    console.error('Error fetching debates:', err);
    res.status(400).json({ message: 'Server error! Try again later' });
  }
});




app.post('/like/:id', middleware, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;


  try {
    const debate = await Debate.findById(id);
    if (!debate) return res.status(404).json({ message: "Debate not found" });

    if (debate.likedBy.includes(userId)) {
      return res.status(400).json({ message: "You already liked this debate" });
    }

    debate.likes++;
    debate.likedBy.push(userId);
    await debate.save();
    return res.json({ likes: debate.likes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Route to dislike a debate
app.post('/dislike/:id', middleware, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const debate = await Debate.findById(id);
    if (!debate) return res.status(404).json({ message: "Debate not found" });

    if (!debate.likedBy.includes(userId)) {
      return res.status(400).json({ message: "You haven't liked this debate" });
    }

    debate.likes--;
    debate.likedBy = debate.likedBy.filter(user => user !== userId);
    await debate.save();
    res.json({ likes: debate.likes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Route to submit votes
app.post('/vote/:id',middleware, async (req, res) => {
  const { id } = req.params;
  const { votes } = req.body; // Array of vote data (optionIndex and voteCount)
  const userId = req.user.id;
  

  try {
    const debate = await Debate.findById(id);
    console.log(debate)
    if (!debate) return res.status(404).json({ message: "Debate not found" });

    // Check if user has already voted
    const userVote = debate.votedUsers.find(user => user.userId === userId);
    if (userVote) {
      return res.status(400).json({ message: "You have already voted for this debate" });
    }

    // Update vote counts
    const updatedVotes = debate.options.map((option, index) => {
      const vote = votes.find(vote => vote.optionId === index);
      if (vote) {
        option.votes += vote.voteCount;
      }
      return option;
    });
    //console.log(updatedVotes)

    debate.options = updatedVotes;
    console.log(debate.totalVotes)
    debate.totalVotes += votes.reduce((total, vote) => total + vote.voteCount, 0);
    console.log(debate.totalVotes)
    console.log(votes)
    debate.votedUsers.push({
      userId,
      votes,
    });

    await debate.save();
    res.json({ totalVotes: debate.totalVotes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});



// Get a single debate by ID
app.get('/debate/:id', middleware, async (req, res) => {
  try {
    const { id } = req.params;
    const debate = await Debate.findById(id);

    if (!debate) {
      return res.status(404).json({ error: 'Debate not found' });
    }

    res.status(200).json(debate);
  } catch (error) {
    console.error('Error fetching debate:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.listen(5000, () => {
  console.log('Server running...');
});