const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configuration
const DB_HOST = "localhost";
const DB_USER = "root";
const DB_PASSWORD = "";
const DB_NAME = "signup";
const JWT_SECRET_KEY = "f53164bbd2e0ba3c94646afeffcbf2a1451cac38305c5d0ed9433d43ba02e326f6a62bef0c1fab65d07deb961677033dc0b26e4e79626e86220ab8561a1c75f5";
const EMAIL_USER = "vsanthiyakumar364@gmail.com";
const EMAIL_PASS = "#santy472";

// Database connection
const db = mysql.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
});

db.connect((err) => {
    if (err) {
        console.error("Database connection failed:", err.stack);
        return;
    }
    console.log("Connected to the database");
});

// Nodemailer configuration
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
    },
});

// Signup Route
app.post("/signup", (req, res) => {
    const { name, email, password, role } = req.body;

    if (role !== "user" && role !== "admin") {
        return res.status(400).json({ message: 'Invalid role. Choose either "user" or "admin".' });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const sql = "INSERT INTO login (name, email, password, role) VALUES (?)";
    const values = [name, email, hashedPassword, role];

    db.query(sql, [values], (err) => {
        if (err) {
            console.error("Error inserting data:", err);
            return res.status(500).json({ message: "Error during signup" });
        }
        return res.status(201).json({ message: "Signup successful" });
    });
});

// Login Route
app.post("/login", (req, res) => {
    const { email, password } = req.body;

    const sql = "SELECT * FROM login WHERE email = ?";
    db.query(sql, [email], (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ message: "Database error" });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        const user = results[0];
        const isPasswordValid = bcrypt.compareSync(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid password" });
        }

        const token = jwt.sign({ email: user.email, role: user.role }, JWT_SECRET_KEY, { expiresIn: "1h" });
        res.status(200).json({ message: "Login successful", token });
    });
});

// Forgot Password Route
app.post("/forgot-password", (req, res) => {
    const { email } = req.body;

    const sql = "SELECT * FROM login WHERE email = ?";
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

            const mailOptions = {
                from: '"Support" <madkine563@gmail.com>',
                to: email,
                subject: "Your OTP for Password Reset",
                text: `Your OTP is ${otp}. It is valid for 10 minutes.`,
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
        const sql = "UPDATE login SET password = ? WHERE email = ?";
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

// Start Server
app.listen(8080, () => {
    console.log("Server is running on http://localhost:8080");
});
