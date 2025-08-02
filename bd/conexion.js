
const mysql = require('mysql2');

const conexion = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'bdtours'
});

conexion.connect((err) => {
  if (err) {
    console.error('❌ Error al conectar:', err.message);
  } else {
    console.log('✅ Conexión exitosa a la base de datos.');
  }
});

module.exports = conexion;