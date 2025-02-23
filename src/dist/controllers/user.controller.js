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
exports.getUserGroups = exports.updateUserPreferences = exports.deleteUserById = exports.updateUserById = exports.getUserById = exports.getAllUsers = exports.deleteUserProfile = exports.updateUserProfile = exports.getUserProfile = void 0;
const user_1 = __importDefault(require("../models/user"));
// Get user profile
const getUserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id; // Assuming you have middleware to extract userId from the token
        const user = yield user_1.default.findById(userId).select('-password -refreshToken');
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.status(200).json(user);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching user profile', error });
    }
});
exports.getUserProfile = getUserProfile;
// Update user profile
const updateUserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const updates = req.body;
        const user = yield user_1.default.findByIdAndUpdate(userId, updates, { new: true }).select('-password -refreshToken');
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.status(200).json(user);
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating user profile', error });
    }
});
exports.updateUserProfile = updateUserProfile;
// Delete user profile
const deleteUserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const user = yield user_1.default.findByIdAndDelete(userId);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.status(200).json({ message: 'User deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting user profile', error });
    }
});
exports.deleteUserProfile = deleteUserProfile;
// Get all users (for admin only)
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield user_1.default.find().select('-password -refreshToken');
        res.status(200).json(users);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching users', error });
    }
});
exports.getAllUsers = getAllUsers;
// Get user by ID (for admin only)
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_1.default.findById(req.params.id).select('-password -refreshToken');
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.status(200).json(user);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching user', error });
    }
});
exports.getUserById = getUserById;
// Update user by ID (for admin only)
const updateUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password -refreshToken');
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.status(200).json(user);
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating user', error });
    }
});
exports.updateUserById = updateUserById;
// Delete user by ID (for admin only)
const deleteUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_1.default.findByIdAndDelete(req.params.id);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.status(200).json({ message: 'User deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting user', error });
    }
});
exports.deleteUserById = deleteUserById;
// Update user preferences
const updateUserPreferences = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const { language, notifications } = req.body;
        const user = yield user_1.default.findById(userId);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        user.preferences = { language, notifications };
        yield user.save();
        res.status(200).json(user.preferences);
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating user preferences', error });
    }
});
exports.updateUserPreferences = updateUserPreferences;
// Get user groups
const getUserGroups = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.body.userId;
        const user = yield user_1.default.findById(userId).populate('groups');
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.status(200).json(user.groups);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching user groups', error });
    }
});
exports.getUserGroups = getUserGroups;
