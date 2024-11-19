const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../config");

const generateToken = (payload, expiresIn = "1h") => {
  return jwt.sign(payload, jwtSecret, { expiresIn });
};

module.exports = { generateToken };
