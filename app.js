// app.js

const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3000;

// Conexión a la base de datos
require('./bd/conexion');

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Controladores
const { login } = require('./controlador/ControladorLogin');
const guiasController = require('./controlador/ControladorGuias');
const { obtenerTurnos } = require('./controlador/ControladorTurnos');
const { obtenerEspecialidades } = require('./controlador/ControladorEspecialidades');
const toursController = require('./controlador/ControladorTours');


// Rutas
app.post('/login', login);

// Rutas para turnos
app.get('/turnos', obtenerTurnos);

// Rutas para guías
app.get('/guias', guiasController.obtenerGuias);
app.get('/guias/:id', guiasController.obtenerGuiaPorId);
app.get('/guias/:id/turnos', guiasController.obtenerTurnosGuia);
app.get('/guias/:id/especializaciones', guiasController.obtenerEspecializacionesGuia);
app.post('/guias', guiasController.insertarGuia);
app.put('/guias/:id', guiasController.actualizarGuia);
app.delete('/guias/:id', guiasController.eliminarGuia);

// Rutas para especialidades
app.get('/especialidades', obtenerEspecialidades);

// Rutas para tours
app.get('/tours', toursController.obtenerTours);
app.get('/tours/:id/visitas', toursController.obtenerVisitasPorTour);
app.post('/tours', toursController.insertarTourConVisitas);
app.delete('/tours/:id', toursController.eliminarTourConVisitas);


// Iniciar servidor
app.listen(port, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
});
