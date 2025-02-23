"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authMiddleware = (req, res, next) => {
    var _a;
    const token = ((_a = req.header('Authorization')) === null || _a === void 0 ? void 0 : _a.split(' ')[1]) || ""; // Récupérer le token dans l'en-tête Authorization
    if (!token) {
        res.status(401).json({ message: 'Accès refusé. Aucun token fourni.' });
        return;
    }
    try {
        const secretKey = process.env.JWT_SECRET || 'default_secret_key'; // Remplacez par votre clé secrète
        const decoded = jsonwebtoken_1.default.verify(token, secretKey); // Décode le token
        if (decoded && typeof decoded === 'object' && decoded.id) {
            req.user = { id: decoded.id, role: decoded.role }; // Injecte l'id dans req.user
            next();
        }
        else {
            res.status(400).json({ message: 'Token invalide.' });
        }
    }
    catch (error) {
        res.status(400).json({ message: 'Token invalide.' });
    }
};
exports.authMiddleware = authMiddleware;
