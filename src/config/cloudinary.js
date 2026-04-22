const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const projectImageStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'portfolio-platform/projects',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp']
  }
});

const avatarStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'portfolio-platform/avatars',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp']
  }
});

module.exports = {
  cloudinary,
  projectImageStorage,
  avatarStorage
};
