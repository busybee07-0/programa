
// controlador/ControladorTours.js

const db = require('../bd/conexion');

const obtenerTours = (req, res) => {
  const sql = `
    SELECT t.id_tour, t.nombre, t.descripcion, t.costo_empresa, t.precio_cliente, t.tipo_tour,
           tt.nombre AS nombre_tipo
    FROM tours t
    JOIN tipos_tour tt ON t.id_tipo = tt.id_tipo
  `;
  db.query(sql, (err, resultados) => {
    if (err) return res.status(500).json({ error: 'Error al obtener tours' });
    res.json(resultados);
  });
};

const obtenerVisitasPorTour = (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM visitas_guiadas WHERE id_tour = ?';
  db.query(sql, [id], (err, resultados) => {
    if (err) return res.status(500).json({ error: 'Error al obtener visitas del tour' });
    res.json(resultados);
  });
};

const insertarTour = (req, res) => {
  const { nombre, descripcion, tipo_tour, id_tipo, costo_empresa, precio_cliente, lugares } = req.body;

  const sqlTour = 'INSERT INTO tours (id_tour, nombre, descripcion, id_tipo, costo_empresa, precio_cliente, tipo_tour) VALUES (?, ?, ?, ?, ?, ?, ?)';
  db.query(sqlTour, [req.body.id_tour, nombre, descripcion, id_tipo, costo_empresa, precio_cliente, tipo_tour], (err, resultadoTour) => {
    if (err) return res.status(500).json({ error: 'Error al insertar tour', detalle: err });

    const id_tour = req.body.id_tour;

    const sqlVisitas = 'INSERT INTO visitas_guiadas (id_visita, id_tour, lugar, descripcion) VALUES (?, ?, ?, ?)';
    lugares.forEach((visita) => {
      db.query(sqlVisitas, [visita.id_visita, id_tour, visita.lugar, visita.descripcion], (err) => {
        if (err) console.error('Error al insertar visita:', err);
      });
    });

    res.status(201).json({ mensaje: 'Tour insertado correctamente' });
  });
};

const eliminarTour = (req, res) => {
  const { id } = req.params;

  db.query('DELETE FROM visitas_guiadas WHERE id_tour = ?', [id], (err) => {
    if (err) return res.status(500).json({ error: 'Error al eliminar visitas' });

    db.query('DELETE FROM tours WHERE id_tour = ?', [id], (err2) => {
      if (err2) return res.status(500).json({ error: 'Error al eliminar tour' });
      res.json({ mensaje: 'Tour eliminado correctamente' });
    });
  });
};

module.exports = {
  obtenerTours,
  obtenerVisitasPorTour,
  insertarTour,
  eliminarTour
};
