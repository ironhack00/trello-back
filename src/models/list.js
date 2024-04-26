// models/List.js
const mongoose = require('mongoose');

const listSchema = new mongoose.Schema({
  title: String,
  cards: [String]
});

module.exports = mongoose.model('List', listSchema);
