
const db = require('../bd/conexion');

const obtenerTurnos = (req, res) => {
  const sql = 'SELECT * FROM turnos';

  db.query(sql, (err, resultados) => {
    if (err) {
      return res.status(500).json({ error: 'Error al obtener turnos' });
    }
    res.json(resultados);
  });
};

module.exports = { obtenerTurnos };
