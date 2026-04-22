const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    imageUrl: { type: String, required: true },
    tags: [{ type: String, trim: true, lowercase: true }],
    externalLink: { type: String, default: '' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Project', projectSchema);
