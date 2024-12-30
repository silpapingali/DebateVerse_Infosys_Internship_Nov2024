import Debate from "../models/debate.js";
import mongoose from "mongoose";

// Create a new debate
export const createDebate = async (req, res) => {
  try {
    const { title, description, options, createdBy } = req.body;

    // Create the debate options, each option will have upvotes, downvotes, and userVotes
    const formattedOptions = options.map((text) => ({
      text,
      upvotes: [],   // Initially no upvotes
      downvotes: [], // Initially no downvotes
      userVotes: 0,  // Initially no votes
    }));

    // Create a new debate instance with the provided options
    const newDebate = new Debate({
      title,
      description,
      createdBy: createdBy || "Anonymous",
      options: formattedOptions,
    });

    // Save the debate to the database
    await newDebate.save();

    res.status(201).json({
      success: true,
      message: "Debate created successfully",
      debate: newDebate,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, message: "Error creating debate", error: error.message });
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
 
 
    const { id } = req.params; // Debate ID
    const { optionId, userId, isUpvote } = req.body; // Request payload
  
    try {
      // Fetch the debate document
      const debate = await Debate.findById(id);
      if (!debate) {
        return res.status(404).json({ message: "Debate not found" });
      }
  
      // Find the option by ID
      const option = debate.options.id(optionId);
      if (!option) {
        return res.status(404).json({ message: "Option not found" });
      }
  
      // Validate `userId`
      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }
  
      // Check if the user has already voted for this option
      const userVoteCount = option.upvotes.filter(vote => vote.userId.toString() === userId).length + 
                            option.downvotes.filter(vote => vote.userId.toString() === userId).length;
  
      if (userVoteCount >= 10) {
        return res.status(400).json({ message: "User has already voted 10 times for this debate" });
      }
  
      // Voting Logic: Handling Upvotes and Downvotes
      if (isUpvote) {
        // Find if the user has already upvoted
        const existingUpvote = option.upvotes.find(vote => vote.userId?.toString() === userId);
        if (existingUpvote) {
          existingUpvote.count += 1; // Increment the count
        } else {
          option.upvotes.push({ userId, count: 1 }); // Add a new upvote
        }
  
        // Remove downvote if it exists
        option.downvotes = option.downvotes.filter(vote => vote.userId?.toString() !== userId);
      } else {
        // Find if the user has already downvoted
        const existingDownvote = option.downvotes.find(vote => vote.userId?.toString() === userId);
        if (existingDownvote) {
          existingDownvote.count += 1; // Increment the count
        } else {
          option.downvotes.push({ userId, count: 1 }); // Add a new downvote
        }
  
        // Remove upvote if it exists
        option.upvotes = option.upvotes.filter(vote => vote.userId?.toString() !== userId);
      }
  
      // Increment the `userVotes` counter for the option
      option.userVotes += 1;
  
      // Save the updated debate
      await debate.save();
  
      // Send success response
      res.status(200).json({ message: "Vote updated successfully", debate });
    } catch (err) {
      console.error("Error updating vote:", err);
      res.status(500).json({ message: "Server error", error: err.message });
    }
  };
  

export const likeDebate = async (req, res) => {
  const { userId } = req.body; // Assuming `userId` is sent in the request body
  const { id: debateId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(debateId)) {
    return res.status(400).json({ message: "Invalid debate ID" });
  }

  try {
    const debate = await Debate.findById(debateId);

    if (!debate) {
      return res.status(404).json({ message: "Debate not found" });
    }

    // Check if the user has already liked the debate
    if (debate.likes.includes(userId)) {
      return res.status(400).json({ message: "You have already liked this debate" });
    }

    // Add the user's ID to the likes array
    debate.likes.push(userId);
    await debate.save();

    res.status(200).json({ message: "Debate liked successfully", likes: debate.likes.length });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
export const dislikeDebate = async (req, res) => {
  const { userId } = req.body; // Assuming `userId` is sent in the request body
  const { id: debateId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(debateId)) {
    return res.status(400).json({ message: "Invalid debate ID" });
  }

  try {
    const debate = await Debate.findById(debateId);

    if (!debate) {
      return res.status(404).json({ message: "Debate not found" });
    }

    // Check if the user has already liked the debate
    if (debate.dislikes.includes(userId)) {
      return res.status(400).json({ message: "You have already liked this debate" });
    }

    // Add the user's ID to the likes array
    debate.dislikes.push(userId);
    await debate.save();

    res.status(200).json({ message: "Debate liked successfully", dislikes: debate.dislikes.length });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const closeDebate=async(req,res)=>{
  const {id}=req.params;
  
  try {
     
      const updatedDebate = await Debate.findByIdAndUpdate(id, { isActive:false },{ new: true });
      if (!updatedDebate) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      res.status(200).json(updatedDebate);
    } catch (error) {
      res.status(500).json({ message: 'Error updating user status' });
    }
};

export const closeOption=async(req,res)=>{
  const { debateId, optionId } = req.body;

  try {
    const debate = await Debate.findById(debateId);

    if (!debate) {
      return res.status(404).json({ message: 'Debate not found' });
    }

    const optionIndex = debate.options.findIndex(option => option._id.toString() === optionId);

    if (optionIndex === -1) {
      return res.status(404).json({ message: 'Option not found' });
    }

    // Close the option
    debate.options.splice(optionIndex, 1); // Removes the option from the array
    await debate.save();

    res.status(200).json({ message: 'Option closed successfully', debate });
  } catch (error) {
    console.error('Error closing option:', error);
    res.status(500).json({ message: 'Internal server error' });
  }

};