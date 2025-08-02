// modelo/guia.js

class Guia {
  constructor(id_guia, nombre, telefono, correo, estado, turnos = []) {
    this.id_guia = id_guia;       // Cédula del guía (clave primaria)
    this.nombre = nombre;         // Nombre del guía
    this.telefono = telefono;     // Teléfono de contacto
    this.correo = correo;         // Correo electrónico
    this.estado = estado;         // 'Activo' o 'Inactivo'
    this.turnos = turnos;         // Arreglo de ID de turnos asignados
  }
}

module.exports = Guia;
