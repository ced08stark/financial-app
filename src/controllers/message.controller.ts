import { Request, Response } from 'express';
import Message from '../models/message';
import User from '../models/user';
import Group from '../models/group';
import mongoose from 'mongoose';
import { authMiddleware } from '../middlewares/verifyToken';

// Send a message to a group or a user
export const sendMessage = async (req: Request, res: Response) : Promise<void> => {
  try {
    const { content, receiverId, groupId } = req.body;
    const senderId = req.user?.id; // Assuming you have middleware to extract userId from the token

     // Vérifiez que authorId est une chaîne de caractères valide
    if (!senderId || !mongoose.isValidObjectId(senderId)) {
       res.status(400).json({ message: 'Invalid author ID' });
       return;
    }

    // Convertissez authorId en ObjectId
    const objectIdSenderId = new mongoose.Types.ObjectId(senderId);

    const sender = await User.findById(senderId);
    if (!sender) {
       res.status(404).json({ message: 'Sender not found' });
       return;
    }

    // Check if the message is sent to a group or a user
    if (groupId) {
      const group = await Group.findById(groupId);
      if (!group) {
         res.status(404).json({ message: 'Group not found' });
         return;
      }

      // Check if the sender is a member of the group
      if (!group.members.includes(objectIdSenderId)) {
         res.status(403).json({ message: 'You are not a member of this group' });
         return;
      }

      const message = new Message({
        sender: senderId,
        content,
        group: groupId,
      });

      await message.save();
      res.status(201).json(message);
    } else if (receiverId) {
      const receiver = await User.findById(receiverId);
      if (!receiver) {
         res.status(404).json({ message: 'Receiver not found' });
         return;
      }

      const message = new Message({
        sender: senderId,
        receiver: receiverId,
        content,
      });

      await message.save();
      res.status(201).json(message);
    } else {
       res.status(400).json({ message: 'Either receiverId or groupId must be provided' });
       return;
    }
  } catch (error) {
    res.status(500).json({ message: 'Error sending message', error });
  }
};

// Get messages for a group
export const getGroupMessages = async (req: Request, res: Response) : Promise<void> => {
  try {
    const groupId = req.params.groupId;
    const userId = req.user?.id;

    // Vérifiez que authorId est une chaîne de caractères valide
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

    const messages = await Message.find({ group: groupId })
      .populate('sender', 'firstName lastName')
      .sort({ createdAt: 1 }); // Sort by creation date

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching group messages', error });
  }
};

// Get messages between two users
export const getUserMessages = async (req: Request, res: Response): Promise<void> => {
  try {
    const receiverId = req.params.receiverId;
    const senderId = req.user?.id;

    const messages = await Message.find({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId },
      ],
    })
      .populate('sender', 'firstName lastName')
      .populate('receiver', 'firstName lastName')
      .sort({ createdAt: 1 }); // Sort by creation date

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user messages', error });
  }
};

// Delete a message
export const deleteMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const messageId = req.params.messageId;
    const userId = req.user?.id;

    const message = await Message.findById(messageId);
    if (!message) {
       res.status(404).json({ message: 'Message not found' });
       return;
    }

    // Check if the user is the sender of the message
    if (message.sender.toString() !== userId) {
       res.status(403).json({ message: 'You are not authorized to delete this message' });
       return;
    }

    await message.deleteOne();
    res.status(200).json({ message: 'Message deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting message', error });
  }
};