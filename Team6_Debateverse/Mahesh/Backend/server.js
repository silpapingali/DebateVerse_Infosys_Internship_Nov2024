const express = require("express");
const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

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

        // Compare the password with the stored hash
        bcrypt.compare(password, data[0].password, (err, match) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: "An error occurred during password comparison." });
            }

            if (!match) {
                return res.status(400).json({ message: "Invalid email or password." });
            }

            // Generate JWT token
            const token = jwt.sign(
                { email: data[0].email, role: data[0].role },
                'your_secret_key', // Use an environment variable for the secret key in production
                { expiresIn: '1h' }
            );

            return res.status(200).json({ message: "Login successful", token });
        });
    });
});

// Signup route
app.post('/signup', (req, res) => {
    const { email, password, role } = req.body;

    // Check if the email already exists
    const checkEmailSql = "SELECT * FROM user1 WHERE email = ?";
    db.query(checkEmailSql, [email], (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "An error occurred while checking the email." });
        }

        if (data.length > 0) {
            return res.status(400).json({ message: "User already exists with this email." });
        }

        // Hash password
        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: "An error occurred while hashing the password." });
            }

            // Insert new user with hashed password and selected role
            const insertSql = "INSERT INTO user1 (id, email, password, role) VALUES (UUID(), ?, ?, ?)";
            const values = [email, hashedPassword, role];

            db.query(insertSql, values, (err, data) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ error: "An error occurred while saving the data." });
                }

                // Generate JWT with role
                const token = jwt.sign({ email, role }, 'your_jwt_secret_key', { expiresIn: '1h' });

                return res.status(200).json({ message: "User registered successfully", token });
            });
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
        const expiresAt = new Date(Date.now() + 3600000); // Token valid for 1 hour

        const insertResetRequestSql = "INSERT INTO password_reset_requests (id, email, token, expires_at) VALUES (UUID(), ?, ?, ?)";
        db.query(insertResetRequestSql, [email, token, expiresAt], (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: "Failed to create reset request." });
            }

            // Send the reset link (replace this with actual email-sending logic)
            console.log(`Password reset link: http://localhost:3000/reset-password/${token}`);
            res.status(200).json({ message: "Password reset link sent to email." });
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
