// user.routes.js

const express = require('express');
const router = express.Router();
const User = require('../models/user');
const userController = require('../controllers/user.controller');
const boardController = require('../controllers/board.controller')

// Ruta USER
router.post('/users', userController.createUser);
router.get('/users', userController.getAllUsersWithBoards);
router.get('/user', userController.getUser);

// Ruta BOARD
router.post('/board', boardController.createBoard);
router.get('/boards', boardController.getAllBoards);
router.get('/board', boardController.getBoardsByUserEmail);

module.exports = router;

