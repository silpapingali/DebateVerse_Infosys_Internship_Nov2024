const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAILER_EMAIL,
    pass: process.env.MAILER_PASSWORD,
  },
});

const verifyMail = async (email) => {
  console.log("in mailer", email);
  try {
    const token = jwt.sign({email}, process.env.JWT_SECRET, { expiresIn: "10m" });
    //use env
    const url = `http://localhost:3000/api/auth/register/verify?token=${token}`;
    await transporter.sendMail({
      from: `"DebateHub Support" <${process.env.MAILER_EMAIL}>`,
      to: email,
      subject: "Verify your email",
      html: `<a href=${url}>Click here<a/> to verify your email. Verification link will be expire in 10 minutes.`,
    });
    return true;
  } catch (err) {
    console.log("err in mailer");
    return false;
  }
};

const resetMail = async (email) => {
  console.log("in mailer", email);
  try {
    const token = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: "10m",
    });
    const url = `http://localhost:5173/resetpassword?token=${token}`;
    await transporter.sendMail({
      from: `"DebateHub Support" <${process.env.MAILER_EMAIL}>`,
      to: email,
      subject: "Reset your password",
      html: `Click on the button to reset your password <a href=${url}>Reset Password<a/> .This link will be valid for 10 minutes.`,
    });
    return true;
  } catch (err) {
    return false;
  }
};

module.exports = { verifyMail, resetMail };
