"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const auth_controller_1 = require("../controllers/auth.controller");
const verifyToken_1 = require("../middlewares/verifyToken");
const router = express_1.default.Router();
/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Gestion des utilisateurs (Inscription, Connexion, Déconnexion)
 */
/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Inscription d'un utilisateur
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - password
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: John
 *               lastName:
 *                 type: string
 *                 example: Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john.doe@example.com
 *               password:
 *                 type: string
 *                 example: "Password123!"
 *               phoneNumber:
 *                 type: string
 *                 example: "+33612345678"
 *     responses:
 *       201:
 *         description: Utilisateur créé avec succès
 *       400:
 *         description: Erreur de validation
 */
router.post("/register", [
    (0, express_validator_1.body)("firstName").notEmpty().withMessage("Le prénom est requis"),
    (0, express_validator_1.body)("lastName").notEmpty().withMessage("Le nom est requis"),
    (0, express_validator_1.body)("email").isEmail().withMessage("Email invalide"),
    (0, express_validator_1.body)("password").isLength({ min: 6 }).withMessage("Le mot de passe doit avoir au moins 6 caractères"),
    (0, express_validator_1.body)("phoneNumber").optional().isMobilePhone("fr-FR").withMessage("Numéro de téléphone invalide"),
], auth_controller_1.register);
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Connexion d'un utilisateur
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john.doe@example.com
 *               password:
 *                 type: string
 *                 example: "Password123!"
 *     responses:
 *       200:
 *         description: Connexion réussie
 *       400:
 *         description: Identifiants invalides
 */
router.post("/login", [
    (0, express_validator_1.body)("email").isEmail().withMessage("Email invalide"),
    (0, express_validator_1.body)("password").notEmpty().withMessage("Le mot de passe est requis"),
], auth_controller_1.login);
/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Déconnexion de l'utilisateur
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Déconnexion réussie
 *       401:
 *         description: Non autorisé
 */
router.post("/logout", verifyToken_1.authMiddleware, auth_controller_1.logout);
/**
 * @swagger
 * /api/auth/refresh-token:
 *   post:
 *     summary: Rafraîchir le token d'accès
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 example: "eyJhbGciOiJIUz..."
 *     responses:
 *       200:
 *         description: Token rafraîchi
 *       401:
 *         description: Token invalide
 */
router.post("/refresh-token", [(0, express_validator_1.body)("refreshToken").notEmpty().withMessage("Le token de rafraîchissement est requis")], auth_controller_1.refreshToken);
exports.default = router;
