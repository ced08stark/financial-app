"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const post_controller_1 = require("../controllers/post.controller");
const verifyToken_1 = require("../middlewares/verifyToken");
const router = express_1.default.Router();
/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: Gestion des publications des utilisateurs
 */
/**
 * @swagger
 * /api/posts:
 *   post:
 *     summary: Créer un post
 *     description: Permet aux utilisateurs connectés de créer un post, optionnellement dans un groupe.
 *     tags: [Posts]
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
 *                 example: "Voici mon premier post !"
 *               groupId:
 *                 type: string
 *                 example: "65b34567cdef8901ghi23456"
 *     responses:
 *       201:
 *         description: Post créé avec succès
 *       400:
 *         description: Erreur de validation
 *       401:
 *         description: Non autorisé
 */
/**
 * @swagger
 * /api/posts:
 *   get:
 *     summary: Récupérer tous les posts
 *     description: Permet aux utilisateurs connectés de voir tous les posts, avec option de filtrage par groupe.
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: groupId
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Liste des posts récupérée avec succès
 *       400:
 *         description: ID du groupe invalide
 *       401:
 *         description: Non autorisé
 */
/**
 * @swagger
 * /api/posts/{id}:
 *   get:
 *     summary: Récupérer un post par ID
 *     description: Permet d'afficher un post spécifique.
 *     tags: [Posts]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Post récupéré avec succès
 *       400:
 *         description: ID du post invalide
 *       404:
 *         description: Post non trouvé
 */
/**
 * @swagger
 * /api/posts/{id}:
 *   put:
 *     summary: Mettre à jour un post par ID
 *     description: Permet à l'auteur d'un post de le modifier.
 *     tags: [Posts]
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
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 example: "Mise à jour de mon post !"
 *     responses:
 *       200:
 *         description: Post mis à jour avec succès
 *       400:
 *         description: ID du post invalide ou contenu vide
 *       401:
 *         description: Non autorisé
 *       403:
 *         description: Accès interdit (seul l'auteur peut modifier)
 *       404:
 *         description: Post non trouvé
 */
/**
 * @swagger
 * /api/posts/{id}:
 *   delete:
 *     summary: Supprimer un post par ID
 *     description: Permet à l'auteur d'un post de le supprimer.
 *     tags: [Posts]
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
 *         description: Post supprimé avec succès
 *       400:
 *         description: ID du post invalide
 *       401:
 *         description: Non autorisé
 *       403:
 *         description: Accès interdit (seul l'auteur peut supprimer)
 *       404:
 *         description: Post non trouvé
 */
// 📝 Créer un post (Utilisateur connecté)
router.post("/", verifyToken_1.authMiddleware, [
    (0, express_validator_1.body)("content").notEmpty().withMessage("Le contenu du post est requis"),
    (0, express_validator_1.body)("groupId").optional().isMongoId().withMessage("ID de groupe invalide"),
], post_controller_1.createPost);
// 📌 Récupérer tous les posts (Utilisateur connecté)
router.get("/", verifyToken_1.authMiddleware, [
    (0, express_validator_1.query)("groupId").optional().isMongoId().withMessage("ID de groupe invalide"),
], post_controller_1.getPosts);
// 🔍 Récupérer un post par ID
router.get("/:id", (0, express_validator_1.param)("id").isMongoId().withMessage("ID du post invalide"), post_controller_1.getPostById);
// ✏️ Mettre à jour un post par ID (Auteur uniquement)
router.put("/:id", verifyToken_1.authMiddleware, [
    (0, express_validator_1.param)("id").isMongoId().withMessage("ID du post invalide"),
    (0, express_validator_1.body)("content").notEmpty().withMessage("Le contenu ne peut pas être vide"),
], post_controller_1.updatePostById);
// 🗑️ Supprimer un post par ID (Auteur uniquement)
router.delete("/:id", verifyToken_1.authMiddleware, (0, express_validator_1.param)("id").isMongoId().withMessage("ID du post invalide"), post_controller_1.deletePostById);
exports.default = router;
