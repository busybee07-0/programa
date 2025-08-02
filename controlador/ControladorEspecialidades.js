
// controlador/ControladorEspecialidades.js

const db = require('../bd/conexion');

const obtenerEspecialidades = (req, res) => {
  db.query('SELECT * FROM tipos_tour', (err, resultados) => {
    if (err) {
      console.error('Error al obtener especialidades:', err);
      return res.status(500).json({ error: 'Error al obtener especialidades' });
    }
    res.json(resultados);
  });
};

module.exports = {
  obtenerEspecialidades
};




