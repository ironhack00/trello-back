// user.routes.js

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const userController = require('../controllers/user.controller');
const boardController = require('../controllers/board.controller')

// Ruta USER
router.post('/users', userController.createUser);

// Ruta BOARD
router.post('/board', boardController.createBoard);

module.exports = router;

