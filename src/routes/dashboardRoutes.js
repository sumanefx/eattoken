const express = require('express');
const multer = require('multer');
const User = require('../models/User');
const Project = require('../models/Project');
const { protect } = require('../middleware/auth');
const { avatarStorage, projectImageStorage } = require('../config/cloudinary');

const router = express.Router();

const uploadAvatar = multer({ storage: avatarStorage });
const uploadProjectImage = multer({ storage: projectImageStorage });

router.get('/overview', protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    const projects = await Project.find({ user: req.user.id }).sort({ createdAt: -1 });
    return res.json({ user, projects, portfolioLink: `${process.env.PUBLIC_APP_URL}/${user.username}` });
  } catch (error) {
    return next(error);
  }
});

router.put('/profile', protect, uploadAvatar.single('profileImage'), async (req, res, next) => {
  try {
    const { fullName, bio, skills, github, linkedin, twitter, website, email } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.fullName = fullName ?? user.fullName;
    user.bio = bio ?? user.bio;
    user.skills = skills ? skills.split(',').map((item) => item.trim()).filter(Boolean) : user.skills;
    user.socialLinks = {
      github: github ?? user.socialLinks.github,
      linkedin: linkedin ?? user.socialLinks.linkedin,
      twitter: twitter ?? user.socialLinks.twitter,
      website: website ?? user.socialLinks.website,
      email: email ?? user.socialLinks.email
    };

    if (req.file?.path) {
      user.profileImage = req.file.path;
    }

    await user.save();

    return res.json(user);
  } catch (error) {
    return next(error);
  }
});

router.post('/projects', protect, uploadProjectImage.single('image'), async (req, res, next) => {
  try {
    const { title, description, tags, externalLink } = req.body;

    if (!req.file?.path) {
      return res.status(400).json({ message: 'Project image is required' });
    }

    const project = await Project.create({
      user: req.user.id,
      title,
      description,
      tags: tags ? tags.split(',').map((item) => item.trim().toLowerCase()).filter(Boolean) : [],
      externalLink,
      imageUrl: req.file.path
    });

    return res.status(201).json(project);
  } catch (error) {
    return next(error);
  }
});

router.put('/projects/:id', protect, uploadProjectImage.single('image'), async (req, res, next) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, user: req.user.id });
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const { title, description, tags, externalLink } = req.body;

    project.title = title ?? project.title;
    project.description = description ?? project.description;
    project.externalLink = externalLink ?? project.externalLink;
    if (tags) {
      project.tags = tags.split(',').map((item) => item.trim().toLowerCase()).filter(Boolean);
    }
    if (req.file?.path) {
      project.imageUrl = req.file.path;
    }

    await project.save();

    return res.json(project);
  } catch (error) {
    return next(error);
  }
});

router.delete('/projects/:id', protect, async (req, res, next) => {
  try {
    const project = await Project.findOneAndDelete({ _id: req.params.id, user: req.user.id });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    return res.json({ message: 'Project deleted' });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
