const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const { email, emailPassword, jwtSecret } = require("../config");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: email,
    pass: emailPassword,
  },
});

const sendVerificationEmail = async (user) => {
  const token = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: "1h" });
  const verificationUrl = `http://localhost:5000/api/auth/verify-email?token=${token}`;

  const mailOptions = {
    from: email,
    to: user.email,
    subject: "Verify Your Email",
    html: `<p>Click <a href="${verificationUrl}">here</a> to verify your email.</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Verification email sent to:", user.email);
  } catch (err) {
    console.error("Error sending email:", err);
  }
};

module.exports = { sendVerificationEmail };
