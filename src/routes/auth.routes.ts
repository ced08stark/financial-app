import express from "express";
import { body } from "express-validator";
import { register, login, logout, refreshToken } from "../controllers/auth.controller";
import {authMiddleware} from "../middlewares/verifyToken";

const router = express.Router();

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
 *               - userName
 *               - email
 *               - password
 *             properties:
 *               userName:
 *                 type: string
 *                 example: John
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john.doe@example.com
 *               password:
 *                 type: string
 *                 example: "Password123!"
 *     responses:
 *       201:
 *         description: Utilisateur créé avec succès
 *       400:
 *         description: Erreur de validation
 */
router.post(
  "/register",
  [
    body("email").isEmail().withMessage("Email invalide"),
    body("password").isLength({ min: 6 }).withMessage("Le mot de passe doit avoir au moins 6 caractères"),
  ],
  register
);

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
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Email invalide"),
    body("password").notEmpty().withMessage("Le mot de passe est requis"),
  ],
  login
);

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
router.post("/logout", authMiddleware, logout);

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
router.post(
  "/refresh-token",
  [body("refreshToken").notEmpty().withMessage("Le token de rafraîchissement est requis")],
  refreshToken
);

export default router;
