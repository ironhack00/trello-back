// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: String,
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^\S+@\S+\.\S+$/,
  },
  password: {
    type: String,
    required: true,
  },
  // Referencia a los IDs de los boards asociados
  boards: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Board' }]
});

module.exports = mongoose.model('User', userSchema);
