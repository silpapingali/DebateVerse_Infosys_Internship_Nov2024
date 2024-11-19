const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');







const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "signup"
});

// Signup Route
app.post('/signup', (req, res) => {
    const sql = "INSERT INTO login (name, email, password) VALUES (?)";
    const values = [
        req.body.name,
        req.body.email,
        req.body.password
    ];
    db.query(sql, [values], (err, data) => {
        if (err) {
            console.error("Error inserting data:", err);
            return res.json("Error");
        }
        return res.json("Signup successful");
    });
});

// Login Route
app.post('/login', (req, res) => {
    const sql = "SELECT * FROM login WHERE email = ? AND password = ?";
    
    db.query(sql, [req.body.email, req.body.password], (err, data) => {
        if (err) {
            console.error("Error selecting data:", err);
            return res.json("Error");
        }
        if (data.length > 0) {
            return res.json("Success");
        } else {
            return res.json("Failed");
        }
    });
});

// Mock Database
const users = [
    {
        email: '',
        password: bcrypt.hashSync('123456', 10), // Mock hashed password
        otp: null,
        otpExpires: null,
    },
];

// JWT Secret Key
const JWT_SECRET_KEY = 'f53164bbd2e0ba3c94646afeffcbf2a1451cac38305c5d0ed9433d43ba02e326f6a62bef0c1fab65d07deb961677033dc0b26e4e79626e86220ab8561a1c75f5  ';

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

// Routes

app.post('/forgot-password', (req, res) => {
    const { email } = req.body;

    const sql = "SELECT * FROM login WHERE email = ?";
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

        // Save OTP and expiry to the database
        const updateSql = "UPDATE login SET otp = ?, otp_expires = ? WHERE email = ?";
        db.query(updateSql, [otp, otpExpires, email], (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Failed to save OTP' });
            }

            // Send OTP via email
            const mailOptions = {
                from: 'madkine563@gmail.com',
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

    const sql = "SELECT * FROM login WHERE email = ? AND otp = ? AND otp_expires > NOW()";
    db.query(sql, [email, otp], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Database error' });
        }
        if (results.length === 0) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        // Generate JWT token
        const token = jwt.sign({ email }, JWT_SECRET_KEY, { expiresIn: '15m' });
        res.status(200).json({ message: 'OTP verified', token });
    });
});


app.post('/reset-password', (req, res) => {
    const { token, password } = req.body;

    try {
        // Verify JWT token
        const decoded = jwt.verify(token, JWT_SECRET_KEY);
        const email = decoded.email;

        // Update password in the database
        const hashedPassword = bcrypt.hashSync(password, 10);
        const sql = "UPDATE login SET password = ?, otp = NULL, otp_expires = NULL WHERE email = ?";
        db.query(sql, [hashedPassword, email], (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Failed to update password' });
            }

            res.status(200).json({ message: 'Password reset successfully' });
        });
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: 'Invalid or expired token' });
    }
});

// Start the server
const PORT = 8081;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

