// controllers/boardController.js
const Board = require('../models/board');
const User = require('../models/user');

// Controlador para crear un nuevo board
// Controlador para crear un nuevo board
exports.createBoard = async (req, res, next) => {
  try {
    // Extraer los datos del cuerpo de la solicitud y el ``correo electrónico del usuario que lo creó
    const { nameboard, userEmail, invitees } = req.body;
    
    // Buscar al usuario por su correo electrónico
    console.log(invitees, ' aca estamos')
    const user = await User.findOne({ email: userEmail });
    /* console.log(user) */
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Crear un nuevo tablero utilizando el modelo Board y relacionarlo con el usuario
    const newBoard = await Board.create({ nameboard, users: [user._id] });
   // Agregar el ID del tablero al campo 'boards' del usuario
    user.boards.push(newBoard._id);
    user.role = 'admin'
    await user.save();


    // Devolver el nuevo tablero creado como respuesta
    res.status(201).json({ success: true, board: newBoard });
  } catch (error) {
    // Manejar errores
    console.error('Error creating board:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};


exports.getAllBoards = async (req, res, next) => {
  try {
    // Obtener todos los tableros de la base de datos, y poblar los usuarios asociados
    const boards = await Board.find().populate({
      path: 'users',
      select: 'email' // Selección del campo 'email' del usuario
    });

    // Devolver los tableros encontrados como respuesta
    res.status(200).json({ success: true, boards });
  } catch (error) {
    // Manejar errores
    console.error('Error fetching boards:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};