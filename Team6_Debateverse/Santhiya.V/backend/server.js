const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bcrypt = require('bcryptjs');
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { v4: uuidv4 } = require('uuid');
const app = express();
const router = express.Router();
const authenticateToken = require('./middleware/authenticateToken'); // Middleware to verify token

const PORT = 8080;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configuration
const DB_HOST = "localhost";
const DB_USER = "root";
const DB_PASSWORD = "root";
const DB_NAME = "debate";
const JWT_SECRET_KEY = "f53164bbd2e0ba3c94646afeffcbf2a1451cac38305c5d0ed9433d43ba02e326f6a62bef0c1fab65d07deb961677033dc0b26e4e79626e86220ab8561a1c75f5";

// Database connection
const db = mysql.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
});

db.connect((err) => {
    if (err) {
        console.error("Database connection failed:", err);
        process.exit(1);
    }
    console.log("Connected to the database");
});

// Registration route
app.post('/registration', async (req, res) => {
    const { name, email, password, role } = req.body;

    // Validate the role
    if (role !== "user" && role !== "admin") {
        return res.status(400).json({ message: 'Invalid role. Choose either "user" or "admin".' });
    }

    // Check if the email already exists in the database
    const checkEmailQuery = "SELECT * FROM registration WHERE email = ?";
    db.query(checkEmailQuery, [email], async (err, data) => {
        if (err) {
            console.error("Error checking email:", err);
            return res.status(500).json({ message: "Error checking email availability" });
        }

        if (data.length > 0) {
            return res.status(400).json({ message: "Email already exists. Please use a different email." });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert the new user into the database
        const sql = "INSERT INTO registration (name, email, password, role) VALUES (?)";
        const values = [name, email, hashedPassword, role];

        db.query(sql, [values], (err, result) => {
            if (err) {
                console.error("Error inserting data:", err);
                return res.status(500).json({ message: "Error during registration" });
            }

            // Generate a JWT token for the user
            const token = jwt.sign(
                { id: result.insertId, email, role },
                'your_secret_key', // Use an environment variable in production
                { expiresIn: '1h' }
            );

            // Send the token as a response
            return res.status(201).json({ message: "Registration successful", token });
        });
    });
});

// Login Route
app.post('/logins', (req, res) => {
    const { email, password } = req.body;

    const query = "SELECT * FROM registration WHERE email = ? AND status = 'confirmed'";
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

            const token = jwt.sign(
                { id: data[0].id, email: data[0].email, role: data[0].role },
                JWT_SECRET_KEY,
                { expiresIn: '1h' }
            );

            return res.status(200).json({ message: "Login successful", token });
        });
    });
});

// Forgot Password Route
app.post("/forgot-password", (req, res) => {
    const { email } = req.body;

    const sql = "SELECT * FROM registration WHERE email = ?";
    db.query(sql, [email], (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ message: "Database error" });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

        const otpSql = "INSERT INTO otp (email, otp, otp_expires) VALUES (?, ?, ?)";
        db.query(otpSql, [email, otp, otpExpires], (err) => {
            if (err) {
                console.error("Error saving OTP:", err);
                return res.status(500).json({ message: "Failed to save OTP" });
            }

            const transporter = nodemailer.createTransport({
                service: "Gmail",
                auth: {
                    user: "madkine563@gmail.com",
                    pass: "your-email-password"
                }
            });

            const mailOptions = {
                from: '"Support" <madkine563@gmail.com>',
                to: email,
                subject: "Your OTP for Password Reset",
                text: `Your OTP is ${otp}. It is valid for 10 minutes.`
            };

            transporter.sendMail(mailOptions, (err) => {
                if (err) {
                    console.error("Error sending email:", err);
                    return res.status(500).json({ message: "Failed to send OTP" });
                }

                res.status(200).json({ message: "OTP sent successfully" });
            });
        });
    });
});

// Verify OTP Route
app.post("/verify-otp", (req, res) => {
    const { email, otp } = req.body;

    const sql = "SELECT * FROM otp WHERE email = ? AND otp = ? AND otp_expires > NOW()";
    db.query(sql, [email, otp], (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ message: "Database error" });
        }
        if (results.length === 0) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        const token = jwt.sign({ email }, JWT_SECRET_KEY, { expiresIn: "15m" });
        res.status(200).json({ message: "OTP verified", token });
    });
});

// Reset Password Route
app.post("/reset-password", (req, res) => {
    const { token, password } = req.body;

    try {
        const decoded = jwt.verify(token, JWT_SECRET_KEY);
        const email = decoded.email;

        const hashedPassword = bcrypt.hashSync(password, 10);
        const sql = "UPDATE registration SET password = ? WHERE email = ?";
        db.query(sql, [hashedPassword, email], (err) => {
            if (err) {
                console.error("Error updating password:", err);
                return res.status(500).json({ message: "Failed to reset password" });
            }

            res.status(200).json({ message: "Password reset successfully" });
        });
    } catch (err) {
        console.error("Invalid token:", err);
        res.status(400).json({ message: "Invalid or expired token" });
    }
});

// POST route to create a new debate
app.post('/debatetopic', authenticateToken, (req, res) => {
    const { text, options, created_by, created_on } = req.body;

    if (!text || !options || options.length < 2) {
        return res.status(400).json({ message: 'Invalid input. Ensure debate text and at least 2 options.' });
    }

    const insertDebateQuery = 'INSERT INTO debatetopic (text, created_by, created_on) VALUES (?, ?, ?)';
    db.query(insertDebateQuery, [text, created_by, created_on], (err, debateResult) => {
        if (err) {
            console.error('Error inserting debate:', err);
            return res.status(500).json({ message: 'Failed to create debate. Please try again later.' });
        }

        const debateId = debateResult.insertId;
        const optionsData = options.map(option => [option.text, debateId]);
        const insertOptionsQuery = 'INSERT INTO option (text, debate_id) VALUES ?';

        db.query(insertOptionsQuery, [optionsData], (err) => {
            if (err) {
                console.error('Error inserting options:', err);
                return res.status(500).json({ message: 'Failed to add options. Please try again later.' });
            }

            res.status(201).json({ message: 'Debate created successfully!' });
        });
    });
});


// Fetch debates
app.get('/debatetopic', authenticateToken, (req, res) => {
    const fetchDebatesQuery = `
        SELECT dt.id, dt.text, dt.created_on, dt.created_by,
               JSON_ARRAYAGG(JSON_OBJECT('id', opt.id, 'text', opt.text, 'upvotes', (
                   SELECT JSON_ARRAYAGG(user_id) FROM option_upvotes WHERE option_id = opt.id
               ))) AS options,
               JSON_ARRAYAGG(user_id) AS likes
        FROM debatetopic dt
        LEFT JOIN option opt ON dt.id = opt.debate_id
        LEFT JOIN debate_reactions dr ON dt.id = dr.debate_id AND dr.action = 'like'
        GROUP BY dt.id;
    `;

    db.query(fetchDebatesQuery, (err, results) => {
        if (err) {
            console.error('Error fetching debates:', err);
            return res.status(500).json({ message: 'Failed to fetch debates.' });
        }
        res.status(200).json(results);
    });
});

// Like debate
app.post('/debatetopic/:debateId/reactions', authenticateToken, (req, res) => {
    const { debateId } = req.params;
    const { action, userId } = req.body;

    if (action !== 'like') {
        return res.status(400).json({ message: 'Invalid action' });
    }

    const toggleLikeQuery = `
        INSERT INTO debate_reactions (debate_id, user_id, action)
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE action = IF(action = 'like', NULL, 'like');
    `;

    db.query(toggleLikeQuery, [debateId, userId, 'like'], (err) => {
        if (err) {
            console.error('Error liking debate:', err);
            return res.status(500).json({ message: 'Failed to like/unlike debate.' });
        }

        const fetchLikesQuery = `SELECT JSON_ARRAYAGG(user_id) AS likes FROM debate_reactions WHERE debate_id = ? AND action = 'like';`;
        db.query(fetchLikesQuery, [debateId], (err, results) => {
            if (err) {
                console.error('Error fetching likes:', err);
                return res.status(500).json({ message: 'Failed to fetch likes.' });
            }
            res.status(200).json({ likes: results[0].likes });
        });
    });
});

// Upvote an option
app.post('/options/:optionId/upvote', authenticateToken, (req, res) => {
    const { optionId } = req.params;
    const { userId } = req.body;

    const toggleUpvoteQuery = `
        INSERT INTO option_upvotes (option_id, user_id)
        VALUES (?, ?)
        ON DUPLICATE KEY UPDATE option_id = NULL;
    `;

    db.query(toggleUpvoteQuery, [optionId, userId], (err) => {
        if (err) {
            console.error('Error upvoting option:', err);
            return res.status(500).json({ message: 'Failed to upvote/un-upvote option.' });
        }

        const fetchUpvotesQuery = `SELECT JSON_ARRAYAGG(user_id) AS upvotes FROM option_upvotes WHERE option_id = ?;`;
        db.query(fetchUpvotesQuery, [optionId], (err, results) => {
            if (err) {
                console.error('Error fetching upvotes:', err);
                return res.status(500).json({ message: 'Failed to fetch upvotes.' });
            }
            res.status(200).json({ upvotes: results[0].upvotes });
        });
    });
});


// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
