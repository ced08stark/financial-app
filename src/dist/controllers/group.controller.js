"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeMemberFromGroup = exports.addMemberToGroup = exports.deleteGroupById = exports.updateGroupById = exports.getGroupById = exports.getAllGroups = exports.createGroup = void 0;
const group_1 = __importDefault(require("../models/group"));
const user_1 = __importDefault(require("../models/user"));
// Create a new group
const createGroup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { name, description } = req.body;
        const creatorId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id; // Assuming you have middleware to extract userId from the token
        const creator = yield user_1.default.findById(creatorId);
        if (!creator) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        const group = new group_1.default({
            name,
            description,
            creator: creatorId,
            members: [creatorId], // Add the creator as the first member
        });
        yield group.save();
        // Add the group to the creator's list of groups
        creator.groups.push(group.id);
        yield creator.save();
        res.status(201).json(group);
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating group', error });
    }
});
exports.createGroup = createGroup;
// Get all groups
const getAllGroups = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const groups = yield group_1.default.find().populate('creator', 'firstName lastName').populate('members', 'firstName lastName');
        res.status(200).json(groups);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching groups', error });
    }
});
exports.getAllGroups = getAllGroups;
// Get group by ID
const getGroupById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const group = yield group_1.default.findById(req.params.id)
            .populate('creator', 'firstName lastName')
            .populate('members', 'firstName lastName');
        if (!group) {
            res.status(404).json({ message: 'Group not found' });
            return;
        }
        res.status(200).json(group);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching group', error });
    }
});
exports.getGroupById = getGroupById;
// Update group by ID
const updateGroupById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, description } = req.body;
        const group = yield group_1.default.findByIdAndUpdate(req.params.id, { name, description }, { new: true }).populate('creator', 'firstName lastName').populate('members', 'firstName lastName');
        if (!group) {
            res.status(404).json({ message: 'Group not found' });
            return;
        }
        res.status(200).json(group);
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating group', error });
    }
});
exports.updateGroupById = updateGroupById;
// Delete group by ID
const deleteGroupById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const group = yield group_1.default.findByIdAndDelete(req.params.id);
        if (!group) {
            res.status(404).json({ message: 'Group not found' });
            return;
        }
        // Remove the group from all members' groups list
        yield user_1.default.updateMany({ groups: group._id }, { $pull: { groups: group._id } });
        res.status(200).json({ message: 'Group deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting group', error });
    }
});
exports.deleteGroupById = deleteGroupById;
// Add member to group
const addMemberToGroup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.body;
        const groupId = req.params.id;
        const group = yield group_1.default.findById(groupId);
        const user = yield user_1.default.findById(userId);
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
        yield group.save();
        // Add group to the user's groups list
        user.groups.push(group.id);
        yield user.save();
        res.status(200).json(group);
    }
    catch (error) {
        res.status(500).json({ message: 'Error adding member to group', error });
    }
});
exports.addMemberToGroup = addMemberToGroup;
// Remove member from group
const removeMemberFromGroup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.body;
        const groupId = req.params.id;
        const group = yield group_1.default.findById(groupId);
        const user = yield user_1.default.findById(userId);
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
        yield group.save();
        // Remove group from the user's groups list
        user.groups = user.groups.filter(group => group.toString() !== groupId);
        yield user.save();
        res.status(200).json(group);
    }
    catch (error) {
        res.status(500).json({ message: 'Error removing member from group', error });
    }
});
exports.removeMemberFromGroup = removeMemberFromGroup;
