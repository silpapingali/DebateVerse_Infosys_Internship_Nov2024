const Debate = require('../models/Debate'); // Assuming you have a Debate model

// Search for debates based on the question or answer options
exports.searchDebates = async (req, res) => {
  const { query } = req.body; // Get the query from the request body

  try {
    // Using regex to search for debates where the question or answer matches the query (case-insensitive)
    const debates = await Debate.find({
      $or: [
        { question: { $regex: query, $options: 'i' } }, // Searching question
        { "options.answer": { $regex: query, $options: 'i' } } // Searching within options.answer
      ]
    }).exec();

    if (debates.length === 0) {
      return res.status(404).json({ message: 'No debates found' });
    }

    res.status(200).json(debates); // Return the found debates
  } catch (error) {
    res.status(500).json({ message: 'Error fetching debates', error });
  }
};
