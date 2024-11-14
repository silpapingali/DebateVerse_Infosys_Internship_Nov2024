const { body, validationResult } = require("express-validator");

const Validate = [
  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters long"),
  body("email").isEmail().withMessage("Invalid email format"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("role")
    .isIn(["user", "admin"])
    .withMessage("Role must be either user or admin"),

  (req, res, next) => {
    const result= validationResult(req);
    if (!result.isEmpty()) {
      return res
        .status(400)
        .json({ errors: result.array(), message: "Invalid input" });
    }
    next();
  },
];

module.exports = { Validate };
