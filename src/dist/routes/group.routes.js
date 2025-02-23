"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const group_controller_1 = require("../controllers/group.controller");
const verifyToken_1 = require("../middlewares/verifyToken");
const verifyAdmin_1 = __importDefault(require("../middlewares/verifyAdmin")); // Si certains accès sont réservés aux admins
const router = express_1.default.Router();
/**
 * @swagger
 * tags:
 *   name: Groupes
 *   description: Gestion des groupes (CRUD, membres)
 */
/**
 * @swagger
 * /api/groups:
 *   post:
 *     summary: Créer un groupe
 *     description: Permet aux utilisateurs connectés de créer un groupe.
 *     tags: [Groupes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Développeurs Node.js"
 *               description:
 *                 type: string
 *                 example: "Un groupe pour les passionnés de Node.js"
 *     responses:
 *       201:
 *         description: Groupe créé avec succès
 *       400:
 *         description: Erreur de validation
 *       401:
 *         description: Non autorisé
 */
/**
 * @swagger
 * /api/groups:
 *   get:
 *     summary: Récupérer tous les groupes
 *     description: Permet de lister tous les groupes disponibles.
 *     tags: [Groupes]
 *     responses:
 *       200:
 *         description: Liste des groupes retournée avec succès
 */
/**
 * @swagger
 * /api/groups/{id}:
 *   get:
 *     summary: Récupérer un groupe par ID
 *     description: Permet d'obtenir les informations d'un groupe spécifique.
 *     tags: [Groupes]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Groupe retourné avec succès
 *       404:
 *         description: Groupe non trouvé
 */
/**
 * @swagger
 * /api/groups/{id}:
 *   put:
 *     summary: Mettre à jour un groupe
 *     description: Permet aux utilisateurs connectés de modifier un groupe existant.
 *     tags: [Groupes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Nouveau Nom du Groupe"
 *               description:
 *                 type: string
 *                 example: "Nouvelle description"
 *     responses:
 *       200:
 *         description: Groupe mis à jour avec succès
 *       400:
 *         description: Erreur de validation
 *       401:
 *         description: Non autorisé
 *       404:
 *         description: Groupe non trouvé
 */
/**
 * @swagger
 * /api/groups/{id}:
 *   delete:
 *     summary: Supprimer un groupe
 *     description: Supprime un groupe existant (réservé aux administrateurs).
 *     tags: [Groupes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Groupe supprimé avec succès
 *       401:
 *         description: Non autorisé
 *       404:
 *         description: Groupe non trouvé
 */
/**
 * @swagger
 * /api/groups/{id}/members:
 *   post:
 *     summary: Ajouter un membre à un groupe
 *     description: Permet aux utilisateurs connectés d'ajouter un membre à un groupe.
 *     tags: [Groupes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "65a23456bcde7890fgh12345"
 *     responses:
 *       200:
 *         description: Membre ajouté avec succès
 *       400:
 *         description: Erreur de validation
 *       401:
 *         description: Non autorisé
 *       404:
 *         description: Groupe ou utilisateur non trouvé
 */
// 🆕 Créer un groupe (Utilisateur connecté)
router.post("/", verifyToken_1.authMiddleware, [
    (0, express_validator_1.body)("name").notEmpty().withMessage("Le nom du groupe est requis"),
    (0, express_validator_1.body)("description").optional().isString().withMessage("La description doit être une chaîne"),
], group_controller_1.createGroup);
// 📌 Récupérer tous les groupes (Public ou utilisateur connecté)
router.get("/", group_controller_1.getAllGroups);
// 🔍 Récupérer un groupe par ID
router.get("/:id", (0, express_validator_1.param)("id").isMongoId().withMessage("ID de groupe invalide"), group_controller_1.getGroupById);
// ✏️ Mettre à jour un groupe par ID (Utilisateur connecté)
router.put("/:id", verifyToken_1.authMiddleware, [
    (0, express_validator_1.param)("id").isMongoId().withMessage("ID de groupe invalide"),
    (0, express_validator_1.body)("name").optional().notEmpty().withMessage("Le nom ne peut pas être vide"),
    (0, express_validator_1.body)("description").optional().isString().withMessage("La description doit être une chaîne"),
], group_controller_1.updateGroupById);
// 🗑️ Supprimer un groupe par ID (Admin uniquement)
router.delete("/:id", verifyToken_1.authMiddleware, verifyAdmin_1.default, (0, express_validator_1.param)("id").isMongoId().withMessage("ID de groupe invalide"), group_controller_1.deleteGroupById);
// ➕ Ajouter un membre à un groupe (Utilisateur connecté)
router.post("/:id/members", verifyToken_1.authMiddleware, [
    (0, express_validator_1.param)("id").isMongoId().withMessage("ID de groupe invalide"),
    (0, express_validator_1.body)("userId").isMongoId().withMessage("ID de l'utilisateur invalide"),
], group_controller_1.addMemberToGroup);
// ➖ Supprimer un membre d'un groupe (Utilisateur connecté)
router.delete("/:id/members", verifyToken_1.authMiddleware, [
    (0, express_validator_1.param)("id").isMongoId().withMessage("ID de groupe invalide"),
    (0, express_validator_1.body)("userId").isMongoId().withMessage("ID de l'utilisateur invalide"),
], group_controller_1.removeMemberFromGroup);
exports.default = router;
