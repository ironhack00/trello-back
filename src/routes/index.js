const { Router } = require('express');
const path = require('path');

const routes = Router();

// Ruta de prueba
routes.get('/prueba', function(req, res) {
    res.send('Hola');
});

module.exports = routes;