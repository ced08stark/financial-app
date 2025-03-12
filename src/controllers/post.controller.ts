import { Request, Response } from 'express';
import Post from '../models/post';
import User from '../models/user';
import Group from '../models/group';
import mongoose from 'mongoose';



export const createPost = async (req: Request, res: Response): Promise<void> => {
  try {
    const { content, groupId } = req.body;
    const authorId = req.user?.id;

    // Vérifiez que authorId est une chaîne de caractères valide
    if (!authorId || !mongoose.isValidObjectId(authorId)) {
       res.status(400).json({ message: 'Invalid author ID' });
       return;
    }

    // Convertissez authorId en ObjectId
    const objectIdAuthorId = new mongoose.Types.ObjectId(authorId);

    const author = await User.findById(objectIdAuthorId);
    if (!author) {
       res.status(404).json({ message: 'Author not found' });
       return;
    }

    let group = null;
    if (groupId) {
      group = await Group.findById(groupId);
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

    const post = new Post({
      author: objectIdAuthorId,
      content,
      group: groupId || null,
    });

    await post.save();

    // Ajoutez le post à la liste des posts de l'auteur
    author.posts.push(post.id);
    await author.save();

    // Si le post est dans un groupe, ajoutez-le à la liste des posts du groupe
    if (group) {
      group.posts.push(post.id);
      await group.save();
    }

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: 'Error creating post', error });
  }
};

// Get all posts (for a user or a group)
export const getPosts = async (req: Request, res: Response) : Promise<void> => {
  try {
    const { groupId } = req.query;
    const userId = req.user?.id;

    // Vérifiez que authorId est une chaîne de caractères valide
    if (!userId || !mongoose.isValidObjectId(userId)) {
         res.status(400).json({ message: 'Invalid author ID' });
         return;
      }
  
      // Convertissez authorId en ObjectId
      const objectIdUserId = new mongoose.Types.ObjectId(userId);

    let posts;
    if (groupId) {
      const group = await Group.findById(groupId);
      if (!group) {
         res.status(404).json({ message: 'Group not found' });
         return;
      }

      // Check if the user is a member of the group
      if (!group.members.includes(objectIdUserId)) {
         res.status(403).json({ message: 'You are not a member of this group' });
         return;
      }

      posts = await Post.find({ group: groupId })
        .populate('author', 'firstName lastName')
        .sort({ createdAt: -1 }); // Sort by creation date (newest first)
    } else {
      posts = await Post.find({ author: userId })
        .populate('author', 'firstName lastName')
        .sort({ createdAt: -1 }); // Sort by creation date (newest first)
    }

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching posts', error });
  }
};

// Get post by ID
export const getPostById = async (req: Request, res: Response) : Promise<void> => {
  try {
    const post = await Post.findById(req.params.id).populate('author', 'firstName lastName');

    if (!post) {
       res.status(404).json({ message: 'Post not found' });
       return;
    }

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching post', error });
  }
};

// Update post by ID
export const updatePostById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { content } = req.body;
    const postId = req.params.id;
    const userId = req.user?.id;

    const post = await Post.findById(postId);
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
    await post.save();

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: 'Error updating post', error });
  }
};

// Delete post by ID
export const deletePostById = async (req: Request, res: Response): Promise<void> => {
  try {
    const postId = req.params.id;
    const userId = req.user?.id;

    const post = await Post.findById(postId);
    if (!post) {
       res.status(404).json({ message: 'Post not found' });
       return;
    }

    // Check if the user is the author of the post
    if (post.author.toString() !== userId) {
       res.status(403).json({ message: 'You are not authorized to delete this post' });
       return;
    }

    await post.deleteOne();

    // Remove the post from the author's list of posts
    await User.findByIdAndUpdate(userId, { $pull: { posts: postId } });

    // If the post is in a group, remove it from the group's list of posts
    if (post.group) {
      await Group.findByIdAndUpdate(post.group, { $pull: { posts: postId } });
    }

    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting post', error });
  }
};