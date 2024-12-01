const debatesModel = require("../models/debatesModel");

const AllDebates = async (req, res) => {
  const createdBy = req.user.email.split("@")[0];
  const { page } = req.query;
  const skip = (page - 1) * 10;
  try {
    const totalRecords = await debatesModel.countDocuments({createdBy: {$ne: createdBy}});
    console.log(totalRecords);
    const debates = await debatesModel
      .find({createdBy: {$ne: createdBy}})
      .skip(skip)
      .limit(10)
      .sort({ createdOn: -1 });
    res.status(200).json({ totalRecords, debates });
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

module.exports = { AllDebates, CreateDebate, MyDebates };
