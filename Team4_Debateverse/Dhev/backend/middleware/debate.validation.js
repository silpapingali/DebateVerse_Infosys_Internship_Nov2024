import { body, validationResult } from "express-validator";

// Validation rules
export const debateValidationRules = [
  body("title").notEmpty().withMessage("Title is required"),
  body("description").notEmpty().withMessage("Description is required"),
  body("options")
    .isArray({ min: 2, max: 7 })
    .withMessage("Options must be an array with 2 to 7 items"),
  body("options.*").notEmpty().withMessage("All options must be non-empty"),
];

// Middleware to handle validation results
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
};
