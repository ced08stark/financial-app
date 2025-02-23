import { Request, Response } from 'express';
import User from '../models/user';
import { authMiddleware } from '../middlewares/verifyToken';

// Get user profile
export const getUserProfile = async (req: Request, res: Response) : Promise<void> => {
  try {
    const userId = req.user?.id; // Assuming you have middleware to extract userId from the token

    const user = await User.findById(userId).select('-password -refreshToken');
    if (!user) {
       res.status(404).json({ message: 'User not found' });
       return;
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user profile', error });
  }
};

// Update user profile
export const updateUserProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const updates = req.body;

    const user = await User.findByIdAndUpdate(userId, updates, { new: true }).select('-password -refreshToken');
    if (!user) {
       res.status(404).json({ message: 'User not found' });
       return;
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error updating user profile', error });
  }
};

// Delete user profile
export const deleteUserProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;

    const user = await User.findByIdAndDelete(userId);
    if (!user) {
       res.status(404).json({ message: 'User not found' });
       return;
    }

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user profile', error });
  }
};

// Get all users (for admin only)
export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find().select('-password -refreshToken');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error });
  }
};

// Get user by ID (for admin only)
export const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.params.id).select('-password -refreshToken');
    if (!user) {
       res.status(404).json({ message: 'User not found' });
       return;
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user', error });
  }
};

// Update user by ID (for admin only)
export const updateUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password -refreshToken');
    if (!user) {
       res.status(404).json({ message: 'User not found' });
       return;
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error updating user', error });
  }
};

// Delete user by ID (for admin only)
export const deleteUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
       res.status(404).json({ message: 'User not found' });
       return;
    }

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error });
  }
};

// Update user preferences
export const updateUserPreferences = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { language, notifications } = req.body;

    const user = await User.findById(userId);
    if (!user) {
       res.status(404).json({ message: 'User not found' });
       return;
    }

    user.preferences = { language, notifications };
    await user.save();

    res.status(200).json(user.preferences);
  } catch (error) {
    res.status(500).json({ message: 'Error updating user preferences', error });
  }
};

// Get user groups
export const getUserGroups = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.body.userId;

    const user = await User.findById(userId).populate('groups');
    if (!user) {
       res.status(404).json({ message: 'User not found' });
       return;
    }

    res.status(200).json(user.groups);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user groups', error });
  }
};