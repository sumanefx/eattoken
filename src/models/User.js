const mongoose = require('mongoose');

const socialLinksSchema = new mongoose.Schema(
  {
    github: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    twitter: { type: String, default: '' },
    website: { type: String, default: '' },
    email: { type: String, default: '' }
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, lowercase: true, trim: true },
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    bio: { type: String, default: '' },
    skills: [{ type: String, trim: true }],
    socialLinks: { type: socialLinksSchema, default: () => ({}) },
    profileImage: {
      type: String,
      default:
        'https://res.cloudinary.com/demo/image/upload/v1692488519/avatars/default-avatar.png'
    },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    featured: { type: Boolean, default: false },
    viewCount: { type: Number, default: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
