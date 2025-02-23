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
exports.deleteMessage = exports.getUserMessages = exports.getGroupMessages = exports.sendMessage = void 0;
const message_1 = __importDefault(require("../models/message"));
const user_1 = __importDefault(require("../models/user"));
const group_1 = __importDefault(require("../models/group"));
const mongoose_1 = __importDefault(require("mongoose"));
// Send a message to a group or a user
const sendMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { content, receiverId, groupId } = req.body;
        const senderId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id; // Assuming you have middleware to extract userId from the token
        // Vérifiez que authorId est une chaîne de caractères valide
        if (!senderId || !mongoose_1.default.isValidObjectId(senderId)) {
            res.status(400).json({ message: 'Invalid author ID' });
            return;
        }
        // Convertissez authorId en ObjectId
        const objectIdSenderId = new mongoose_1.default.Types.ObjectId(senderId);
        const sender = yield user_1.default.findById(senderId);
        if (!sender) {
            res.status(404).json({ message: 'Sender not found' });
            return;
        }
        // Check if the message is sent to a group or a user
        if (groupId) {
            const group = yield group_1.default.findById(groupId);
            if (!group) {
                res.status(404).json({ message: 'Group not found' });
                return;
            }
            // Check if the sender is a member of the group
            if (!group.members.includes(objectIdSenderId)) {
                res.status(403).json({ message: 'You are not a member of this group' });
                return;
            }
            const message = new message_1.default({
                sender: senderId,
                content,
                group: groupId,
            });
            yield message.save();
            res.status(201).json(message);
        }
        else if (receiverId) {
            const receiver = yield user_1.default.findById(receiverId);
            if (!receiver) {
                res.status(404).json({ message: 'Receiver not found' });
                return;
            }
            const message = new message_1.default({
                sender: senderId,
                receiver: receiverId,
                content,
            });
            yield message.save();
            res.status(201).json(message);
        }
        else {
            res.status(400).json({ message: 'Either receiverId or groupId must be provided' });
            return;
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Error sending message', error });
    }
});
exports.sendMessage = sendMessage;
// Get messages for a group
const getGroupMessages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const groupId = req.params.groupId;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        // Vérifiez que authorId est une chaîne de caractères valide
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
        const messages = yield message_1.default.find({ group: groupId })
            .populate('sender', 'firstName lastName')
            .sort({ createdAt: 1 }); // Sort by creation date
        res.status(200).json(messages);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching group messages', error });
    }
});
exports.getGroupMessages = getGroupMessages;
// Get messages between two users
const getUserMessages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const receiverId = req.params.receiverId;
        const senderId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const messages = yield message_1.default.find({
            $or: [
                { sender: senderId, receiver: receiverId },
                { sender: receiverId, receiver: senderId },
            ],
        })
            .populate('sender', 'firstName lastName')
            .populate('receiver', 'firstName lastName')
            .sort({ createdAt: 1 }); // Sort by creation date
        res.status(200).json(messages);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching user messages', error });
    }
});
exports.getUserMessages = getUserMessages;
// Delete a message
const deleteMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const messageId = req.params.messageId;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const message = yield message_1.default.findById(messageId);
        if (!message) {
            res.status(404).json({ message: 'Message not found' });
            return;
        }
        // Check if the user is the sender of the message
        if (message.sender.toString() !== userId) {
            res.status(403).json({ message: 'You are not authorized to delete this message' });
            return;
        }
        yield message.deleteOne();
        res.status(200).json({ message: 'Message deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting message', error });
    }
});
exports.deleteMessage = deleteMessage;
