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

/*app.post('/debates', verifyToken, (req, res) => {
    const { text, options, created_by, created_on } = req.body;
  
    if (!text || !options || options.length < 2) {
      return res.status(400).json({ message: 'Debate text and at least 2 options are required' });
    }
  
    
    const debateId = uuidv4();
  
 
    const debateQuery = `
      INSERT INTO debates (id, text, created_by, created_on, likes, dislikes, is_public, is_blocked) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
  
    db.query(
      debateQuery,
      [debateId, text, created_by, created_on, JSON.stringify([]), JSON.stringify([]), true, false],
      (debateErr) => {
        if (debateErr) {
          console.error('Error inserting into debates table:', debateErr);
          return res.status(500).json({ message: 'Failed to create debate' });
        }
  
        
        const optionsQuery = `
          INSERT INTO options (id, debate_id, text, created_on, upvotes, downvotes) 
          VALUES ?
        `;
  
        const optionsValues = options.map((option) => [
          uuidv4(), 
          debateId,
          option.text, 
          created_on,
          JSON.stringify([]), 
          JSON.stringify([])  
        ]);
  
        db.query(optionsQuery, [optionsValues], (optionsErr) => {
          if (optionsErr) {
            console.error('Error inserting into options table:', optionsErr);
            return res.status(500).json({ message: 'Failed to create options' });
          }
  
          res.status(201).json({ message: 'Debate and options created successfully' });
        });
      }
    );
  });

  
app.get('/debates', verifyToken, (req, res) => {
    const userId = req.userId;  
    
    
    const getDebatesQuery = `
      SELECT * FROM debates WHERE created_by = ?
    `;
  
    db.query(getDebatesQuery, [userId], (err, results) => {
      if (err) {
        console.error('Error fetching debates:', err);
        return res.status(500).json({ message: 'Failed to fetch debates' });
      }
      
      
      const getOptionsQuery = `
        SELECT * FROM options WHERE debate_id IN (?);
      `;
      
      db.query(getOptionsQuery, [results.map(debate => debate.id)], (optionsErr, optionsResults) => {
        if (optionsErr) {
          console.error('Error fetching options:', optionsErr);
          return res.status(500).json({ message: 'Failed to fetch options' });
        }
        
        
        const debatesWithOptions = results.map(debate => {
          const options = optionsResults.filter(option => option.debate_id === debate.id);
          return { ...debate, options };
        });
        
        res.status(200).json(debatesWithOptions);
      });
    });
  });

  app.post('/debates/:id/reactions', verifyToken, (req, res) => {
    const { id } = req.params; 
    const { action, userId } = req.body; 

    if (action !== 'like') {
        return res.status(400).json({ message: 'Only "like" action is supported at this time' });
    }

  
    db.query('SELECT likes FROM debates WHERE id = ?', [id], (err, results) => {
        if (err) {
            console.error('Error fetching likes:', err);
            return res.status(500).json({ message: 'Error fetching likes' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'Debate not found' });
        }

        const currentLikes = JSON.parse(results[0].likes || '[]');
        if (!currentLikes.includes(userId)) {
            currentLikes.push(userId);
        }

        
        db.query(
            'UPDATE debates SET likes = ? WHERE id = ?',
            [JSON.stringify(currentLikes), id],
            (updateErr) => {
                if (updateErr) {
                    console.error('Error updating likes:', updateErr);
                    return res.status(500).json({ message: 'Error updating likes' });
                }

                res.status(200).json({ likes: currentLikes }); 
            }
        );
    });
});

app.post('/options/:optionId/upvote', verifyToken, (req, res) => {
    const { optionId } = req.params; 
    const { userId } = req.body;     

    if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
    }

  
    db.query('SELECT upvotes FROM options WHERE id = ?', [optionId], (err, results) => {
        if (err) {
            console.error('Error fetching upvotes:', err);
            return res.status(500).json({ message: 'Error fetching upvotes' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'Option not found' });
        }

        
        const currentUpvotes = JSON.parse(results[0].upvotes || '[]');
        if (!currentUpvotes.includes(userId)) {
            currentUpvotes.push(userId);
        } else {
            return res.status(400).json({ message: 'User has already upvoted this option' });
        }

        
        db.query(
            'UPDATE options SET upvotes = ? WHERE id = ?',
            [JSON.stringify(currentUpvotes), optionId],
            (updateErr) => {
                if (updateErr) {
                    console.error('Error updating upvotes:', updateErr);
                    return res.status(500).json({ message: 'Error updating upvotes' });
                }

                res.status(200).json({ upvotes: currentUpvotes }); 
            }
        );
    });
});

app.get('/alldebates', verifyToken, (req, res) => {
    
    const getDebatesQuery = `
        SELECT * FROM debates;
    `;

    db.query(getDebatesQuery, (err, results) => {
        if (err) {
            console.error('Error fetching debates:', err);
            return res.status(500).json({ message: 'Failed to fetch debates' });
        }

        
        const getOptionsQuery = `
            SELECT * FROM options WHERE debate_id IN (?);
        `;

        db.query(getOptionsQuery, [results.map(debate => debate.id)], (optionsErr, optionsResults) => {
            if (optionsErr) {
                console.error('Error fetching options:', optionsErr);
                return res.status(500).json({ message: 'Failed to fetch options' });
            }

            
            const debatesWithOptions = results.map(debate => {
                const options = optionsResults.filter(option => option.debate_id === debate.id);
                return { ...debate, options };
            });

            res.status(200).json(debatesWithOptions);
        });
    });
});*/



// Start the server
const PORT = 8081;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
