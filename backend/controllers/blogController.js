const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Blog = require('../models/blog');
const Comment = require('../models/comment');

// Get all blogs
router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get one blog
router.get('/:id', getBlog, (req, res) => {
  res.json(res.blog);
});

// Create one blog
router.post('/', async (req, res) => {
  if(Object.keys(req.body).length === 0){
    req.body = req.query;
  }
  const blog = new Blog({
    title: req.body.title,
    content: req.body.content,
    author: {
      userId: req.body.author.userId,
      profilePic: req.body.author.profilePic,
      username: req.body.author.username
    },
    topics: req.body.topics,
    coverImage: req.body.coverImage,
  });
  try {
    const newBlog = await blog.save();
    res.status(201).json(newBlog);
  } catch (err) {
    res.status(400).json({ message: err.message });
    console.error(err);
  }
});

// Update one blog
router.patch('/:id', getBlog, async (req, res) => {
  if (req.body.title != null) {
    res.blog.title = req.body.title;
  }
  if (req.body.postTime != null) {
    res.blog.postTime = req.body.postTime;
  }
  if (req.body.nLikes != null) {
    res.blog.nLikes = req.body.nLikes;
  }
  if (req.body.numComments != null) {
    res.blog.numComments = req.body.numComments;
  }
  if (req.body.author != null) {
    res.blog.author = {
      userId: req.body.author.userId,
      profilePic: req.body.author.profilePic,
      username: req.body.author.username
    };
  }
  if(req.body.topics != null) {
    res.blog.topics = req.body.topics;
  }
  if(req.body.coverImage != null) {
    res.blog.coverImage = req.body.coverImage;
  }
  try {
    const updatedBlog = await res.blog.save();
    res.json(updatedBlog);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete one blog
router.delete('/:id', getBlog, async (req, res) => {
  try {
    await res.blog.remove();
    res.json({ message: 'Deleted blog' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all comments for a blog
router.get('/:blogId/comments', async (req, res) => {
  try {
    const comments = await Comment.find({ blogId: req.params.blogId })
      .populate({
        path: 'author',
        select: 'username profilePic',
      });

    // Add the profile picture URL to each comment's author
    const commentsWithProfilePics = comments.map(comment => {
      const updatedComment = comment.toObject();
      if (updatedComment.author.profilePic) {
        updatedComment.author.profilePic = 'http://' + process.env.BACKEND_ORIGIN + '/images/' + updatedComment.author.profilePic;
      }
      return updatedComment;
    });

    res.json(commentsWithProfilePics);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function getBlog(req, res, next) {
  let blog;
  try {
    blog = await Blog.findById(req.params.id);
    if (blog == null) {
      return res.status(404).json({ message: 'Cannot find blog' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.blog = blog;
  next();
}

module.exports = router;
