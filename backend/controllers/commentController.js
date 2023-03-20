const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Comment = require('../models/comment');

// Get all comments
router.get('/', async (req, res) => {
  try {
    const comments = await Comment.find();
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get one comment
router.get('/:id', getComment, (req, res) => {
  res.json(res.comment);
});

// Create one comment
router.post('/', async (req, res) => {
  const comment = new Comment({
    blogId: req.body.blogId,
    postTime: req.body.postTime,
    text: req.body.text,
    author: {
      userId: req.body.author.userId,
      profilePic: req.body.author.profilePic,
      name: req.body.author.name
    }
  });
  try {
    const newComment = await comment.save();
    res.status(201).json(newComment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update one comment
router.patch('/:id', getComment, async (req, res) => {
  if (req.body.text != null) {
    res.comment.text = req.body.text;
  }
  if (req.body.author != null) {
    res.comment.author = {
      userId: req.body.author.userId,
      profilePic: req.body.author.profilePic,
      name: req.body.author.name
    };
  }
  if (req.body.nLikes != null) {
    res.comment.nLikes = req.body.nLikes;
  }
  try {
    const updatedComment = await res.comment.save();
    res.json(updatedComment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete one comment
router.delete('/:id', getComment, async (req, res) => {
  try {
    await res.comment.remove();
    res.json({ message: 'Deleted comment' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function getComment(req, res, next) {
  let comment;
  try {
    comment = await Comment.findById(req.params.id);
    if (comment == null) {
      return res.status(404).json({ message: 'Cannot find comment' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.comment = comment;
  next();
}

module.exports = router;
