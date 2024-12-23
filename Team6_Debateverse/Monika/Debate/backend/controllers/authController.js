const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');
const crypto = require('crypto');


dotenv.config();


// Signup Logic
exports.signup = async (req, res) => {
    const { email, password } = req.body;

    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error' });

        if (results.length > 0)
            return res.status(400).json({ message: 'Email already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);

        db.query(
            'INSERT INTO users (email, password) VALUES (?, ?)',
            [email, hashedPassword],
            (err) => {
                if (err)
                    return res.status(500).json({ message: 'Error inserting user' });
                res.status(201).json({ message: 'User registered successfully' });
            }
        );
    });
};

// Login Logic
exports.login = (req, res) => {
    const { email, password } = req.body;

    // Validate email and password presence
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  // Query to find the user by email
  db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const user = results[0];

    // Compare the entered password with the hashed password in the database
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        return res.status(500).json({ message: 'Error comparing passwords' });
      }

      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }

      // Password is correct, generate JWT token
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        JWT_SECRET_KEY,
        { expiresIn: '1h' }
      );

      // Send back the token
      res.status(200).json({ message: 'Login successful', token });
    });
  });
};
  
  
  // Forgot Password Route (OTP Generation)
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  // Validate email
  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    // Generate OTP and expiry time
    const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
    const otpHash = crypto.createHash('sha256').update(otp.toString()).digest('hex'); // Hash OTP
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

    // Save OTP to database
    const saveOtpQuery = "INSERT INTO otp (email, otp, otp_expires, used) VALUES (?, ?, ?, FALSE) ON DUPLICATE KEY UPDATE otp=?, otp_expires=?, used=FALSE";
    await db.query(saveOtpQuery, [email, otpHash, otpExpires, otpHash, otpExpires]);

    // Configure nodemailer (Use environment variables for security)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // Use app password or OAuth2 for Gmail
      },
    });

    // Send OTP via email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset OTP',
      text: `Your OTP for password reset is: ${otp}. It is valid for 10 minutes.`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'OTP sent to your email' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to send OTP', error: error.message });
  }
};
    


exports.verifyOtp =async (req, res) => {
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
}




exports.resetPassword = async (req, res) => {
  const { token, password } = req.body;

  if (!token || !password) {
    return res.status(400).json({ message: 'Token and new password are required' });
  }

  try {
    // Verify JWT token
    const decoded = jwt.verify(token, JWT_SECRET_KEY);
    const email = decoded.email;

    // Hash the new password securely
    const hashedPassword = await bcrypt.hash(password, 12);

    // Update the password in the database
    const updatePasswordQuery = "UPDATE users SET password = ? WHERE email = ?";
    await db.query(updatePasswordQuery, [hashedPassword, email]);

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Invalid or expired token', error: error.message });
  }
}
  

