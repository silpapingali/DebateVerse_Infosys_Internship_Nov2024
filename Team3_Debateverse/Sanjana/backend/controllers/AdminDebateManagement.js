const debatesModel = require("../models/debatesModel");
const usersModel = require("../models/usersModel");

const AllDebates = async (req, res) => {
  //   const { userId } = req.user;
  const { page } = req.query;
  const skip = (page - 1) * 10;
  try {
    const totalRecords = await debatesModel.countDocuments({
      createdBy: { $ne: createdBy },
    });
    const debates = await debatesModel
      .find({ createdBy: { $ne: createdBy } })
      .skip(skip)
      .limit(10)
      .sort({ createdOn: -1 });
    res.status(200).json({ totalRecords, debates, likes });
  } catch (err) {
    res.status(400).json({ message: "Server error ! Try again later" });
  }
};
const Stats = async (req, res) => {
  try {
    const openDebates = await debatesModel.countDocuments({ status: "open" });
    const closedDebates = await debatesModel.countDocuments({
      status: "closed",
    });
    const activeUsers = await usersModel.countDocuments({ status: "active" });
    const blockedUsers = await usersModel.countDocuments({ status: "blocked" });
    res
      .status(200)
      .json({ openDebates, closedDebates, activeUsers, blockedUsers });
  } catch (err) {
    res.status(400).json({ message: "Server error ! Try again later" });
  }
};

module.exports = { AllDebates, Stats };