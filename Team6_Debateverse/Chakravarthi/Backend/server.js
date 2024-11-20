const express = require("express");
const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const nodemailer = require("nodemailer");

const app = express();
app.use(cors());
app.use(express.json());

// Database connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "signup"
});

// Check database connection
db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log('Connected to the database.');
});

// Login route
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
                // Generate JWT token
                const token = jwt.sign(
                    { email: data[0].email, role: data[0].role },
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


// Start server
app.listen(8081, () => {
    console.log("Server is running on port 8081.");
});
