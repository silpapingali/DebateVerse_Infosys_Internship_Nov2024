const Debate = require('../models/Debate');

// Create Debate
exports.createDebate = async (req, res) => {
  const { question, options } = req.body;
  const userId = req.user.userId;

  try {
    const debate = new Debate({
      userId,
      question,
      options: options.map((option) => ({ text: option })),
    });

    await debate.save();
    res.status(201).json({ message: 'Debate created successfully', debate });
  } catch (error) {
    console.error('Error creating debate:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get Debates for User
exports.getDebates = async (req, res) => {
  const userId = req.user.userId;

  try {
    const debates = await Debate.find({ userId });
    res.status(200).json(debates);
  } catch (error) {
    console.error('Error fetching debates:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
