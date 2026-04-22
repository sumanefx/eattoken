const mongoose = require('mongoose');

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error('MONGO_URI is not defined in environment variables.');
  }

  await mongoose.connect(mongoUri, {
    autoIndex: process.env.NODE_ENV !== 'production'
  });

  console.log('MongoDB connected');
};

module.exports = connectDB;
