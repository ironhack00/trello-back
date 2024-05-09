// controllers/boardController.js
const Board = require('../models/board');
const User = require('../models/user');
const enviarCorreo = require('./sendEmail');

// Controlador para crear un nuevo board
// Controlador para crear un nuevo board
exports.createBoard = async (req, res, next) => {
  try {
    // Extraer los datos del cuerpo de la solicitud y el correo electrónico del usuario que lo creó
    const { nameboard, userEmail, invitees } = req.body;

    // Verificar que todos los invitados tengan el formato de direcciones de correo electrónico
    const emailRegex = /\S+@\S+\.\S+/;
    
    
    // Buscar al usuario que crea el tablero por su correo electrónico
    const user = await User.findOne({ email: userEmail });
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
   /*  if (invitees[0] !== "") {
      for (const invitee of invitees) {
        if (!emailRegex.test(invitee)) {
          return res.status(400).json({ success: false, message: `${invitee} is not a valid email address` });
        }
      }
      newBoard.users.push(...invitees);
      console.log(newBoard.users)
      enviarCorreo(invitees)
    } */

    if (invitees[0] !== "") {
      for (const invitee of invitees) {
        if (!emailRegex.test(invitee)) {
          return res.status(400).json({ success: false, message: `${invitee} is not a valid email address` });
        }
      }
    }

    // Crear un nuevo tablero utilizando el modelo Board y relacionarlo con el usuario
    const newBoard = await Board.create({ 
      nameboard, 
      adminBoard: user.email, // El usuario que crea el tablero se establece como adminBoard
      users: [user.email, ...invitees.filter(invitee => emailRegex.test(invitee))] 
    });

    enviarCorreo(invitees)
    // Actualizar el campo 'boards' del usuario que crea el tablero
    user.boards.push(newBoard);
    user.role = 'admin';
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
    // Obtener todos los tableros de la base de datos, y poblar los correos electrónicos de los usuarios asociados
    const boards = await Board.find().populate({
      path: 'users',
      select: 'email role', // Selección del campo 'email' del usuario
    });

    // Devolver los tableros encontrados como respuesta
    res.status(200).json({ success: true, boards });
  } catch (error) {
    // Manejar errores
    console.error('Error fetching boards:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

exports.getBoardsByUserEmail = async (req, res, next) => {
  try {
    // Extraer el correo electrónico de la consulta (query)
    const userEmail = req.query.userEmail;

    // Verificar si se proporcionó un correo electrónico en la consulta
    if (!userEmail) {
      return res.status(400).json({ success: false, message: 'Email parameter is required' });
    }

    // Buscar al usuario por su correo electrónico para obtener su ID
    const user = await User.findOne({ email: userEmail });
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Obtener los tableros asociados con el usuario utilizando su ID
    const boards = await Board.find({ users: user.email });

    // Devolver los tableros encontrados como respuesta
    res.status(200).json({ success: true, boards });
  } catch (error) {
    // Manejar errores
    console.error('Error fetching user boards:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

// controllers/boardController.js

// Agrega las importaciones necesarias aquí

exports.getBoardById = async (req, res, next) => {
  try {
    // Extraer el ID del tablero de los parámetros de la solicitud
    const boardId = req.params.boardId;

    // Verificar si se proporcionó un ID de tablero en los parámetros
    if (!boardId) {
      return res.status(400).json({ success: false, message: 'Board ID parameter is required' });
    }

    // Buscar el tablero por su ID en la base de datos y poblar el campo 'lists'
    const board = await Board.findById(boardId).populate('lists');

    // Verificar si el tablero existe
    if (!board) {
      return res.status(404).json({ success: false, message: 'Board not found' });
    }

    // Devolver el tablero encontrado como respuesta, junto con sus listas
    res.status(200).json({ success: true, board });
  } catch (error) {
    // Manejar errores
    console.error('Error fetching board by ID:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};



