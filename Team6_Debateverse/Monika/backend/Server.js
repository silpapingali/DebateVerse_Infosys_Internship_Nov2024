const express = require("express");
const mysql = require("mysql");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Database connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "signup",
});

db.connect((err) => {
    if (err) {
        console.error("Database connection failed:", err.stack);
        return;
    }
    console.log("Connected to the database.");
});

// Nodemailer Configuration
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
    },
});

// Helper function to send OTP
const sendOTP = async (email, otp) => {
    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: "Your OTP for Password Reset",
        text: `Your OTP is ${otp}. It is valid for 5 minutes.`,
    };
    return transporter.sendMail(mailOptions);
};

// Login Route
app.post("/login", (req, res) => {
    const { email, password } = req.body;

    const query = "SELECT * FROM login WHERE email = ?";
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

            if (data[0].status === "confirmed") {
                const token = jwt.sign(
                    { email: data[0].email, role: data[0].role },
                    process.env.JWT_SECRET,
                    { expiresIn: "1h" }
                );

                return res.status(200).json({ message: "Login successful", token });
            } else if (data[0].status === "pending") {
                return res.status(400).json({ message: "Registration incomplete. Please confirm your email." });
            } else {
                return res.status(500).json({ message: "An unknown error occurred." });
            }
        });
    });
});

// Signup Route
app.post("/signup", (req, res) => {
    const { email, password, role } = req.body;

    const checkEmailSql = "SELECT * FROM login WHERE email = ?";
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

            const userId = require("crypto").randomUUID();
            const insertSql = "INSERT INTO login (id, email, password, role, status) VALUES (?, ?, ?, ?, 'pending')";
            db.query(insertSql, [userId, email, hashedPassword, role], (err) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ error: "An error occurred while saving the data." });
                }

                const token = require("crypto").randomBytes(16).toString("hex");
                const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now
                const insertTokenSql =
                    "INSERT INTO confirmation_requests (id, email, token, expires_at) VALUES (UUID(), ?, ?, ?)";
                db.query(insertTokenSql, [email, token, expiresAt], (err) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).json({ error: "Failed to create confirmation request." });
                    }

                    const confirmationLink = `http://localhost:8081/confirm-registration/${token}`;
                    transporter.sendMail({
                        from: process.env.EMAIL,
                        to: email,
                        subject: "Email Confirmation",
                        text: `Click this link to confirm your registration: ${confirmationLink}`,
                    });

                    return res
                        .status(200)
                        .json({ message: "User registered successfully. Please confirm your email." });
                });
            });
        });
    });
});

// Confirm Registration Route
app.get("/confirm-registration/:token", (req, res) => {
    const { token } = req.params;

    const checkTokenSql = "SELECT * FROM confirmation_requests WHERE token = ? AND expires_at > NOW()";
    db.query(checkTokenSql, [token], (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Database error occurred." });
        }

        if (data.length === 0) {
            return res.status(400).json({ message: "Invalid or expired token." });
        }

        const email = data[0].email;

        const updateUserSql = "UPDATE login SET status = 'confirmed' WHERE email = ?";
        db.query(updateUserSql, [email], (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: "Failed to confirm registration." });
            }

            res.redirect(`http://localhost:3000/confirm-registration/${token}?status=success`);
        });
    });
});

// Forgot Password
app.post("/forgot-password", (req, res) => {
    const { email } = req.body;

    db.query("SELECT id FROM login WHERE email = ?", [email], (err, results) => {
        if (err) return res.status(500).send(err);

        if (results.length === 0) {
            return res.status(404).json({ message: "Email not found" });
        }

        const userId = results[0].id;
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

        db.query(
            "INSERT INTO otps (user_id, otp_code, expires_at) VALUES (?, ?, ?)",
            [userId, otp, expiresAt],
            async (err) => {
                if (err) return res.status(500).send(err);

                try {
                    await sendOTP(email, otp);
                    res.json({ message: "OTP sent successfully" });
                } catch (emailError) {
                    res.status(500).json({ message: "Failed to send OTP" });
                }
            }
        );
    });
});

// Reset Password
app.post("/reset-password", (req, res) => {
    const { token, newPassword } = req.body;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;

        bcrypt.hash(newPassword, 10, (err, hash) => {
            if (err) return res.status(500).send(err);

            db.query("UPDATE login SET password = ? WHERE id = ?", [hash, userId], (err) => {
                if (err) return res.status(500).send(err);
                res.json({ message: "Password reset successful" });
            });
        });
    } catch (err) {
        res.status(400).json({ message: "Invalid or expired token" });
    }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
