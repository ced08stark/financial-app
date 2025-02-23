import { Request, Response } from 'express';
import User from '../models/user';
import Group from '../models/group';
import Post from '../models/post';
import Message from '../models/message';
import mongoose from 'mongoose';
import { authMiddleware } from '../middlewares/verifyToken';

// Get user statistics
export const getUserStatistics = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id; // Assuming you have middleware to extract userId from the token

    const user = await User.findById(userId);
    if (!user) {
       res.status(404).json({ message: 'User not found' });
       return;
    }

    const postsCount = await Post.countDocuments({ author: userId });
    const messagesCount = await Message.countDocuments({ $or: [{ sender: userId }, { receiver: userId }] });
    const groupsCount = await Group.countDocuments({ members: userId });

    const statistics = {
      postsCount,
      messagesCount,
      groupsCount,
    };

    res.status(200).json(statistics);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user statistics', error });
  }
};

// Get group statistics
export const getGroupStatistics = async (req: Request, res: Response): Promise<void> => {
  try {
    const groupId = req.params.groupId;
    const userId = req.user?.id;

    if (!userId || !mongoose.isValidObjectId(userId)) {
          res.status(400).json({ message: 'Invalid author ID' });
          return;
       }
    
       // Convertissez authorId en ObjectId
       const objectIdUserId = new mongoose.Types.ObjectId(userId);

    const group = await Group.findById(groupId);
    if (!group) {
       res.status(404).json({ message: 'Group not found' });
       return;
    }

    // Check if the user is a member of the group
    if (!group.members.includes(objectIdUserId)) {
       res.status(403).json({ message: 'You are not a member of this group' });
       return;
    }

    const postsCount = await Post.countDocuments({ group: groupId });
    const messagesCount = await Message.countDocuments({ group: groupId });
    const membersCount = group.members.length;

    const statistics = {
      postsCount,
      messagesCount,
      membersCount,
    };

    res.status(200).json(statistics);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching group statistics', error });
  }
};

// Get global statistics (for admin only)
export const getGlobalStatistics = async (req: Request, res: Response): Promise<void> => {
  try {
    const usersCount = await User.countDocuments();
    const groupsCount = await Group.countDocuments();
    const postsCount = await Post.countDocuments();
    const messagesCount = await Message.countDocuments();

    const statistics = {
      usersCount,
      groupsCount,
      postsCount,
      messagesCount,
    };

    res.status(200).json(statistics);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching global statistics', error });
  }
};