const express = require("express");
const { register, login, verifyEmail } = require("../controllers/authController");
const { validateRegistration } = require("../middlewares/validate");

const router = express.Router();

router.post("/register", validateRegistration, register);
router.post("/login", login);
router.get("/verify-email", verifyEmail);

module.exports = router;
