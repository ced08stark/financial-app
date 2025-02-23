"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const user_controller_1 = require("../controllers/user.controller");
const verifyToken_1 = require("../middlewares/verifyToken");
const verifyAdmin_1 = __importDefault(require("../middlewares/verifyAdmin"));
const router = express_1.default.Router();
/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Gestion des utilisateurs (Profil, Administration)
 */
/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Obtenir le profil de l'utilisateur connecté
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Détails du profil utilisateur
 *       401:
 *         description: Non autorisé
 */
router.get("/profile", verifyToken_1.authMiddleware, user_controller_1.getUserProfile);
/**
 * @swagger
 * /api/users/profile/update:
 *   put:
 *     summary: Mettre à jour le profil utilisateur
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               phoneNumber:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profil mis à jour
 *       400:
 *         description: Erreur de validation
 */
router.put("/profile/update", verifyToken_1.authMiddleware, [
    (0, express_validator_1.body)("email").optional().isEmail().withMessage("Email invalide"),
    (0, express_validator_1.body)("phoneNumber").optional().isMobilePhone("fr-FR").withMessage("Numéro de téléphone invalide"),
], user_controller_1.updateUserProfile);
/**
 * @swagger
 * /api/users/profile/delete:
 *   delete:
 *     summary: Supprimer son compte utilisateur
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Compte supprimé
 *       401:
 *         description: Non autorisé
 */
router.delete("/profile/delete", verifyToken_1.authMiddleware, user_controller_1.deleteUserProfile);
/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Obtenir tous les utilisateurs (Admin uniquement)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des utilisateurs
 *       403:
 *         description: Accès interdit
 */
router.get("/", verifyToken_1.authMiddleware, verifyAdmin_1.default, user_controller_1.getAllUsers);
/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Obtenir un utilisateur par ID (Admin uniquement)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'utilisateur
 *     responses:
 *       200:
 *         description: Détails de l'utilisateur
 *       404:
 *         description: Utilisateur non trouvé
 */
router.get("/:id", verifyToken_1.authMiddleware, verifyAdmin_1.default, [(0, express_validator_1.param)("id").isMongoId().withMessage("ID invalide")], user_controller_1.getUserById);
/**
 * @swagger
 * /api/users/{id}/update:
 *   put:
 *     summary: Mettre à jour un utilisateur (Admin uniquement)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'utilisateur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [admin, editor, member, premiumMember, guest]
 *     responses:
 *       200:
 *         description: Utilisateur mis à jour
 *       404:
 *         description: Utilisateur non trouvé
 */
router.put("/:id/update", verifyToken_1.authMiddleware, verifyAdmin_1.default, [(0, express_validator_1.param)("id").isMongoId().withMessage("ID invalide")], user_controller_1.updateUserById);
/**
 * @swagger
 * /api/users/{id}/delete:
 *   delete:
 *     summary: Supprimer un utilisateur (Admin uniquement)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'utilisateur
 *     responses:
 *       200:
 *         description: Utilisateur supprimé
 *       404:
 *         description: Utilisateur non trouvé
 */
router.delete("/:id/delete", verifyToken_1.authMiddleware, verifyAdmin_1.default, [(0, express_validator_1.param)("id").isMongoId().withMessage("ID invalide")], user_controller_1.deleteUserById);
/**
 * @swagger
 * /api/users/preferences:
 *   put:
 *     summary: Mettre à jour les préférences utilisateur
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               language:
 *                 type: string
 *                 example: "fr"
 *               notifications:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Préférences mises à jour
 */
router.put("/preferences", verifyToken_1.authMiddleware, [
    (0, express_validator_1.body)("language").isString().withMessage("Langue invalide"),
    (0, express_validator_1.body)("notifications").isBoolean().withMessage("Notifications doit être un booléen"),
], user_controller_1.updateUserPreferences);
/**
 * @swagger
 * /api/users/groups:
 *   get:
 *     summary: Obtenir les groupes d'un utilisateur
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des groupes
 *       404:
 *         description: Utilisateur non trouvé
 */
router.get("/groups", verifyToken_1.authMiddleware, user_controller_1.getUserGroups);
exports.default = router;
