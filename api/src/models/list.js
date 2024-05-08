// models/List.js
const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  id: String,
  title: String
});

const listSchema = new mongoose.Schema({
  title: String,
  cards: [cardSchema] // Ahora cards es un arreglo de objetos definidos por cardSchema
});

module.exports = mongoose.model('List', listSchema);
