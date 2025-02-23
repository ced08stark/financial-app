import express from "express";
import { body, param } from "express-validator";
import { 
  getUserProfile, 
  updateUserProfile, 
  deleteUserProfile, 
  getAllUsers, 
  getUserById, 
  updateUserById, 
  deleteUserById, 
  updateUserPreferences, 
  getUserGroups 
} from "../controllers/user.controller";
import {authMiddleware} from "../middlewares/verifyToken";
import adminMiddleware from "../middlewares/verifyAdmin";

const router = express.Router();

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
router.get("/profile", authMiddleware, getUserProfile);

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
router.put(
  "/profile/update",
  authMiddleware,
  [
    body("email").optional().isEmail().withMessage("Email invalide"),
    body("phoneNumber").optional().isMobilePhone("fr-FR").withMessage("Numéro de téléphone invalide"),
  ],
  updateUserProfile
);

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
router.delete("/profile/delete", authMiddleware, deleteUserProfile);

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
router.get("/", authMiddleware, adminMiddleware, getAllUsers);

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
router.get(
  "/:id",
  authMiddleware,
  adminMiddleware,
  [param("id").isMongoId().withMessage("ID invalide")],
  getUserById
);

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
router.put(
  "/:id/update",
  authMiddleware,
  adminMiddleware,
  [param("id").isMongoId().withMessage("ID invalide")],
  updateUserById
);

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
router.delete(
  "/:id/delete",
  authMiddleware,
  adminMiddleware,
  [param("id").isMongoId().withMessage("ID invalide")],
  deleteUserById
);

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
router.put(
  "/preferences",
  authMiddleware,
  [
    body("language").isString().withMessage("Langue invalide"),
    body("notifications").isBoolean().withMessage("Notifications doit être un booléen"),
  ],
  updateUserPreferences
);

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
router.get("/groups", authMiddleware, getUserGroups);

export default router;
