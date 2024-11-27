const express = require("express");
const debateModel = require("../models/debatesModel");

const Debatelist = async (req, res) => {
  const latestDebates = await res
    .status(200)
    .json({ message: "this debatelist route" });
};

const getDebatesbyId = async (req, res) => {
  const { userid } = req.query;

  try {
  } catch (err) {}
};

const CreateDebate = async (req, res) => {
  const debateData = req.body;
  console.log(debateData);
  try {
    const debate = new debateModel(debateData);
    await debate.save();
    res.status(200).json({ message: "received" });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "error" });
  }
};

module.exports = { Debatelist, CreateDebate };
