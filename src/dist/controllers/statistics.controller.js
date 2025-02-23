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
exports.getGlobalStatistics = exports.getGroupStatistics = exports.getUserStatistics = void 0;
const user_1 = __importDefault(require("../models/user"));
const group_1 = __importDefault(require("../models/group"));
const post_1 = __importDefault(require("../models/post"));
const message_1 = __importDefault(require("../models/message"));
const mongoose_1 = __importDefault(require("mongoose"));
// Get user statistics
const getUserStatistics = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id; // Assuming you have middleware to extract userId from the token
        const user = yield user_1.default.findById(userId);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        const postsCount = yield post_1.default.countDocuments({ author: userId });
        const messagesCount = yield message_1.default.countDocuments({ $or: [{ sender: userId }, { receiver: userId }] });
        const groupsCount = yield group_1.default.countDocuments({ members: userId });
        const statistics = {
            postsCount,
            messagesCount,
            groupsCount,
        };
        res.status(200).json(statistics);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching user statistics', error });
    }
});
exports.getUserStatistics = getUserStatistics;
// Get group statistics
const getGroupStatistics = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const groupId = req.params.groupId;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId || !mongoose_1.default.isValidObjectId(userId)) {
            res.status(400).json({ message: 'Invalid author ID' });
            return;
        }
        // Convertissez authorId en ObjectId
        const objectIdUserId = new mongoose_1.default.Types.ObjectId(userId);
        const group = yield group_1.default.findById(groupId);
        if (!group) {
            res.status(404).json({ message: 'Group not found' });
            return;
        }
        // Check if the user is a member of the group
        if (!group.members.includes(objectIdUserId)) {
            res.status(403).json({ message: 'You are not a member of this group' });
            return;
        }
        const postsCount = yield post_1.default.countDocuments({ group: groupId });
        const messagesCount = yield message_1.default.countDocuments({ group: groupId });
        const membersCount = group.members.length;
        const statistics = {
            postsCount,
            messagesCount,
            membersCount,
        };
        res.status(200).json(statistics);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching group statistics', error });
    }
});
exports.getGroupStatistics = getGroupStatistics;
// Get global statistics (for admin only)
const getGlobalStatistics = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const usersCount = yield user_1.default.countDocuments();
        const groupsCount = yield group_1.default.countDocuments();
        const postsCount = yield post_1.default.countDocuments();
        const messagesCount = yield message_1.default.countDocuments();
        const statistics = {
            usersCount,
            groupsCount,
            postsCount,
            messagesCount,
        };
        res.status(200).json(statistics);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching global statistics', error });
    }
});
exports.getGlobalStatistics = getGlobalStatistics;
