// models/Pizarra.js
const mongoose = require('mongoose');

const boardSchema = new mongoose.Schema({
  nombre: String
});

module.exports = mongoose.model('Board', boardSchema);
