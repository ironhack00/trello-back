// models/Board.js
const mongoose = require('mongoose');

const boardSchema = new mongoose.Schema({
  nameboard: {
    type: String,
    required: true,
    unique: true
  },
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Referencia a los usuarios asociados
  lists: [{ type: mongoose.Schema.Types.ObjectId, ref: 'List' }], // Usando una referencia al modelo List
  created_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Board', boardSchema);
