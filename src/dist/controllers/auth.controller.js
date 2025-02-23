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
exports.refreshToken = exports.logout = exports.login = exports.register = void 0;
const user_1 = __importDefault(require("../models/user"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const config_1 = require("../configs/config");
dotenv_1.default.config();
const JWT_SECRET = process.env.SECRET_KEY;
const REFRESH_SECRET = process.env.REFRESH_SECRET;
// Register a new user
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstName, lastName, email, password, phoneNumber, role } = req.body;
        // Check if user already exists
        const existingUser = yield user_1.default.findOne({ email });
        if (existingUser) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }
        // Hash the password
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        // Create a new user
        const user = new user_1.default({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            phoneNumber,
            role: role || 'member', // Default role is 'member'
        });
        yield user.save();
        const refreshToken = jsonwebtoken_1.default.sign({ id: user._id }, REFRESH_SECRET, { expiresIn: "7d" });
        // Save refresh token in the database
        user.refreshToken = refreshToken;
        yield user.save();
        // Send response
        res.status(201).json({ user });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error registering user', error });
    }
});
exports.register = register;
// Login user
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        // Find user by email
        const user = yield user_1.default.findOne({ email });
        if (!user) {
            res.status(400).json({ message: 'Invalid credentials' });
            return;
        }
        // Check password
        const isPasswordValid = yield bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(400).json({ message: 'Invalid credentials' });
            return;
        }
        // Generate tokens
        const accessToken = jsonwebtoken_1.default.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: "15m" });
        const refreshToken = jsonwebtoken_1.default.sign({ id: user._id }, REFRESH_SECRET, { expiresIn: "7d" });
        // Save refresh token in the database
        user.refreshToken = refreshToken;
        yield user.save();
        // Send response
        res.status(200).json({ accessToken, refreshToken, user });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error logging in', error });
    }
});
exports.login = login;
// Logout user
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id; // Assuming you have middleware to extract userId from the token
        // Find user and remove refresh token
        const user = yield user_1.default.findById(userId);
        if (user) {
            user.refreshToken = undefined;
            yield user.save();
        }
        res.status(200).json({ message: 'Logged out successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error logging out', error });
    }
});
exports.logout = logout;
// Refresh token
const refreshToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { refreshToken } = req.body;
        // Verify refresh token
        const decoded = jsonwebtoken_1.default.verify(refreshToken, config_1.config.jwt.secret);
        // Find user by ID
        const user = yield user_1.default.findById(decoded.userId);
        if (!user || user.refreshToken !== refreshToken) {
            res.status(401).json({ message: 'Invalid refresh token' });
            return;
        }
        // Generate new access token
        const accessToken = jsonwebtoken_1.default.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: "15m" });
        // Send response
        res.status(200).json({ accessToken });
    }
    catch (error) {
        res.status(500).json({ message: 'Error refreshing token', error });
    }
});
exports.refreshToken = refreshToken;
