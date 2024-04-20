// models/Board.js
const mongoose = require('mongoose');

const boardSchema = new mongoose.Schema({
  nombre: String,
  // Referencia a los IDs de los usuarios asociados
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

module.exports = mongoose.model('Board', boardSchema);
