"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.config = {
    jwt: {
        secret: process.env.SECRET_KEY || "mon_super_secret", // Use a strong secret in production
        expiresIn: '1h', // Token expiration time
    },
};
