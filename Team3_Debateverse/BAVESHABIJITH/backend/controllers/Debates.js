const debatesModel = require("../models/debatesModel");
const likesModel = require("../models/likesModel");

const AllDebates = async (req, res) => {
  //null checks
  const createdBy = req.user.email.split("@")[0];
  const { userId } = req.user;
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
    // console.log(debates);

    const likes = await Promise.all(
      debates.map(async (val) => {
        const like = await likesModel.findOne({ debateId: val._id, userId });
        return like ? true : false;
      })
    );
    // console.log(likes);
    res.status(200).json({ totalRecords, debates, likes });
  } catch (err) {
    res.status(400).json({ message: "Server error ! Try again later" });
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
  console.log(debateId, userId);
  try {
    const liked = await likesModel.findOne({ debateId, userId });
    if (!liked) {
      await likesModel.create({ userId, debateId });
      await debatesModel.findByIdAndUpdate(debateId, {$inc:{totalLikes: 1}});
      return res.json({ message: "liked" });
    }
    await likesModel.deleteOne(liked);
    await debatesModel.findByIdAndUpdate(debateId,{$inc : {totalLikes: -1}});
    res.status(200).json({ message: "disliked" });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "server error" });
  }
};

module.exports = { AllDebates, CreateDebate, MyDebates, LikeDebate };
