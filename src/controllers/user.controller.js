const bcrypt = require('bcryptjs');
const User = require('../models/user');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

// Función de validación del password
const validatePassword = (password) => {
  if (!/[A-Z]/.test(password)) {
      return "La contraseña debe contener al menos una letra mayúscula.";
  }
  if (!/[\W_]/.test(password)) {
      return "La contraseña debe contener al menos un carácter especial.";
  }
  return true;
};

// Crear un índice único en la colección de usuarios para el campo de correo electrónico
const createUniqueIndex = async () => {
  try {
    await mongoose.connection.collection('users').createIndex({ email: 1 }, { unique: true });
    console.log('Índice único creado con éxito en el campo email.');
  } catch (err) {
    console.error('Error al crear el índice único:', err.message);
    console.error('Ya existe un usuario con el mismo correo electrónico.');
  }
};

exports.createUser = async (req, res) => {
  try {
    let { username, email, password } = req.body; // Destructuramos los datos del cuerpo de la solicitud
    let token = req.body.credential; // Obtenemos el token de la solicitud
    console.log(username, email, password);

    // Verificar si se proporcionó un token y si es una cuenta de Google
    if (token) {
      const decodedToken = jwt.decode(token, { complete: true });

      // Verificar si el token es válido y contiene la información necesaria
      if (decodedToken && decodedToken.payload) {

        // Si el correo electrónico está verificado en el token, usamos esos datos
        if (decodedToken.payload.email_verified) {
          email = decodedToken.payload.email;

          // Buscar al usuario por su dirección de correo electrónico
          const existingUser = await User.findOne({ email });

          if (existingUser) {
            // El usuario ya existe, devolver los datos del usuario existente
            return res.status(200).json(existingUser);
          } else {
            // Si el usuario no existe, se debe crear
            username = decodedToken.payload.given_name;
            password = 'miPaswword00*';
          }
        }
      }
    }

    // Verificar si ya existe un usuario con el mismo correo electrónico (solo si no es una cuenta de Google)
    if (!token) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        // El correo electrónico ya está en uso
        return res.status(400).json({ message: 'El correo electrónico ya está en uso. Por favor, elija otro.' });
      }
    }

    // Verificar si el password cumple con los requisitos
    /* if (!validatePassword(password)) {
      return res.status(400).json({ message: 'La contraseña no cumple con los requisitos. Debe tener al menos una mayúscula y un caracter especial.' });
    } */
    const validationResult = validatePassword(password);
      if (validationResult !== true) {
    return res.status(400).json({ message: validationResult });
}

    // Hash de la contraseña utilizando bcrypt
    const hashedPassword = await bcrypt.hash(password, 10); // 10 es el costo del hash

    // Crear el nuevo usuario con la contraseña hasheada
    const newUser = await User.create({ name: username, email, password: hashedPassword });

    res.status(201).json(newUser);
  } catch (error) {
    // Manejar los errores de forma centralizada
    if (error.name === 'ValidationError') {
      // Error de validación, probablemente relacionado con el correo electrónico o la contraseña
      let errorMessage = 'Error creando usuario';
      if (error.errors && error.errors.email && error.errors.email.kind === 'unique') {
        errorMessage = 'El correo electrónico ya está en uso. Por favor, elija otro.';
      } else if (!validatePassword(req.body.password)) {
        errorMessage = 'La contraseña no cumple con los requisitos. Debe tener al menos una mayúscula y un caracter especial.';
      }
      res.status(400).json({ message: errorMessage });
    } else {
      // Otro tipo de error
      console.error('Error creando usuario:', error);
      res.status(500).json({ message: 'Error creando usuario' });
    }
  }
};


exports.getUser = async (req, res) => {
  try {
    const { email, password } = req.query;
    console.log( email, password )
    // Buscar al usuario por su dirección de correo electrónico
    const user = await User.findOne({ email }).populate('boards');
    console.log(user)
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Verificar si la contraseña ingresada es correcta
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    // Si la contraseña es correcta, devolver al usuario
    res.status(200).json(user);
  } catch (error) {
    console.error('Error obteniendo usuario:', error);
    res.status(500).json({ message: 'Error obteniendo usuario' });
  }
};


exports.getAllUsersWithBoards = async (req, res) => {
  try {
    // Buscar todos los usuarios y poblar los tableros asociados
    const usersWithBoards = await User.find().populate('boards');

    res.status(200).json(usersWithBoards);
  } catch (error) {
    console.error('Error obteniendo usuarios con tableros:', error);
    res.status(500).json({ message: 'Error obteniendo usuarios con tableros' });
  }
};


exports.setupUniqueIndex = async (req, res) => {
  await createUniqueIndex();
  res.status(200).json({ message: 'Índice único creado con éxito' });
};
