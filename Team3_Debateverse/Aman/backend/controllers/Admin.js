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

const fetchUserStatus = async (req, res) => {
  const { userEmail } = req.body;

  try {
    const user = await usersModel.findOne({ email: userEmail }, { status: 1 });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User found", status: user.status });
  } catch (err) {
    res.status(400).json({ message: "Server error ! Try again later" });
  }
};

const blockUser = async (req, res) => {
  const { userEmail } = req.body;
  console.log(userEmail);
  try {
    const user = await usersModel.findOneAndUpdate(
      { email: userEmail },
      { status: "blocked" }
    );
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    console.log(user);
    res.status(200).json({ message: "User blocked !" });
  } catch (err) {
    res.status(400).json({ message: "Server error ! Try again later" });
  }
};

const activateUser = async (req, res) => {
  const { userEmail } = req.body;
  try {
    const user = await usersModel.findOneAndUpdate(
      { email: userEmail },
      { status: "active" }
    );
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User activated !" });
  } catch (err) {
    res.status(400).json({ message: "Server error ! Try again later" });
  }
};

const fetchAllUsers = async (req, res) => {
  try {
    const users = await usersModel.find({ role: { $ne: "admin" } }, { status: 1, email: 1 });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
};

module.exports = {
  AllDebates,
  Stats,
  fetchUserStatus,
  blockUser,
  activateUser,
  fetchAllUsers
};
