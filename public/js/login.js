// Clase Usuario para el navegador
class Usuario {
  constructor(id_usuario, nombre, correo, contrasena) {
    this.id_usuario = id_usuario;
    this.nombre = nombre;
    this.correo = correo;
    this.contrasena = contrasena;
  }
}

// Confirmar que el JS se cargó
console.log("✅ login.js cargado");

document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  console.log("🔁 Se envió el formulario");

  const correo = document.getElementById('correo').value;
  const contrasena = document.getElementById('contrasena').value;

  try {
    const res = await fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ correo, contrasena })
    });

    const data = await res.json();

    if (res.ok) {
      // Crear objeto usuario
      const usuario = new Usuario(data.id, data.nombre, correo, contrasena);

      // Guardar en localStorage
      localStorage.setItem('usuario', JSON.stringify(usuario));

      // Redirigir por tipo
      if (data.tipo === 'admin') {
        window.location.href = 'admin.html';
      } else {
        window.location.href = 'cliente.html';
      }
    } else {
      alert(data.error || 'Credenciales incorrectas');
    }

  } catch (error) {
    console.error('Error al conectar con el servidor:', error);
    alert('Error en el servidor');
  }
});





