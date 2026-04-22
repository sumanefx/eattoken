const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema(
  {
    portfolioOwner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    likedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
  },
  { timestamps: true }
);

likeSchema.index({ portfolioOwner: 1, likedBy: 1 }, { unique: true });

module.exports = mongoose.model('Like', likeSchema);
