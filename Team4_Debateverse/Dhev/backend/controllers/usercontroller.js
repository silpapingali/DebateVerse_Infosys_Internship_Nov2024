import {User} from '../models/user.model.js';
import Debate from '../models/debate.js';

// Get all users
export const getUsers = async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: 'admin' } });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Suspend or activate a user
export const toggleUserStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
  
    try {
      const user = await User.findById(id);
      const updatedUser = await User.findByIdAndUpdate(id, { status }, { new: true });
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
      if (status === 'suspended') {
        await Debate.updateMany({ createdBy: user.name }, { isActive: false });
      }
      if (status === 'active') {
        await Debate.updateMany({ createdBy: user.name }, { isActive: true });
      }
      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(500).json({ message: 'Error updating user status' });
    }
  };
  


