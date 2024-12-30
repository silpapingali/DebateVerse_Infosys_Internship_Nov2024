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

    // Check if the user exists
    let exist = await Registeruser.findOne({ email });
    if (!exist) {
      return res.status(400).send('USER_NOT_FOUND');
    }

    // Check if the user's email is verified
    if (!exist.isVerified) {
      return res.status(400).send('Email not verified');
    }

    // Check if the user is blocked
    if (exist.isblocked) {
      return res.status(403).send('ACCOUNT_BLOCKED'); // HTTP 403 for forbidden access
    }

    // Check if the password matches
    const isMatch = await bcrypt.compare(password, exist.password);
    if (!isMatch) {
      return res.status(400).send('PASSWORD_MISMATCH');
    }

    // Create a payload for the JWT
    let payload = {
      user: {
        id: exist.id,
        role: exist.role,
        username: exist.username,
      },
    };

    // Sign and return the JWT
    jwt.sign(payload, 'jwtSecret', { expiresIn: 3600000 }, (error, token) => {
      if (error) throw error;
      return res.json({ token, role: exist.role, username: exist.username });
    });
  } catch (error) {
    console.error(error);

    // Handle specific error types
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

app.get('/user/:id', async (req, res) => {
 
  const { id } = req.params;
   
  try {
    const user = await Registeruser.findById({_id:id});
    console.log("User",user)
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).json({ message: 'Error fetching user details' });
  }
});

// API route to fetch user's debates
app.get('/user/:id/debates',  async (req, res) => {
  const { id } = req.params;

  try {

    const user = await Registeruser.findById(id);
    const debates = await Debate.find({ createdBy: user.username }); // Find all debates for this user
    console.log(debates)
    res.json(debates);
  } catch (err) {
    console.error('Error fetching debates:', err);
    res.status(500).json({ message: 'Error fetching debates' });
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
    return res.json({
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
    const totalRecords = await Debate.countDocuments({ createdBy: { $ne: createdBy }});


    // Fetch debates with pagination and sorting
    const debates = await Debate
      .find({ createdBy: { $ne: createdBy }})
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
app.post('/vote/:id', middleware, async (req, res) => {
  const { id } = req.params;
  const { votes } = req.body; // Array of vote data (optionIndex and voteCount)
  const userId = req.user.id;

  try {
    const debate = await Debate.findById(id);
    if (!debate) return res.status(404).json({ message: "Debate not found" });

    // Check if user has already voted
    const userVote = debate.votedUsers.find(user => user.userId === userId);

    if (userVote) {
      // Update existing votes
      userVote.votes = votes;
    } else {
      // Add new votes for the user
      debate.votedUsers.push({ userId, votes });
    }

    // Update vote counts for the options
    debate.options.forEach(option => {
      option.votes = 0; // Reset the votes
    });

    // Count the votes for each option
    debate.votedUsers.forEach(user => {
      user.votes.forEach(vote => {
        const option = debate.options[vote.optionId];
        if (option) {
          option.votes += vote.voteCount;
        }
      });
    });

    // Update total votes
    debate.totalVotes = debate.options.reduce((total, option) => total + option.votes, 0);

    // Save the updated debate document
    await debate.save();

    res.json({
      totalVotes: debate.totalVotes,
      options: debate.options,
      userVotes: votes,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});



app.get("/allusers", async (req, res) => {
  try {
    // Get all users from the database
    const users = await Registeruser.find({ role: "user" });

    const usersWithDebates = await Promise.all(
      users.map(async (user) => {
        // Fetch all debates for the current user
        const debates = await Debate.find({ createdBy: user.username });
        // Calculate total likes and votes for the user's debates
        let totalLikes = 0;
        let totalVotes = 0;

        // Iterate through each debate and sum the likes and votes
        debates.forEach((debate) => {
          totalLikes += debate.likes || 0;
          totalVotes += debate.totalVotes || 0;
        });

        // Now return the user data along with the debates count, likes, votes, and createdDate of the debates
        return {
          userId: user._id,
          username: user.username,
          totalDebates: debates.length,
          totalLikes,
          totalVotes,
          isblocked:user.isblocked,
          createdDate: debates.length > 0 ? debates[0].createdDate : null, // Assuming you want the createdDate of the first debate
        };
      })
    );

    // Send the response back to the frontend
    res.status(200).json(usersWithDebates);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching users and their debates." });
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

app.patch('/debate/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await Debate.findByIdAndUpdate(id, { isblocked: true });
    res.status(200).json({ message: 'Debate deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting debate' });
  }
});

app.delete('/debate/:debateId/option/:optionId', async (req, res) => {
  const { debateId, optionId } = req.params; // Get debateId and optionId from request params
  try {
    // Find the debate by ID
    const debate = await Debate.findById(debateId);
    
    if (!debate) {
      return res.status(404).json({ message: 'Debate not found' });
    }

    // Find the option to delete by matching the optionId
    const optionToDelete = debate.options.find(option => option._id.toString() === optionId);
    
    if (!optionToDelete) {
      return res.status(404).json({ message: 'Option not found' });
    }

    // Subtract the option's votes from the totalVotes
    debate.totalVotes -= optionToDelete.votes;

    // Remove the option from the options array
    debate.options = debate.options.filter(option => option._id.toString() !== optionId);

    // Iterate through votedUsers to remove the user's vote for the deleted option
    debate.votedUsers.forEach(user => {
      // Filter out the vote that corresponds to the deleted option
      user.votes = user.votes.filter(vote => vote.optionId.toString() !== optionId);
    });

    // Save the updated debate
    await debate.save();
    
    res.status(200).json({ message: 'Option deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting option' });
  }
});


// /blockuser/:userId
app.patch('/blockuser/:userId', async (req, res) => {
  const { userId } = req.params;
  console.log(userId)
  await Registeruser.findByIdAndUpdate(userId, { isblocked: true });
  res.status(200).send("User blocked");
});

// /blockuserdebates/:userId
app.patch('/blockuserdebates/:userId', async (req, res) => {
  const { userId } = req.params;
  const user = await Registeruser.findById(userId);  // Assuming Registeruser is your user model

    if (!user) {
      return res.status(404).send("User not found");
    }

    const username = user.username;
  await Debate.updateMany({ createdBy: username }, { isblocked: true });
  res.status(200).send("Debates blocked");
});

app.patch('/:debateId/unblock', middleware, async (req, res) => {
  const { debateId } = req.params;
  console.log("hhii")
  try {
    console.log("Debate ID: ", debateId);
    console.log("Authenticated user: ", req.user);

    // Check if the user is an admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Only admins can unblock debates.' });
    }

    // Find the debate by its ID
    const debate = await Debate.findById(debateId);
    if (!debate) {
      return res.status(404).json({ message: 'Debate not found.' });
    }

    // Check if the debate is blocked
    if (debate.isblocked !== true) {
      return res.status(400).json({ message: 'Debate is not blocked.' });
    }

    // Unblock the debate
    console.log("Before unblocking: ", debate);
    debate.isblocked = false; // Change status to 'active'
    await debate.save();
    console.log("After unblocking: ", debate);

    return res.status(200).json({ message: 'Debate successfully unblocked.' });
  } catch (err) {
    console.error('Error unblocking debate:', err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
});

app.patch('/unblockuser/:userId', middleware, async (req, res) => {
  const { userId } = req.params;

  try {
    // Find the user by ID
    const user = await Registeruser.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if (!user.isblocked) {
      return res.status(400).json({ message: 'User is not blocked.' });
    }

    // Unblock the user
    user.isblocked = false;
    await user.save();

    // Unblock all debates created by this user
    const result = await Debate.updateMany(
      { createdBy: user.username }, // Filter debates by the username
      { $set: { isblocked: false } } // Update isBlocked to false
    );

    return res.status(200).json({
      message: 'User and their debates successfully unblocked.',
      unblockedDebates: result.nModified, // Number of debates unblocked
    });
  } catch (err) {
    console.error('Error unblocking user:', err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
});




app.listen(5000, () => {
  console.log('Server running...');
});