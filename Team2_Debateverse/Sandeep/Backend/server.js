const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const Debate = require('./models/Debate');
const User = require('./models/User');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose
  .connect('mongodb://localhost:27017/debate-app', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log(err));

// Middleware to verify JWT token
function verifyToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    return res.status(403).send('Token is required');
  }
  jwt.verify(token, 'secretkey', (err, decoded) => {
    if (err) {
      return res.status(401).send('Invalid token');
    }
    req.userId = decoded.userId;
    req.userRole = decoded.role; // Add role to request object
    next();
  });
}

// Route to register a user
app.post('/api/register', async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: role || 'user', // Default role to 'user' if not provided
      addedDate: new Date(), // Automatically set addedDate
      likes: 0, // Initialize likes to 0
      questionsCount: 0, // Initialize questionsCount to 0
    });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
});


app.get('/api/users/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ name: user.name });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Route to login a user
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    const token = jwt.sign({ userId: user._id, role: user.role }, 'secretkey', { expiresIn: '1h' });
    res.json({ token, userId: user._id, role: user.role });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
});

// Middleware to check if the user is an admin
function isAdmin(req, res, next) {
  if (req.userRole !== 'admin') {
    return res.status(403).json({ message: 'Access denied' });
  }
  next();
}

// Route to reset the password
app.post('/api/reset-password', verifyToken, async (req, res) => {
  const { password } = req.body;
  const { userId } = req;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.findByIdAndUpdate(userId, { password: hashedPassword });
    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
});

// Route to fetch debates for a user
app.get('/api/debates/:userId', async (req, res) => {
  try {
    const userId = req.params.userId; // Get userId from the URL parameter
    const debates = await Debate.find({ userId: userId }); // Fetch debates by userId


    res.status(200).json({ debates }); // Return the list of debates
  } catch (error) {
    console.error('Error fetching debates:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Route to fetch all users with filtering and sorting
app.get('/api/users', async (req, res) => {
  const { likes, questionsCount, addedAfter,suspended } = req.query; // Get filters from query params

  try {
    let query = { role: 'user' }; // Default query for users with 'user' role
    // Add filters if present
    if (likes) {
      query.likes = { $gte: parseInt(likes) }; // Filter by minimum likes
    }
    if (questionsCount) {
      query.questionsCount = { $gte: parseInt(questionsCount) }; // Filter by minimum questions
    }
    if (addedAfter) {
      query.addedDate = { $gte: new Date(addedAfter) }; // Filter by added date
    }

    if (suspended !== undefined) {
      query.suspended = suspended ; // Filter by suspension status
    }

    const users = await User.find(query, 'name email role likes questionsCount addedDate suspended');

    if (!users || users.length === 0) {
      return res.status(404).json({ message: 'No users found' });
    }

    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Route to create a new debate
app.post('/api/debates', verifyToken, async (req, res) => {
  const { question, options } = req.body;
  const { userId } = req;

  if (!question || !options || options.length < 2) {
    return res.status(400).json({ message: 'Invalid input data' });
  }

  try {
    const newDebate = new Debate({
      question,
      options,
      likes: 0, // Default likes to 0
      voteCount: options.map(() => 0), // Initialize vote counts to 0 for each option
      addedDate: new Date(), // Set the current date
      userId,
    });

    await newDebate.save();
    res.status(201).json({ message: 'Debate created successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
});

// Route to fetch all debates
app.get('/api/debates', async (req, res) => {
  try {
    const debates = await Debate.find(); // Fetch all debates

    // Check if debates array is empty
    if (!debates || debates.length === 0) {
      return res.status(404).json({ message: 'No debates found',debates:debates });
      
    }

    res.status(200).json({ debates });
  } catch (error) {
    console.error('Error fetching debates:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


// Route to delete a user and their associated debates
app.delete('/api/users/:userId', async (req, res) => {
  try {
    const userId = req.params.userId; // Get userId from request params

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete all debates associated with the user
    const deletedDebates = await Debate.deleteMany({ userId });
    //console.log(`Deleted ${deletedDebates.deletedCount} debates for user ${userId}`);

    // Delete the user
    await User.findByIdAndDelete(userId);

    res.status(200).json({ 
      message: 'User and associated debates deleted successfully',
      deletedDebatesCount: deletedDebates.deletedCount
    });
  } catch (error) {
    console.error('Error deleting user and debates:', error);
    res.status(500).json({ message: 'Internal Server Error', error });
  }
});


// Route to delete a debate
app.delete('/api/debates/:debateId', verifyToken, async (req, res) => {
  const { debateId } = req.params;  // Get the debateId from the URL parameter
  const { userId, userRole } = req; // Get the userId and userRole from the decoded token

  try {
    // Find the debate by its ID
    const debate = await Debate.findById(debateId);
    
    if (!debate) {
      return res.status(404).json({ message: 'Debate not found' });
    }

    // Check if the user is the one who created the debate or if the user is an admin
    if (debate.userId.toString() !== userId && userRole !== 'admin') {
      return res.status(403).json({ message: 'You are not authorized to delete this debate' });
    }

    // Delete the debate
    await Debate.findByIdAndDelete(debateId);

    res.status(200).json({ message: 'Debate deleted successfully' });
  } catch (error) {
    console.error('Error deleting debate:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.put('/api/users/:id/suspend', async (req, res) => {
  try {
    const userId = req.params.id;
    const { suspended } = req.body;

    if (typeof suspended !== 'boolean') {
      return res.status(400).json({ message: 'Invalid value for suspended field. It must be a boolean.' });
    }

    const updatedUser = await User.findByIdAndUpdate(userId, { suspended }, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.json({ message: 'User suspended successfully.', user: updatedUser });
  } catch (error) {
    console.error('Error while suspending user:', error);
    res.status(500).json({ message: 'An internal server error occurred.' });
  }
});

app.put('/api/debates/:id', async (req, res) => {
  const debateId = req.params.id;
  const updates = req.body;

  try {
    const updatedDebate = await Debate.findByIdAndUpdate(debateId, updates, { new: true });
    if (!updatedDebate) {
      return res.status(404).json({ message: 'Debate not found' });
    }
    res.json(updatedDebate);
  } catch (error) {
    console.error('Error updating debate:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Route to handle voting for a debate
// Route to vote on a debate (no token verification required)
app.post('/api/vote', async (req, res) => {
  const { userId, debateId, optionIndex } = req.body;

  if (!userId || !debateId || optionIndex === undefined) {
    return res.status(400).json({ message: 'Invalid vote data' });
  }

  try {
    // Find the debate by its ID
    const debate = await Debate.findById(debateId);
    
    if (!debate) {
      return res.status(404).json({ message: 'Debate not found' });
    }

    // Check if the user has already voted
    if (debate.voted.includes(userId)) {
      return res.status(400).json({ message: 'You can vote only once' });
    }

    // Ensure the option index is valid
    if (optionIndex < 0 || optionIndex >= debate.options.length) {
      return res.status(400).json({ message: 'Invalid option index' });
    }

    // Increment the vote count for the selected option
    debate.voteCount[optionIndex]++;

    // Add the userId to the 'voted' array
    debate.voted.push(userId);

    // Update the debate in the database
    await debate.save();

    // Return the updated debate data
    res.status(200).json({ message: 'Vote successfully recorded', debate });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
});




// Server setup
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

