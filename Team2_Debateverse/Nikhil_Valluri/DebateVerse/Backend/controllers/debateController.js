const Debate = require("../models/debate");
const User = require("../models/user");

const createDebate = async (req, res) => {
  const { title, description } = req.body;
  try {
    const debate = await Debate.create({
      title,
      description,
      participants: [req.user.id],
    });
    res.status(201).json({ message: "Debate created successfully", debate });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const joinDebate = async (req, res) => {
  const debateId = req.params.id;
  try {
    const debate = await Debate.findById(debateId);
    if (!debate) return res.status(404).json({ message: "Debate not found" });

    if (debate.participants.includes(req.user.id)) {
      return res.status(400).json({ message: "You have already joined this debate" });
    }

    debate.participants.push(req.user.id);
    await debate.save();

    res.status(200).json({ message: "Successfully joined the debate", debate });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = { createDebate, joinDebate };
