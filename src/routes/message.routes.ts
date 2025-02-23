import express from "express";
import { body, param } from "express-validator";
import {
  sendMessage,
  getGroupMessages,
  getUserMessages,
  deleteMessage,
} from "../controllers/message.controller";
import {authMiddleware} from "../middlewares/verifyToken";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Messages
 *   description: Gestion des messages privés et de groupe
 */

/**
 * @swagger
 * /api/messages:
 *   post:
 *     summary: Envoyer un message
 *     description: Permet aux utilisateurs connectés d'envoyer un message à un autre utilisateur ou à un groupe.
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 example: "Bonjour, comment ça va ?"
 *               receiverId:
 *                 type: string
 *                 example: "65a23456bcde7890fgh12345"
 *               groupId:
 *                 type: string
 *                 example: "65b34567cdef8901ghi23456"
 *     responses:
 *       201:
 *         description: Message envoyé avec succès
 *       400:
 *         description: Erreur de validation
 *       401:
 *         description: Non autorisé
 */

/**
 * @swagger
 * /api/messages/group/{groupId}:
 *   get:
 *     summary: Récupérer les messages d'un groupe
 *     description: Permet aux membres d'un groupe de consulter les messages échangés.
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: groupId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Liste des messages du groupe
 *       400:
 *         description: ID du groupe invalide
 *       401:
 *         description: Non autorisé
 *       404:
 *         description: Groupe non trouvé
 */

/**
 * @swagger
 * /api/messages/user/{receiverId}:
 *   get:
 *     summary: Récupérer les messages privés entre deux utilisateurs
 *     description: Permet aux utilisateurs connectés de voir leurs échanges avec un autre utilisateur.
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: receiverId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Liste des messages échangés entre les utilisateurs
 *       400:
 *         description: ID du destinataire invalide
 *       401:
 *         description: Non autorisé
 *       404:
 *         description: Utilisateur non trouvé
 */

/**
 * @swagger
 * /api/messages/{messageId}:
 *   delete:
 *     summary: Supprimer un message
 *     description: Permet à l'auteur d'un message de le supprimer.
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: messageId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Message supprimé avec succès
 *       400:
 *         description: ID du message invalide
 *       401:
 *         description: Non autorisé
 *       404:
 *         description: Message non trouvé
 */



// 📩 Envoyer un message (à un utilisateur ou un groupe)
router.post(
  "/",
  authMiddleware,
  [
    body("content").notEmpty().withMessage("Le contenu du message est requis"),
    body("receiverId").optional().isMongoId().withMessage("ID du destinataire invalide"),
    body("groupId").optional().isMongoId().withMessage("ID du groupe invalide"),
  ],
  sendMessage
);

// 👥 Récupérer les messages d'un groupe
router.get(
  "/group/:groupId",
  authMiddleware,
  param("groupId").isMongoId().withMessage("ID du groupe invalide"),
  getGroupMessages
);

// 🗣️ Récupérer les messages entre deux utilisateurs
router.get(
  "/user/:receiverId",
  authMiddleware,
  param("receiverId").isMongoId().withMessage("ID du destinataire invalide"),
  getUserMessages
);

// ❌ Supprimer un message
router.delete(
  "/:messageId",
  authMiddleware,
  param("messageId").isMongoId().withMessage("ID du message invalide"),
  deleteMessage
);

export default router;
