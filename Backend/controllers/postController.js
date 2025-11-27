const Post = require('../models/KnowledgePost');
const path = require('path');

exports.createPost = async (req, res) => {
  try {
    const { name, email, experience } = req.body;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    const post = new Post({ name, email, experience, imagePath });
    await post.save();
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create post' });
  }
};

exports.getPosts = async (req, res) => {
  try {
    const search = req.query.search || '';
    const posts = await Post.find({
      experience: { $regex: search, $options: 'i' },
    }).sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
};

// Delete a post
exports.deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    await Post.findByIdAndDelete(id);
    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete post' });
  }
};

// Update a post
exports.updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, experience } = req.body;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : undefined;

    const updateData = { name, email, experience };
    if (imagePath) updateData.imagePath = imagePath;

    const updatedPost = await Post.findByIdAndUpdate(id, updateData, { new: true });
    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update post' });
  }
};
