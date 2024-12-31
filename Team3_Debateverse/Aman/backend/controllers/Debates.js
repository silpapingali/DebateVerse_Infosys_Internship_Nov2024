const debatesModel = require("../models/debatesModel");
const likesModel = require("../models/likesModel");
const votesModel = require("../models/votesModel");

const AllDebates = async (req, res) => {
  console.log(req.body);

  const createdBy = req.user.email.split("@")[0];
  const { userId } = req.user;
  const { page = 1, isExact, votes, likegt, date, searchQuery } = req.body;
  console.log(req.body);
  const skip = (page - 1) * 10;
  let filters = {
    createdBy: { $ne: createdBy },
    status: { $ne: "closed" },
  };
  if (votes) {
    filters.totalVotes = { $gte: votes };
  }
  if (likegt) {
    filters.totalLikes = { $gte: likegt };
  }
  if (date) {
    filters.createdOn = { $gte: new Date(date) };
  }
  if (searchQuery) {
    const queryRegex = isExact ? `^${searchQuery}$` : `^${searchQuery}`;
    filters["question"] = { $regex: queryRegex, $options: "i" };
  }

  try {
    const totalRecords = await debatesModel.countDocuments(filters);
    const debates = await debatesModel
      .find(filters)
      .skip(skip)
      .limit(10)
      .sort({ createdOn: -1 });

    const likes = await Promise.all(
      debates.map(async (debate) => {
        const like = await likesModel.findOne({ debateId: debate._id, userId });
        return like ? true : false;
      })
    );

    res.status(200).json({ totalRecords, debates, likes });
  } catch (err) {
    res.status(400).json({ message: "Server error! Try again later." });
  }
};

const MyDebates = async (req, res) => {
  const createdBy = req.user.email.split("@")[0];
  const { page } = req.query;
  const skip = (page - 1) * 10;
  try {
    const totalRecords = await debatesModel.countDocuments({ createdBy });
    const debates = await debatesModel
      .find({ createdBy })
      .skip(skip)
      .limit(10)
      .sort({ createdOn: -1 });
    res.status(200).json({ totalRecords, debates });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Server error ! Please try again later" });
  }
};

const CreateDebate = async (req, res) => {
  const { question, options } = req.body;
  const createdBy = req.user.email.split("@")[0];
  console.log(createdBy);

  try {
    const debateData = new debatesModel({
      question,
      options: options.map((data, i) => ({ answer: data })),
      createdOn: new Date(),
      createdBy,
    });
    await debateData.save();
    res.status(200).json({ message: "Success ! Debate created" });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Server error ! Try after sometime" });
  }
};

const LikeDebate = async (req, res) => {
  const { debateId } = req.query;
  const { userId } = req.user;
  try {
    const liked = await likesModel.findOne({ debateId, userId });
    if (!liked) {
      await likesModel.create({ userId, debateId });
      await debatesModel.findByIdAndUpdate(debateId, {
        $inc: { totalLikes: 1 },
      });
      return res.json({ message: "liked" });
    }
    await likesModel.deleteOne(liked);
    await debatesModel.findByIdAndUpdate(debateId, {
      $inc: { totalLikes: -1 },
    });
    res.status(200).json({ message: "disliked" });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "server error" });
  }
};

const VoteDebate = async (req, res) => {
  const { debateId, votes } = req.body;
  const { userId } = req.user;
  console.log(votes);
  try {
    const debate = await debatesModel.findById(debateId);
    if (!debate) {
      return res.status(400).json({ message: "Debate not found" });
    }
    debate.options.forEach((option, index) => {
      option.votes += votes[index];
    });
    debate.totalVotes+=10;
    await debate.save()
    const newVote = new votesModel({
      userId,
      debateId,
      votes: votes,
    });
    await newVote.save();;
    res.status(200).json({ message: "Votes Casted Successfully !" });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Server error" });
  }
};

const FetchVotes = async (req, res) => {
  const { debateId } = req.query;
  const { userId } = req.user;
  console.log(debateId, userId);
  try {
    const vote = await votesModel.findOne({ debateId, userId });
    console.log(vote);
    if (!vote) {
      return res.status(200).json({ votes: [] });
    }
    res.status(200).json({ votes: vote.votes });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Server error" });
  }
} 

module.exports = {
  AllDebates,
  CreateDebate,
  MyDebates,
  LikeDebate,
  VoteDebate,
  FetchVotes,
};
