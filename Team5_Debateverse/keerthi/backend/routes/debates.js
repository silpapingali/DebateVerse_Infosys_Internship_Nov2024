const express = require("express");
const router = express.Router();
const Debate = require("../models/Debate");

// Create a new debate
router.post("/create", async (req, res) => {
  const { title, options } = req.body;

  if (!title || !options || options.length < 2) {
    return res.status(400).json({ error: "Title and at least two options are required" });
  }

  try {
    const newDebate = new Debate({
      title,
      options: options.map(option => ({ text: option })),
    });

    await newDebate.save();
    res.status(201).json({ message: "Debate created successfully", debate: newDebate });
  } catch (error) {
    res.status(500).json({ error: "Failed to create debate" });
  }
});

// Get all debates
router.get("/", async (req, res) => {
  try {
    const debates = await Debate.find();
    res.json(debates);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch debates" });
  }
});

module.exports = router;
