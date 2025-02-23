"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePostById = exports.updatePostById = exports.getPostById = exports.getPosts = exports.createPost = void 0;
const post_1 = __importDefault(require("../models/post"));
const user_1 = __importDefault(require("../models/user"));
const group_1 = __importDefault(require("../models/group"));
const mongoose_1 = __importDefault(require("mongoose"));
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { content, groupId } = req.body;
        const authorId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        // Vérifiez que authorId est une chaîne de caractères valide
        if (!authorId || !mongoose_1.default.isValidObjectId(authorId)) {
            res.status(400).json({ message: 'Invalid author ID' });
            return;
        }
        // Convertissez authorId en ObjectId
        const objectIdAuthorId = new mongoose_1.default.Types.ObjectId(authorId);
        const author = yield user_1.default.findById(objectIdAuthorId);
        if (!author) {
            res.status(404).json({ message: 'Author not found' });
            return;
        }
        let group = null;
        if (groupId) {
            group = yield group_1.default.findById(groupId);
            if (!group) {
                res.status(404).json({ message: 'Group not found' });
                return;
            }
            // Vérifiez si l'auteur est membre du groupe
            if (!group.members.includes(objectIdAuthorId)) {
                res.status(403).json({ message: 'You are not a member of this group' });
                return;
            }
        }
        const post = new post_1.default({
            author: objectIdAuthorId,
            content,
            group: groupId || null,
        });
        yield post.save();
        // Ajoutez le post à la liste des posts de l'auteur
        author.posts.push(post.id);
        yield author.save();
        // Si le post est dans un groupe, ajoutez-le à la liste des posts du groupe
        if (group) {
            group.posts.push(post.id);
            yield group.save();
        }
        res.status(201).json(post);
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating post', error });
    }
});
exports.createPost = createPost;
// Get all posts (for a user or a group)
const getPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { groupId } = req.query;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        // Vérifiez que authorId est une chaîne de caractères valide
        if (!userId || !mongoose_1.default.isValidObjectId(userId)) {
            res.status(400).json({ message: 'Invalid author ID' });
            return;
        }
        // Convertissez authorId en ObjectId
        const objectIdUserId = new mongoose_1.default.Types.ObjectId(userId);
        let posts;
        if (groupId) {
            const group = yield group_1.default.findById(groupId);
            if (!group) {
                res.status(404).json({ message: 'Group not found' });
                return;
            }
            // Check if the user is a member of the group
            if (!group.members.includes(objectIdUserId)) {
                res.status(403).json({ message: 'You are not a member of this group' });
                return;
            }
            posts = yield post_1.default.find({ group: groupId })
                .populate('author', 'firstName lastName')
                .sort({ createdAt: -1 }); // Sort by creation date (newest first)
        }
        else {
            posts = yield post_1.default.find({ author: userId })
                .populate('author', 'firstName lastName')
                .sort({ createdAt: -1 }); // Sort by creation date (newest first)
        }
        res.status(200).json(posts);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching posts', error });
    }
});
exports.getPosts = getPosts;
// Get post by ID
const getPostById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const post = yield post_1.default.findById(req.params.id).populate('author', 'firstName lastName');
        if (!post) {
            res.status(404).json({ message: 'Post not found' });
            return;
        }
        res.status(200).json(post);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching post', error });
    }
});
exports.getPostById = getPostById;
// Update post by ID
const updatePostById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { content } = req.body;
        const postId = req.params.id;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const post = yield post_1.default.findById(postId);
        if (!post) {
            res.status(404).json({ message: 'Post not found' });
            return;
        }
        // Check if the user is the author of the post
        if (post.author.toString() !== userId) {
            res.status(403).json({ message: 'You are not authorized to update this post' });
            return;
        }
        post.content = content;
        yield post.save();
        res.status(200).json(post);
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating post', error });
    }
});
exports.updatePostById = updatePostById;
// Delete post by ID
const deletePostById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const postId = req.params.id;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const post = yield post_1.default.findById(postId);
        if (!post) {
            res.status(404).json({ message: 'Post not found' });
            return;
        }
        // Check if the user is the author of the post
        if (post.author.toString() !== userId) {
            res.status(403).json({ message: 'You are not authorized to delete this post' });
            return;
        }
        yield post.deleteOne();
        // Remove the post from the author's list of posts
        yield user_1.default.findByIdAndUpdate(userId, { $pull: { posts: postId } });
        // If the post is in a group, remove it from the group's list of posts
        if (post.group) {
            yield group_1.default.findByIdAndUpdate(post.group, { $pull: { posts: postId } });
        }
        res.status(200).json({ message: 'Post deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting post', error });
    }
});
exports.deletePostById = deletePostById;
