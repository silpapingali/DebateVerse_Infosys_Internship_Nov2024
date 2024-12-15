require('dotenv').config(); // Load environment variables from .env
const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();



const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
const router = express.Router();

// Database Connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "signup",
});

db.connect((err) => {
    if (err) {
        console.error("Error connecting to database:", err);
        process.exit(1); // Stop the server if the connection fails
    }
    console.log("Connected to database");
});

// Use environment variable for JWT secret key
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

if (!JWT_SECRET_KEY) {
    console.error("JWT secret key not found. Set JWT_SECRET_KEY in your .env file.");
    process.exit(1); // Exit if secret key is not set
}

// Signup route
app.post('/signup', async (req, res) => {
    const { email, password } = req.body;

    // Check if email already exists in the database
    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Database error' });
        }
        if (results.length > 0) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert the new user into the database
        db.query('INSERT INTO users (email, password) VALUES (?, ?)', [email, hashedPassword], (err, result) => {
            if (err) {
                return res.status(500).json({ message: 'Error inserting user into database' });
            }
            res.status(201).json({ message: 'User registered successfully' });
        });
    });
});

// Login route
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    // Check if the user exists
    const query = 'SELECT * FROM users WHERE email = ?';
    db.query(query, [email], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Database error' });
        }

        if (results.length === 0) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const user = results[0];

        // Compare the hashed password
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
                return res.status(500).json({ message: 'Error comparing passwords' });
            }

            if (!isMatch) {
                return res.status(400).json({ message: 'Invalid email or password' });
            }

            // Create a JWT token with the user's role
            const token = jwt.sign(
                { id: user.id, email: user.email, role: user.role }, // Payload
                JWT_SECRET_KEY,                                     // Secret key from .env
                { expiresIn: '1h' }                                 // Token expiry
            );

            res.status(200).json({ message: 'Login successful', token });
        });
    });
});

module.exports = router;


// Nodemailer Configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'madkine563@gmail.com',
        pass: 'oema jxzf efvp dozl',
    },
});



// Utility to find user by email
const findUserByEmail = (email) => users.find((user) => user.email === email);

// Forgot Password Route (OTP Generation)
app.post('/forgot-password', (req, res) => {
    const { email } = req.body;

    const sql = "SELECT * FROM users WHERE email = ?";
    db.query(sql, [email], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Database error' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // Valid for 10 minutes

        // Save OTP to OTP table
        const otpSql = "INSERT INTO otp (email, otp, otp_expires) VALUES (?, ?, ?)";
        db.query(otpSql, [email, otp, otpExpires], (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Failed to save OTP' });
            }

            // Send OTP via email
            const mailOptions = {
                from: '"DebavteVerse" <madkine563@gmail.com>',
                to: email,
                subject: 'Your OTP for Password Reset',
                text: `Your OTP is ${otp}. It is valid for 10 minutes.`,
            };

            transporter.sendMail(mailOptions, (err) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ message: 'Failed to send OTP' });
                }

                res.status(200).json({ message: 'OTP sent successfully' });
            });
        });
    });
});

app.post('/verify-otp', (req, res) => {
    const { email, otp } = req.body;

    const sql = "SELECT * FROM otp WHERE email = ? AND otp = ? AND otp_expires > NOW() AND used = FALSE";
    db.query(sql, [email, otp], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Database error' });
        }

        if (results.length === 0) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        // Mark the OTP as used
        const updateOtpSql = "UPDATE otp SET used = TRUE WHERE email = ? AND otp = ?";
        db.query(updateOtpSql, [email, otp], (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Error marking OTP as used' });
            }

            // Generate JWT token
            const token = jwt.sign({ email }, JWT_SECRET_KEY, { expiresIn: '15m' });
            res.status(200).json({ message: 'OTP verified', token });
        });
    });
});



app.post('/reset-password', (req, res) => {
    const { token, password } = req.body;

    try {
        // Verify JWT token
        const decoded = jwt.verify(token, JWT_SECRET_KEY);
        const email = decoded.email;

        // Hash the new password
        const hashedPassword = bcrypt.hashSync(password, 10);

        // Update the password in the `users` table
        const sql = "UPDATE users SET password = ? WHERE email = ?";
        db.query(sql, [hashedPassword, email], (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Failed to update password' });
            }

            res.status(200).json({ message: 'Password updated successfully' });
        });
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: 'Invalid or expired token' });
    }
});



// Endpoint to check if email exists
app.post('/check-email', (req, res) => {
    const email = req.body.email;
    
    const sql = "SELECT * FROM users WHERE email = ?";
    db.query(sql, [email], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Database error' });
        }

        // If email exists, send a response indicating it
        if (results.length > 0) {
            return res.json({ exists: true });
        } else {
            return res.json({ exists: false });
        }
    });
});

app.post('/api/debates', (req, res) => {
    const { question, options } = req.body;
  
    if (!question || !options || options.length < 2) {
      return res.status(400).json({ message: 'Invalid input. Question and at least 2 options are required.' });
    }
  
    // Insert the question into the debate_questions table
    const questionQuery = 'INSERT INTO debatequestions (question, created_at) VALUES (?, NOW())';
  
    db.query(questionQuery, [question], (err, results) => {
      if (err) {
        console.error('Error inserting debate question:', err);
        return res.status(500).json({ message: 'Internal server error' });
      }
  
      const questionId = results.insertId;
  
      // Insert options into the debate_options table
      const optionQuery = 'INSERT INTO debate_options (question_id, option_text, created_at) VALUES ?';
      const optionValues = options.map((option) => [questionId, option, new Date()]);
  
      db.query(optionQuery, [optionValues], (err) => {
        if (err) {
          console.error('Error inserting debate options:', err);
          return res.status(500).json({ message: 'Internal server error' });
        }
  
        res.status(201).json({ message: 'Debate created successfully', questionId });
      });
    });
  });
  
  app.get('/alldebates', (req, res) => {
    const query = `
      SELECT dq.id AS debate_id, dq.question, dq.created_at, 
             o.id AS option_id, o.option_text, o.created_at AS option_created_at, 
             COUNT(v.id) AS upvotes, 
             COUNT(r.id) AS likes 
      FROM debatequestions dq
      LEFT JOIN debate_options o ON dq.id = o.question_id
      LEFT JOIN votes v ON o.id = v.option_id
      LEFT JOIN reactions r ON dq.id = r.debate_id AND r.action = 'like'
      GROUP BY dq.id, o.id
    `;
  
    db.query(query, (err, results) => {
      if (err) {
        console.error('Error fetching debates:', err);
        return res.status(500).send('Server error');
      }
  
      const formattedDebates = results.reduce((acc, row) => {
        const { debate_id, question, created_at, option_id, option_text, option_created_at, upvotes, likes } = row;
  
        let debate = acc.find(d => d.id === debate_id);
        if (!debate) {
          debate = {
            id: debate_id,
            text: question,
            created_on: created_at,
            options: [],
            likes: likes || 0,
          };
          acc.push(debate);
        }
  
        debate.options.push({
          id: option_id,
          text: option_text,
          created_at: option_created_at,
          upvotes: upvotes || 0,
        });
  
        return acc;
      }, []);
  
      res.json(formattedDebates);
    });
  });

  // Handle reactions (likes)
app.post('/debateList/:debateId/reactions', (req, res) => {
    const { debateId } = req.params;
    const { action } = req.body; // e.g., 'like'
    const userId = req.user?.id; // Ensure `req.user` is populated by an auth middleware.
  
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized. Please log in.' });
    }
  
    if (action !== 'like') {
      return res.status(400).json({ error: 'Invalid action.' });
    }
  
    // Check if the user has already liked this debate
    const checkQuery = `
      SELECT id FROM reactions WHERE debate_id = ? AND user_id = ? AND action = 'like'
    `;
    db.query(checkQuery, [debateId, userId], (checkErr, checkResult) => {
      if (checkErr) {
        console.error('Error checking existing reaction:', checkErr);
        return res.status(500).json({ error: 'Server error' });
      }
  
      if (checkResult.length > 0) {
        // User already liked this debate
        return res.status(409).json({ error: 'Already liked.' });
      }
  
      // Insert the like
      const query = `INSERT INTO reactions (debate_id, user_id, action) VALUES (?, ?, ?)`;
      db.query(query, [debateId, userId, action], (err, result) => {
        if (err) {
          console.error('Error inserting like:', err);
          return res.status(500).json({ error: 'Server error' });
        }
  
        // Get the updated like count
        const likeCountQuery = `
          SELECT COUNT(id) AS like_count FROM reactions WHERE debate_id = ? AND action = 'like'
        `;
        db.query(likeCountQuery, [debateId], (countErr, countResult) => {
          if (countErr) {
            console.error('Error fetching like count:', countErr);
            return res.status(500).json({ error: 'Server error' });
          }
  
          res.status(200).json({ likes: countResult[0].like_count });
        });
      });
    });
  });
  
  // Handle upvotes
  app.post('/options/:optionId/upvote', (req, res) => {
    const { optionId } = req.params;
    const userId = req.user?.id; // Ensure `req.user` is populated by an auth middleware.
  
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized. Please log in.' });
    }
  
    // Check if the user has already upvoted this option
    const checkQuery = `
      SELECT id FROM votes WHERE option_id = ? AND user_id = ?
    `;
    db.query(checkQuery, [optionId, userId], (checkErr, checkResult) => {
      if (checkErr) {
        console.error('Error checking existing upvote:', checkErr);
        return res.status(500).json({ error: 'Server error' });
      }
  
      if (checkResult.length > 0) {
        // User already upvoted this option
        return res.status(409).json({ error: 'Already upvoted.' });
      }
  
      // Insert the upvote
      const query = `INSERT INTO votes (option_id, user_id) VALUES (?, ?)`;
      db.query(query, [optionId, userId], (err, result) => {
        if (err) {
          console.error('Error inserting upvote:', err);
          return res.status(500).json({ error: 'Server error' });
        }
  
        // Get the updated upvote count
        const upvoteCountQuery = `
          SELECT COUNT(id) AS upvote_count FROM votes WHERE option_id = ?
        `;
        db.query(upvoteCountQuery, [optionId], (countErr, countResult) => {
          if (countErr) {
            console.error('Error fetching upvote count:', countErr);
            return res.status(500).json({ error: 'Server error' });
          }
  
          res.status(200).json({ upvotes: countResult[0].upvote_count });
        });
      });
    });
  });
  
// Start the server
const PORT = 8081;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
