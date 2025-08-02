// controlador/ControladorGuias.js

const db = require('../bd/conexion');

const obtenerGuias = async (req, res) => {
  try {
    const [guias] = await db.promise().query('SELECT * FROM guias');

    for (const guia of guias) {
      const [turnos] = await db.promise().query(`
        SELECT t.* FROM disponibilidad_guias dg
        JOIN turnos t ON t.id_turno = dg.id_turno
        WHERE dg.id_guia = ?
      `, [guia.id_guia]);

      const [especialidades] = await db.promise().query(`
        SELECT tt.* FROM especializaciones_guia eg
        JOIN tipos_tour tt ON tt.id_tipo = eg.id_tipo
        WHERE eg.id_guia = ?
      `, [guia.id_guia]);

      guia.turnos = turnos;
      guia.especialidades = especialidades;
    }

    res.json(guias);
  } catch (error) {
    console.error('Error al obtener guias:', error);
    res.status(500).json({ error: 'Error al obtener guias' });
  }
};

const obtenerGuiaPorId = async (req, res) => {
  const id = req.params.id;
  try {
    const [guiaRows] = await db.promise().query('SELECT * FROM guias WHERE id_guia = ?', [id]);
    if (guiaRows.length === 0) return res.status(404).json({ error: 'Guía no encontrada' });

    const guia = guiaRows[0];

    const [turnos] = await db.promise().query(`
      SELECT t.* FROM disponibilidad_guias dg
      JOIN turnos t ON t.id_turno = dg.id_turno
      WHERE dg.id_guia = ?
    `, [id]);

    const [especialidades] = await db.promise().query(`
      SELECT tt.* FROM especializaciones_guia eg
      JOIN tipos_tour tt ON tt.id_tipo = eg.id_tipo
      WHERE eg.id_guia = ?
    `, [id]);

    res.json({ guia, turnos, especialidades });
  } catch (error) {
    console.error('Error al obtener guía:', error);
    res.status(500).json({ error: 'Error al obtener guía' });
  }
};

const insertarGuia = async (req, res) => {
  const { guia, turnos, especialidades } = req.body;
  try {
    await db.promise().query('INSERT INTO guias SET ?', [guia]);

    for (const id_turno of turnos) {
      await db.promise().query('INSERT INTO disponibilidad_guias (id_guia, id_turno) VALUES (?, ?)', [guia.id_guia, id_turno]);
    }

    for (const id_tipo of especialidades) {
      await db.promise().query('INSERT INTO especializaciones_guia (id_guia, id_tipo) VALUES (?, ?)', [guia.id_guia, id_tipo]);
    }

    res.json({ mensaje: 'Guía insertado correctamente' });
  } catch (error) {
    console.error('Error al insertar guía:', error);
    res.status(500).json({ error: 'Error al insertar guía' });
  }
};

const actualizarGuia = async (req, res) => {
  const id = req.params.id;
  const { guia, turnos, especialidades } = req.body;

  try {
    await db.promise().query('UPDATE guias SET nombre = ?, telefono = ?, correo = ?, estado = ? WHERE id_guia = ?', [
      guia.nombre, guia.telefono, guia.correo, guia.estado, id
    ]);

    await db.promise().query('DELETE FROM disponibilidad_guias WHERE id_guia = ?', [id]);
    await db.promise().query('DELETE FROM especializaciones_guia WHERE id_guia = ?', [id]);

    for (const id_turno of turnos) {
      await db.promise().query('INSERT INTO disponibilidad_guias (id_guia, id_turno) VALUES (?, ?)', [id, id_turno]);
    }

    for (const id_tipo of especialidades) {
      await db.promise().query('INSERT INTO especializaciones_guia (id_guia, id_tipo) VALUES (?, ?)', [id, id_tipo]);
    }

    res.json({ mensaje: 'Guía actualizada correctamente' });
  } catch (error) {
    console.error('Error al actualizar guía:', error);
    res.status(500).json({ error: 'Error al actualizar guía' });
  }
};

const eliminarGuia = async (req, res) => {
  const id = req.params.id;
  try {
    await db.promise().query('DELETE FROM disponibilidad_guias WHERE id_guia = ?', [id]);
    await db.promise().query('DELETE FROM especializaciones_guia WHERE id_guia = ?', [id]);
    await db.promise().query('DELETE FROM guias WHERE id_guia = ?', [id]);

    res.json({ mensaje: 'Guía eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar guía:', error);
    res.status(500).json({ error: 'Error al eliminar guía' });
  }
};

const obtenerTurnosGuia = async (req, res) => {
  const id = req.params.id;
  try {
    const [turnos] = await db.promise().query(`
      SELECT t.* FROM disponibilidad_guias dg
      JOIN turnos t ON t.id_turno = dg.id_turno
      WHERE dg.id_guia = ?
    `, [id]);
    res.json(turnos);
  } catch (error) {
    console.error('Error al obtener turnos:', error);
    res.status(500).json({ error: 'Error al obtener turnos' });
  }
};

const obtenerEspecializacionesGuia = async (req, res) => {
  const id = req.params.id;
  try {
    const [especialidades] = await db.promise().query(`
      SELECT tt.* FROM especializaciones_guia eg
      JOIN tipos_tour tt ON tt.id_tipo = eg.id_tipo
      WHERE eg.id_guia = ?
    `, [id]);
    res.json(especialidades);
  } catch (error) {
    console.error('Error al obtener especialidades:', error);
    res.status(500).json({ error: 'Error al obtener especialidades' });
  }
};

module.exports = {
  obtenerGuias,
  obtenerGuiaPorId,
  insertarGuia,
  actualizarGuia,
  eliminarGuia,
  obtenerTurnosGuia,
  obtenerEspecializacionesGuia
};
