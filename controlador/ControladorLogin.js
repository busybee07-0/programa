// controlador/ControladorLogin.js
const db = require('../bd/conexion');

const login = (req, res) => {
  const { correo, contrasena } = req.body;

  const sql = 'SELECT * FROM usuarios WHERE correo = ? AND contrasena = ?';
  db.query(sql, [correo, contrasena], (err, resultados) => {
    if (err) {
      console.error('Error al hacer login:', err);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }

    if (resultados.length === 0) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    const usuario = resultados[0];
    res.json({
      mensaje: 'Login exitoso',
      tipo: usuario.tipo_usuario,  // admin o cliente
      id: usuario.id_usuario,
      nombre: usuario.nombre
    });
  });
};

module.exports = { login };
