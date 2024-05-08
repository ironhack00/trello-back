// user.routes.js

const express = require('express');
const router = express.Router();
const User = require('../models/user');
const userController = require('../controllers/user.controller');
const boardController = require('../controllers/board.controller');
const listController = require('../controllers/list.controller');


// Ruta USER
router.post('/users', userController.createUser);
router.get('/users', userController.getAllUsersWithBoards);
router.get('/user', userController.getUser);

// Ruta BOARD
router.post('/board', boardController.createBoard);
router.get('/boards', boardController.getAllBoards);
router.get('/board', boardController.getBoardsByUserEmail);
router.get('/board/:boardId', boardController.getBoardById); // Nueva ruta para obtener un tablero por su ID


// Ruta para eliminar una lista de un tablero
router.post('/board/:boardId/list', listController.createList); // Crear una lista en un tablero
router.put('/board/:boardId/list/:listId', listController.updateList); // Actualizar el título de una lista
router.delete('/board/:boardId/list/:listId', listController.deleteList); // Eliminar una lista de un tablero
router.post('/board/:boardId/list/:listId/card', listController.createCard); // Crear una tarjeta en una lista
router.put('/board/:boardId/list/:listId/card/:cardId', listController.updateCard); // Actualizar el título de una tarjeta
router.delete('/board/:boardId/list/:listId/card/:cardId', listController.deleteCard); // Eliminar una tarjeta de una lista
router.put('/board/:boardId/reorder-lists', listController.reorderLists);
/* router.put('/board/:boardId/list/:listId/reorder-cards', listController.reorderCards); */
router.put('/board/:boardId/move-card', listController.moveCard);

module.exports = router;

