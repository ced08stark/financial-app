import express from "express";
import { body, param } from "express-validator";
import { 
  createGroup, getAllGroups, getGroupById, updateGroupById, deleteGroupById, 
  addMemberToGroup, removeMemberFromGroup 
} from "../controllers/group.controller";
import {authMiddleware} from "../middlewares/verifyToken";
import adminMiddleware from "../middlewares/verifyAdmin"; // Si certains accès sont réservés aux admins

const router = express.Router();

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
router.post(
  "/",
  authMiddleware,
  [
    body("name").notEmpty().withMessage("Le nom du groupe est requis"),
    body("description").optional().isString().withMessage("La description doit être une chaîne"),
  ],
  createGroup
);

// 📌 Récupérer tous les groupes (Public ou utilisateur connecté)
router.get("/", getAllGroups);

// 🔍 Récupérer un groupe par ID
router.get(
  "/:id",
  param("id").isMongoId().withMessage("ID de groupe invalide"),
  getGroupById
);

// ✏️ Mettre à jour un groupe par ID (Utilisateur connecté)
router.put(
  "/:id",
  authMiddleware,
  [
    param("id").isMongoId().withMessage("ID de groupe invalide"),
    body("name").optional().notEmpty().withMessage("Le nom ne peut pas être vide"),
    body("description").optional().isString().withMessage("La description doit être une chaîne"),
  ],
  updateGroupById
);

// 🗑️ Supprimer un groupe par ID (Admin uniquement)
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  param("id").isMongoId().withMessage("ID de groupe invalide"),
  deleteGroupById
);

// ➕ Ajouter un membre à un groupe (Utilisateur connecté)
router.post(
  "/:id/members",
  authMiddleware,
  [
    param("id").isMongoId().withMessage("ID de groupe invalide"),
    body("userId").isMongoId().withMessage("ID de l'utilisateur invalide"),
  ],
  addMemberToGroup
);

// ➖ Supprimer un membre d'un groupe (Utilisateur connecté)
router.delete(
  "/:id/members",
  authMiddleware,
  [
    param("id").isMongoId().withMessage("ID de groupe invalide"),
    body("userId").isMongoId().withMessage("ID de l'utilisateur invalide"),
  ],
  removeMemberFromGroup
);

export default router;
