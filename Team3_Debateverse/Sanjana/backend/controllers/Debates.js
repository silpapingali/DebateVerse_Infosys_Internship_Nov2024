const express = require("express");
const debatesModel = require("../models/debatesModel");

const AllDebates = async (req, res) => {
  const { page } = req.query;
  const skip = (page - 1) * 10;
  try {
    const totalRecords = await debatesModel.countDocuments();
    const totalPages = Math.ceil(totalRecords / 10);
    const debates = await debatesModel
      .find({})
      .skip(skip)
      .limit(10)
      .sort({ createdOn: -1 });
    res.status(200).json({ totalPages, debates });
  } catch (err) {
    res.status(400).json({ message: "Server error ! Try again later" });
  }
};

const GetDebatesbyId = async (req, res) => {
  const { userid, page } = req.query;
  const skip = (page - 1) * 10;
  console.log(userid);
  try {
    const totalRecords = await debatesModel.countDocuments();
    const totalPages = Math.ceil(totalRecords / 10);
    const debates = await debatesModel
      .find({ createdBy: userid })
      .skip(skip)
      .limit(10)
      .sort({ createdOn: -1 });
    res.status(200).json({ totalPages, debates });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Server error ! Please try again later" });
  }
};

const CreateDebate = async (req, res) => {
  const debateData = req.body;
  console.log(debateData);
  try {
    const debate = new debatesModel(debateData);
    await debate.save();
    res.status(200).json({ message: "Success ! Debate created" });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Server error ! Try after sometime" });
  }
};

module.exports = { AllDebates, CreateDebate, GetDebatesbyId };