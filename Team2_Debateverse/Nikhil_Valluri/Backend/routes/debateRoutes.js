const express = require("express");
const { createDebate, joinDebate } = require("../controllers/debateController");
const authenticateJWT = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/create", authenticateJWT, createDebate);
router.post("/join/:id", authenticateJWT, joinDebate);

module.exports = router;
