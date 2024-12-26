import Debate from "../models/debate.js";

// Create a new debate
export const createDebate = async (req, res) => {
  try {
    const { title, description, options, createdBy } = req.body;

    // Create a new debate instance
    const newDebate = new Debate({
      title,
      description,
      createdBy: createdBy || "Anonymous",
      options: options.map((text) => ({
        text,
        votes: 0,
      })),
    });

    // Save the debate to the database
    await newDebate.save();

    res.status(201).json({
      success: true,
      message: "Debate created successfully",
      debate: newDebate,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: "error" });
  }
};

export const getDebate = async (req, res) => {
    try {
        const debates = await Debate.find();
        res.json(debates);
      } catch (error) {
        res.status(500).json({ message: "Error fetching debates" });
      }
    
};


export const getDebateById = async (req, res) => {
  try {
    const debate = await Debate.findById(req.params.id);
    if (!debate) return res.status(404).json({ error: 'Debate not found' });
    res.json(debate);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
export const voteOption = async (req, res) => {
  const { optionId, isUpvote } = req.body;
  try {
    const debate = await Debate.findById(req.params.id);
    if (!debate) return res.status(404).json({ error: 'Debate not found' });

    const option = debate.options.id(optionId);
    if (!option) return res.status(404).json({ error: 'Option not found' });

    if (isUpvote) {
      option.votes += 1;
    } else {
      option.votes = Math.max(option.votes - 1, 0);
    }

    await debate.save();
    res.json(debate);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const likeDebate = async (req, res) => {
  try {
    const debate = await Debate.findById(req.params.id);
    if (!debate) return res.status(404).json({ error: 'Debate not found' });

    debate.likes += 1;
    await debate.save();
    res.json(debate);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};