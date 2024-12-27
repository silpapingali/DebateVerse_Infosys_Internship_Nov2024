const express = require("express");
const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const nodemailer = require("nodemailer");
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(cors());
app.use(express.json());


const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "signup"
});


db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log('Connected to the database.');
});


app.post('/login', (req, res) => {
    const { email, password } = req.body;

    const query = "SELECT * FROM user1 WHERE email = ?";
    db.query(query, [email], (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "An error occurred while checking the credentials." });
        }

        if (data.length === 0) {
            return res.status(400).json({ message: "Invalid email or password." });
        }

        
        bcrypt.compare(password, data[0].password, (err, match) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: "An error occurred during password comparison." });
            }

            if (!match) {
                return res.status(400).json({ message: "Invalid email or password." });
            }

            
            if (data[0].status === 'confirmed') {
                
                const token = jwt.sign(
                    { id: data[0].id, email: data[0].email, role: data[0].role },
                    'A2pE@R#7%L08w!9XgM!zT$JtQ1yY#1j', 
                    { expiresIn: '1h' }
                );

                return res.status(200).json({ message: "Login successful", token });
            } else if (data[0].status === 'pending') {
                return res.status(400).json({ message: "Registration Incomplete. Please click on the registration confirmation link sent to your email." });
            } else {
                return res.status(500).json({ message: "An unknown error occurred." });
            }
        });
    });
});


// Signup route
app.post('/signup', (req, res) => {
    const { email, password, role } = req.body;

    const checkEmailSql = "SELECT * FROM user1 WHERE email = ?";
    db.query(checkEmailSql, [email], (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "An error occurred while checking the email." });
        }

        if (data.length > 0) {
            return res.status(400).json({ message: "User already exists with this email." });
        }

        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: "An error occurred while hashing the password." });
            }

            const userId = require('crypto').randomUUID();
            const insertSql = "INSERT INTO user1 (id, email, password, role, status) VALUES (?, ?, ?, ?, 'pending')";
            db.query(insertSql, [userId, email, hashedPassword, role], (err) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ error: "An error occurred while saving the data." });
                }

                const token = require('crypto').randomBytes(16).toString('hex');
                const expiresAt = new Date(9999999999999); // No expiry
                const insertTokenSql = "INSERT INTO confirmation_requests (id, email, token, expires_at) VALUES (UUID(), ?, ?, ?)";
                db.query(insertTokenSql, [email, token, expiresAt], (err) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).json({ error: "Failed to create confirmation request." });
                    }

                    const confirmationLink = `http://localhost:8081/confirm-registration/${token}`;
                    
                    // Send confirmation email
                    const transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                            user: 'maheshpai200424@gmail.com',
                            pass: 'ecag ibvo abps ospo'
                        }
                    });

                    const mailOptions = {
                        from: 'maheshpai200424@gmail.com',
                        to: 'mpai85900@gmail.com',
                        subject: 'Registration Confirmation',
                        text: `Click the link to confirm your registration: ${confirmationLink}`
                    };

                    transporter.sendMail(mailOptions, (error) => {
                        if (error) {
                            console.error(error);
                            return res.status(500).json({ error: "Failed to send confirmation email." });
                        }

                        res.status(200).json({ message: "User registered. Confirmation email sent." });
                    });
                });
            });
        });
    });
});

app.get('/confirm-registration/:token', (req, res) => {
    const { token } = req.params;
    console.log("Received token:", token); 

    const checkTokenSql = "SELECT * FROM confirmation_requests WHERE token = ? AND expires_at > NOW()";
    db.query(checkTokenSql, [token], (err, data) => {
        if (err) {
            console.error("Database error:", err); 
            return res.status(500).json({ error: "Database error occurred." });
        }

        console.log("Token query result:", data); 

        if (data.length === 0) {
            return res.status(400).json({ message: "Invalid or expired token." });
        }

        const email = data[0].email;

        const updateUserSql = "UPDATE user1 SET status = 'confirmed' WHERE email = ?";
        db.query(updateUserSql, [email], (err) => {
            if (err) {
                console.error("Failed to update user status:", err); 
                return res.status(500).json({ error: "Failed to confirm registration." });
            }

            
            res.redirect(`http://localhost:3000/confirm-registration/${token}?status=success`);
        });
    });
});


app.post('/forgot-password', (req, res) => {
    const { email } = req.body;

    const checkEmailSql = "SELECT * FROM user1 WHERE email = ?";
    db.query(checkEmailSql, [email], (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Database error occurred." });
        }

        if (data.length === 0) {
            return res.status(400).json({ message: "Email not found." });
        }

        const token = require('crypto').randomBytes(16).toString('hex'); // Generate a random token
        const expiresAt = new Date(Date.now() + 3600000); 

        const insertResetRequestSql = "INSERT INTO password_reset_requests (id, email, token, expires_at) VALUES (UUID(), ?, ?, ?)";
        db.query(insertResetRequestSql, [email, token, expiresAt], (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: "Failed to create reset request." });
            }

            const confirmationLink = `http://localhost:3000/reset-password/${token}`;
                    
                    // Send password-reset link
                    const transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                            user: 'maheshpai200424@gmail.com',
                            pass: 'ecag ibvo abps ospo'
                        }
                    });

                    const mailOptions = {
                        from: 'maheshpai200424@gmail.com',
                        to: 'mpai85900@gmail.com',
                        subject: 'PASSWORD RESET',
                        text: `Click the link to reset your password: ${confirmationLink}`
                    };

                    transporter.sendMail(mailOptions, (error) => {
                        if (error) {
                            console.error(error);
                            return res.status(500).json({ error: "Failed to send confirmation email." });
                        }
                        res.status(200).json({ message: "Password reset link sent to email." });
                    })
        });
    });
});

app.get('/reset-password/:token', (req, res) => {
    const { token } = req.params;

    const checkTokenSql = "SELECT * FROM password_reset_requests WHERE token = ? AND expires_at > NOW()";
    db.query(checkTokenSql, [token], (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Database error occurred." });
        }

        if (data.length === 0) {
            return res.status(400).json({ message: "Invalid or expired token." });
        }

        res.status(200).json({ message: "Token is valid.", email: data[0].email });
    });
});

app.post('/reset-password', (req, res) => {
    const { token, password } = req.body;

    const checkTokenSql = "SELECT * FROM password_reset_requests WHERE token = ? AND expires_at > NOW()";
    db.query(checkTokenSql, [token], (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Database error occurred." });
        }

        if (data.length === 0) {
            return res.status(400).json({ message: "Invalid or expired token." });
        }

        const hashedPassword = bcrypt.hashSync(password, 10);
        const updatePasswordSql = "UPDATE user1 SET password = ? WHERE email = ?";
        db.query(updatePasswordSql, [hashedPassword, data[0].email], (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: "Failed to reset password." });
            }

            const deleteResetRequestSql = "DELETE FROM password_reset_requests WHERE token = ?";
            db.query(deleteResetRequestSql, [token], () => {});

            res.status(200).json({ message: "Password reset successfully." });
        });
    });
});




const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    console.log('Authorization header:', authHeader); 

    if (!authHeader) {
        console.error('Authorization header is missing');
        return res.status(403).json({ message: 'Token missing in request' });
    }

    const token = authHeader.split(' ')[1];
    jwt.verify(token, 'A2pE@R#7%L08w!9XgM!zT$JtQ1yY#1j', (err, decoded) => {
        if (err) {
            console.error('JWT verification error:', err);
            return res.status(403).json({ message: 'Invalid or expired token' });
        }
        req.userId = decoded.id;
        next();
    });
};

app.post('/debates', verifyToken, (req, res) => {
    const { text, options, created_by } = req.body;

    // Validate input
    if (!text || !options || options.length < 2) {
        return res.status(400).json({ message: 'Debate text and at least 2 options are required' });
    }

    const debateId = uuidv4();
    const createdOn = new Date().toISOString().split('T')[0]; // Format to YYYY-MM-DD

    // Insert debate into the debates table
    const debateQuery = `
        INSERT INTO debates (id, text, created_by, created_on, likes, dislikes, is_public, is_blocked) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
        debateQuery,
        [debateId, text, created_by, createdOn, 0, JSON.stringify([]), true, false],
        (debateErr) => {
            if (debateErr) {
                console.error('Error inserting into debates table:', debateErr);
                return res.status(500).json({ message: 'Failed to create debate' });
            }

            // Prepare options for insertion
            const optionsQuery = `
                INSERT INTO options (id, debate_id, text, created_on, upvotes) 
                VALUES ?
            `;

            const optionsValues = options.map((option) => [
                uuidv4(), // Generate a new UUID for each option
                debateId,
                option.text, // Use the text from the option
                createdOn, // Use the same created_on date for options
                0 // Default upvotes to 0
            ]);

            // Insert options into the options table
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

// Route to handle likes 
app.post('/debates/:id/reactions', verifyToken, (req, res) => {
    const { id } = req.params;
    const { action, userId } = req.body;

    // Check if the action is 'like'
    if (action !== 'like') {
        return res.status(400).json({ message: 'Only "like" action is supported at this time' });
    }

    // Query to fetch current likes for the debate
    db.query('SELECT likes FROM debates WHERE id = ?', [id], (err, results) => {
        if (err) {
            console.error('Error fetching likes:', err);
            return res.status(500).json({ message: 'Error fetching likes' });
        }

        // Check if the debate exists
        if (results.length === 0) {
            return res.status(404).json({ message: 'Debate not found' });
        }

        // Increment the likes count
        let currentLikes = results[0].likes || 0;
        currentLikes += 1;

        // Update the likes count in the database
        db.query('UPDATE debates SET likes = ? WHERE id = ?', [currentLikes, id], (updateErr) => {
            if (updateErr) {
                console.error('Error updating likes:', updateErr);
                return res.status(500).json({ message: 'Error updating likes' });
            }

            // Respond with the updated likes count
            res.status(200).json({ likes: currentLikes });
        });
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
});

app.get('/debates/:debateId', verifyToken, (req, res) => {
    const { debateId } = req.params;

    const getDebateQuery = `
        SELECT * FROM debates WHERE id = ?;
    `;

    db.query(getDebateQuery, [debateId], (err, debateResults) => {
        if (err) {
            console.error('Error fetching debate:', err);
            return res.status(500).json({ message: 'Failed to fetch debate' });
        }

        if (debateResults.length === 0) {
            return res.status(404).json({ message: 'Debate not found' });
        }

        const debate = debateResults[0];

        const getOptionsQuery = `
            SELECT * FROM options WHERE debate_id = ?;
        `;

        db.query(getOptionsQuery, [debateId], (optionsErr, optionsResults) => {
            if (optionsErr) {
                console.error('Error fetching options:', optionsErr);
                return res.status(500).json({ message: 'Failed to fetch options' });
            }

            const debateWithOptions = {
                ...debate,
                options: optionsResults,
            };

            res.status(200).json(debateWithOptions);
        });
    });
});

app.post('/debates/:debateId/submitVotes', verifyToken, (req, res) => {
    const { debateId } = req.params;
    const { votes } = req.body; // Expecting an array of { optionId, votes }

    if (!votes || !Array.isArray(votes)) {
        return res.status(400).json({ message: 'Invalid votes data' });
    }

    // Prepare the SQL query to update the votes for each option
    const updateQueries = votes.map(vote => {
        const { optionId, votes } = vote;
        return new Promise((resolve, reject) => {
            const query = `
                UPDATE options 
                SET upvotes = upvotes+ ?
                WHERE id = ?;
            `;
            db.query(query, [votes, optionId], (err) => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });
    });

    // Execute all update queries
    Promise.all(updateQueries)
        .then(() => {
            res.status(200).json({ message: 'Votes submitted successfully' });
        })
        .catch(err => {
            console.error('Error updating votes:', err);
            res.status(500).json({ message: 'Failed to submit votes' });
        });
});


app.listen(8081, () => {
    console.log("Server is running on port 8081.");
});
