// app.js
const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const routes = require('./src/routes/index');
const connectDB = require('./db.js');

const app = express();

app.name = 'Back-Trello';

// Middleware
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(cookieParser());
app.use(morgan('combined'));
app.use(helmet());
app.use(cors({ origin: ['http://localhost:3001', 'https://trello-3.vercel.app'], credentials: true }));

// Conexión a MongoDB
connectDB();

// Rutas
app.use('/', routes);

// Manejo de errores centralizado
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  console.error(err);
  res.status(status).send(message);
});

// Inicia el servidor
app.listen(3000, () => {
  console.log('Servidor escuchando en el puerto 3000');
});

module.exports = app;
