const express = require('express');
const User = require('../models/User');
const Project = require('../models/Project');
const Like = require('../models/Like');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.use(protect, adminOnly);

router.get('/users', async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    return res.json(users);
  } catch (error) {
    return next(error);
  }
});

router.delete('/users/:id', async (req, res, next) => {
  try {
    await Project.deleteMany({ user: req.params.id });
    await Like.deleteMany({ portfolioOwner: req.params.id });
    await User.findByIdAndDelete(req.params.id);
    return res.json({ message: 'User deleted successfully' });
  } catch (error) {
    return next(error);
  }
});

router.patch('/users/:id/feature', async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.featured = !user.featured;
    await user.save();

    return res.json({ message: `Portfolio ${user.featured ? 'featured' : 'unfeatured'}`, featured: user.featured });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
