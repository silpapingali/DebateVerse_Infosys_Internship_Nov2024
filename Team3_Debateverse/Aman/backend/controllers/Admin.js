const debatesModel = require("../models/debatesModel");
const usersModel = require("../models/usersModel");

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
  const createdBy = userEmail.split("@")[0];
  try {
    const user = await usersModel.findOneAndUpdate(
      { email: userEmail },
      { status: "blocked" }
    );
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    await debatesModel.updateMany({ createdBy }, { status: "closed" });
    res.status(200).json({ message: "User blocked !" });
  } catch (err) {
    res.status(400).json({ message: "Server error ! Try again later" });
  }
};

const activateUser = async (req, res) => {
  const { userEmail } = req.body;
  const createdBy = userEmail.split("@")[0];
  try {
    const user = await usersModel.findOneAndUpdate(
      { email: userEmail },
      { status: "active" }
    );
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    await debatesModel.updateMany({ createdBy }, { status: "open" });
    res.status(200).json({ message: "User activated !" });
  } catch (err) {
    res.status(400).json({ message: "Server error ! Try again later" });
  }
};

const fetchAllUsers = async (req, res) => {
  const { searchQuery = "" } = req.query;
  try {
    let query = { role: { $ne: "admin" } };
    if (searchQuery) {
      query.email = { $regex: `^${searchQuery}`, $options: "i" };
    }
    const users = await usersModel.find(query, { status: 1, email: 1 });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users !" });
  }
};

const closedDebate = async (req, res) => {
  const { debateId, status } = req.body;
  try {
    const debate = await debatesModel.findByIdAndUpdate(
      debateId,
      { status },
      { new: true }
    );
    if (!debate) {
      return res.status(404).json({ message: "Debate not found !" });
    }
    res.status(200).json({ message: "Debate successfully Closed !" });
  } catch (error) {
    res.status(500).json({ message: "Server error ! Please try again later." });
  }
};

const removeOption = async (req, res) => {
  const { debateId, idx } = req.body;
  console.log(idx);
  try {
    const debate = await debatesModel.findById(debateId);
    if (!debate || !debate.options || !debate.options[idx]) {
      return res.status(404).json({ message: "Debate or option not found" });
    }
    debate.options[idx].isRemoved = !debate.options[idx].isRemoved;
    await debate.save();
    res
      .status(200)
      .json({ message: "Option status toggled successfully", debate });
  } catch (error) {
    res.status(500).json({ message: "Error toggling option status", error });
  }
};

module.exports = {
  Stats,
  fetchUserStatus,
  blockUser,
  activateUser,
  fetchAllUsers,
  closedDebate,
  removeOption,
};
