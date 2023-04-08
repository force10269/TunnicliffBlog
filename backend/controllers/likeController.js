const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Like = require('../models/like');

// Get all likes for a specific blog post
router.get('/', async (req, res) => {
  const { slug } = req.query;

  try {
    const likes = await Like.find({ slug: slug });
    res.json(likes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get one like
router.get('/:id', getLike, (req, res) => {
  res.json(res.like);
});

// Create one like
router.post('/', async (req, res) => {
  const like = new Like({
    slug: req.body.slug,
    author: {
      userId: req.body.author.userId,
      profilePic: req.body.author.profilePic,
      name: req.body.author.name,
    },
  });

  try {
    const newLike = await like.save();
    res.status(201).json(newLike);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update one like
router.patch('/:id', getLike, async (req, res) => {
  if (req.body.slug != null) {
    res.like.slug = req.body.slug;
  }
  if (req.body.author != null) {
    res.like.author = {
      userId: req.body.author.userId,
      profilePic: req.body.author.profilePic,
      name: req.body.author.name,
    };
  }
  try {
    const updatedLike = await res.like.save();
    res.json(updatedLike);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete one like
router.delete('/:id', getLike, async (req, res) => {
  try {
    await Like.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted like' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function getLike(req, res, next) {
  let like;
  try {
    like = await Like.findById(req.params.id);
    if (like == null) {
      return res.status(404).json({ message: 'Cannot find like' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.like = like;
  next();
}

module.exports = router;
