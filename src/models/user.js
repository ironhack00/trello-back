const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: String,
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^\S+@\S+\.\S+$/,
  },
  password: {
    type: String,
    required: true,
    minlength: 7,
    validate: {
      validator: function(value) {
        return /[A-Z]/.test(value) && /[\W_]/.test(value);
      },
      message: props => `${props.value} no cumple con los requisitos de contraseña. Debe tener al menos una mayúscula y un caracter especial.`,
    },
  },
});

module.exports = mongoose.model('User', userSchema);
