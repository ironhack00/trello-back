// user.routes.js

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const userController = require('../controllers/user.controller');

// Ruta para crear un nuevo usuario
router.post('/users', userController.createUser);

module.exports = router;

