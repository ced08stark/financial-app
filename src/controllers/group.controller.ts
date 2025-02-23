import { Request, Response } from 'express';
import Group from '../models/group';
import User from '../models/user';
import { authMiddleware } from '../middlewares/verifyToken';

// Create a new group
export const createGroup = async (req: Request, res: Response) : Promise<void> => {
  try {
    const { name, description } = req.body;
    const creatorId = req.user?.id; // Assuming you have middleware to extract userId from the token

    const creator = await User.findById(creatorId);
    if (!creator) {
       res.status(404).json({ message: 'User not found' });
       return;
    }

    const group = new Group({
      name,
      description,
      creator: creatorId,
      members: [creatorId], // Add the creator as the first member
    });

    await group.save();

    // Add the group to the creator's list of groups
    creator.groups.push(group.id);
    await creator.save();

    res.status(201).json(group);
  } catch (error) {
    res.status(500).json({ message: 'Error creating group', error });
  }
};

// Get all groups
export const getAllGroups = async (req: Request, res: Response): Promise<void> => {
  try {
    const groups = await Group.find().populate('creator', 'firstName lastName').populate('members', 'firstName lastName');
    res.status(200).json(groups);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching groups', error });
  }
};

// Get group by ID
export const getGroupById = async (req: Request, res: Response) : Promise<void> => {
  try {
    const group = await Group.findById(req.params.id)
      .populate('creator', 'firstName lastName')
      .populate('members', 'firstName lastName');

    if (!group) {
       res.status(404).json({ message: 'Group not found' });
       return;
    }

    res.status(200).json(group);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching group', error });
  }
};

// Update group by ID
export const updateGroupById = async (req: Request, res: Response) : Promise<void> => {
  try {
    const { name, description } = req.body;

    const group = await Group.findByIdAndUpdate(
      req.params.id,
      { name, description },
      { new: true }
    ).populate('creator', 'firstName lastName').populate('members', 'firstName lastName');

    if (!group) {
       res.status(404).json({ message: 'Group not found' });
       return;
    }

    res.status(200).json(group);
  } catch (error) {
    res.status(500).json({ message: 'Error updating group', error });
  }
};

// Delete group by ID
export const deleteGroupById = async (req: Request, res: Response) : Promise<void> => {
  try {
    const group = await Group.findByIdAndDelete(req.params.id);
    if (!group) {
       res.status(404).json({ message: 'Group not found' });
       return;
    }

    // Remove the group from all members' groups list
    await User.updateMany(
      { groups: group._id },
      { $pull: { groups: group._id } }
    );

    res.status(200).json({ message: 'Group deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting group', error });
  }
};

// Add member to group
export const addMemberToGroup = async (req: Request, res: Response) : Promise<void> => {
  try {
    const { userId } = req.body;
    const groupId = req.params.id;

    const group = await Group.findById(groupId);
    const user = await User.findById(userId);

    if (!group || !user) {
       res.status(404).json({ message: 'Group or user not found' });
       return;
    }

    // Check if the user is already a member
    if (group.members.includes(user.id)) {
       res.status(400).json({ message: 'User is already a member of the group' });
       return;
    }

    // Add user to the group
    group.members.push(user.id);
    await group.save();

    // Add group to the user's groups list
    user.groups.push(group.id);
    await user.save();

    res.status(200).json(group);
  } catch (error) {
    res.status(500).json({ message: 'Error adding member to group', error });
  }
};

// Remove member from group
export const removeMemberFromGroup = async (req: Request, res: Response) : Promise<void> => {
  try {
    const { userId } = req.body;
    const groupId = req.params.id;

    const group = await Group.findById(groupId);
    const user = await User.findById(userId);

    if (!group || !user) {
       res.status(404).json({ message: 'Group or user not found' });
       return;
    }

    // Check if the user is a member
    if (!group.members.includes(user.id)) {
       res.status(400).json({ message: 'User is not a member of the group' });
       return;
    }

    // Remove user from the group
    group.members = group.members.filter(member => member.toString() !== userId);
    await group.save();

    // Remove group from the user's groups list
    user.groups = user.groups.filter(group => group.toString() !== groupId);
    await user.save();

    res.status(200).json(group);
  } catch (error) {
    res.status(500).json({ message: 'Error removing member from group', error });
  }
};