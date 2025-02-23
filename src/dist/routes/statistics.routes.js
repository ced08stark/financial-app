"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const statistics_controller_1 = require("../controllers/statistics.controller");
const verifyToken_1 = require("../middlewares/verifyToken");
const verifyAdmin_1 = __importDefault(require("../middlewares/verifyAdmin")); // Middleware pour vérifier si l'utilisateur est admin
const router = express_1.default.Router();
/**
 * @swagger
 * tags:
 *   name: Statistiques
 *   description: Gestion des statistiques des utilisateurs et des groupes
 */
/**
 * @swagger
 * /api/statistics/user:
 *   get:
 *     summary: Obtenir les statistiques de l'utilisateur connecté
 *     description: Permet à un utilisateur connecté d'obtenir ses propres statistiques.
 *     tags: [Statistiques]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistiques récupérées avec succès
 *       401:
 *         description: Non autorisé
 */
/**
 * @swagger
 * /api/statistics/group/{groupId}:
 *   get:
 *     summary: Obtenir les statistiques d'un groupe
 *     description: Permet à un utilisateur membre du groupe d'obtenir ses statistiques.
 *     tags: [Statistiques]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: groupId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           example: "65b34567cdef8901ghi23456"
 *     responses:
 *       200:
 *         description: Statistiques récupérées avec succès
 *       400:
 *         description: ID du groupe invalide
 *       401:
 *         description: Non autorisé
 *       403:
 *         description: Accès interdit (non-membre du groupe)
 *       404:
 *         description: Groupe non trouvé
 */
/**
 * @swagger
 * /api/statistics/global:
 *   get:
 *     summary: Obtenir les statistiques globales
 *     description: Permet à un administrateur d'obtenir les statistiques générales de la plateforme.
 *     tags: [Statistiques]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistiques récupérées avec succès
 *       401:
 *         description: Non autorisé
 *       403:
 *         description: Accès interdit (réservé aux administrateurs)
 */
// 📊 Obtenir les statistiques de l'utilisateur connecté
router.get("/user", verifyToken_1.authMiddleware, statistics_controller_1.getUserStatistics);
// 📊 Obtenir les statistiques d'un groupe (nécessite d'être membre)
router.get("/group/:groupId", verifyToken_1.authMiddleware, (0, express_validator_1.param)("groupId").isMongoId().withMessage("ID du groupe invalide"), statistics_controller_1.getGroupStatistics);
// 📊 Obtenir les statistiques globales (admin uniquement)
router.get("/global", verifyToken_1.authMiddleware, verifyAdmin_1.default, statistics_controller_1.getGlobalStatistics);
exports.default = router;
