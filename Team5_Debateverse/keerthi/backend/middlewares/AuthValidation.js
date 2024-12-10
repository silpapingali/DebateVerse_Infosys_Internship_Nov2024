const { body, validationResult } = require("express-validator");

const RegisterValidate = [
  body("email").isEmail().withMessage("Invalid email format !"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long !"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ inputerrors: errors.array() });
    }
    next();
  },
];

const ResetPasswordValidate = [
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long !"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ inputerrors: errors.array() });
    }
    next();
  },
];

module.exports = { RegisterValidate, ResetPasswordValidate };