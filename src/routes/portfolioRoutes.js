const express = require('express');
const User = require('../models/User');
const Project = require('../models/Project');
const Like = require('../models/Like');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/featured', async (req, res, next) => {
  try {
    const featured = await User.find({ featured: true })
      .select('username fullName bio profileImage skills viewCount')
      .limit(12)
      .sort({ updatedAt: -1 });

    return res.json(featured);
  } catch (error) {
    return next(error);
  }
});

router.get('/search', async (req, res, next) => {
  try {
    const query = req.query.q?.trim();
    if (!query) {
      return res.json([]);
    }

    const regex = new RegExp(query, 'i');

    const users = await User.find({
      $or: [{ username: regex }, { skills: regex }]
    }).select('username fullName bio profileImage skills featured');

    const usersFromTags = await Project.find({ tags: regex }).distinct('user');
    const taggedUsers = await User.find({ _id: { $in: usersFromTags } }).select(
      'username fullName bio profileImage skills featured'
    );

    const merged = [...users, ...taggedUsers];
    const unique = Array.from(new Map(merged.map((item) => [item._id.toString(), item])).values());

    return res.json(unique);
  } catch (error) {
    return next(error);
  }
});

router.get('/:username', async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.params.username.toLowerCase() }).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }

    await User.findByIdAndUpdate(user._id, { $inc: { viewCount: 1 } });

    const projects = await Project.find({ user: user._id }).sort({ createdAt: -1 });
    const likesCount = await Like.countDocuments({ portfolioOwner: user._id });

    return res.json({
      user: { ...user.toObject(), viewCount: user.viewCount + 1 },
      projects,
      likesCount
    });
  } catch (error) {
    return next(error);
  }
});

router.post('/:username/like', protect, async (req, res, next) => {
  try {
    const owner = await User.findOne({ username: req.params.username.toLowerCase() });
    if (!owner) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }

    if (owner._id.toString() === req.user.id) {
      return res.status(400).json({ message: 'You cannot like your own portfolio' });
    }

    const existing = await Like.findOne({ portfolioOwner: owner._id, likedBy: req.user.id });
    if (existing) {
      await existing.deleteOne();
    } else {
      await Like.create({ portfolioOwner: owner._id, likedBy: req.user.id });
    }

    const likesCount = await Like.countDocuments({ portfolioOwner: owner._id });

    return res.json({ liked: !existing, likesCount });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
