const mongoose = require('mongoose');
require('dotenv').config();

/* const { MONGO_URI } = process.env; */
const MONGO_URI = 'mongodb+srv://guilleAdmin:x1f3ZDx4CBaxQYzv@mongodb01.8excrlv.mongodb.net/trello-clone';
const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1); // Exit with failure
  }
};

module.exports = connectDB;
