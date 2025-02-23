import express from "express";
import { param } from "express-validator";
import {
  getUserStatistics,
  getGroupStatistics,
  getGlobalStatistics,
} from "../controllers/statistics.controller";
import {authMiddleware} from "../middlewares/verifyToken";
import adminMiddleware from "../middlewares/verifyAdmin"; // Middleware pour vérifier si l'utilisateur est admin

const router = express.Router();

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
router.get("/user", authMiddleware, getUserStatistics);

// 📊 Obtenir les statistiques d'un groupe (nécessite d'être membre)
router.get(
  "/group/:groupId",
  authMiddleware,
  param("groupId").isMongoId().withMessage("ID du groupe invalide"),
  getGroupStatistics
);

// 📊 Obtenir les statistiques globales (admin uniquement)
router.get("/global", authMiddleware, adminMiddleware, getGlobalStatistics);

export default router;
