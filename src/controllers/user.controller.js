const bcrypt = require('bcryptjs');
const User = require('../models/User');
const mongoose = require('mongoose');

// Función de validación del password
const validatePassword = (password) => /[A-Z]/.test(password) && /[\W_]/.test(password);

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
    const { username, email, password } = req.body;
    console.log(username, email, password)

    // Verificar si el password cumple con los requisitos
    if (!validatePassword(password)) {
      return res.status(400).json({ message: 'La contraseña no cumple con los requisitos. Debe tener al menos una mayúscula y un caracter especial.' });
    }

    // Verificar si ya existe un usuario con el mismo correo electrónico
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      // El correo electrónico ya está en uso
      return res.status(400).json({ message: 'El correo electrónico ya está en uso. Por favor, elija otro.' });
    }
    
    // Hash de la contraseña utilizando bcrypt
    const hashedPassword = await bcrypt.hash(password, 10); // 10 es el costo del hash

    // Crear el nuevo usuario con la contraseña hasheada
    const newUser = await User.create({ name:username, email, password: hashedPassword });
    
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

exports.setupUniqueIndex = async (req, res) => {
  await createUniqueIndex();
  res.status(200).json({ message: 'Índice único creado con éxito' });
};
