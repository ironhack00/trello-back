// controllers/boardController.js
const Board = require('../models/board');

// Controlador para crear un nuevo board
exports.createBoard = async (req, res, next) => {
  try {
    // Extraer los datos del cuerpo de la solicitud
    const { nombre } = req.body;

    // Crear un nuevo board utilizando el modelo Board
    const newBoard = await Board.create({ nombre });

    // Devolver el nuevo board creado como respuesta
    res.status(201).json({ success: true, board: newBoard });
  } catch (error) {
    // Manejar errores
    console.error('Error creating board:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};
