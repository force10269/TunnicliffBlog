const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Blog = require('../models/blog');

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
