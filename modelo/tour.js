
// modelo/Tour.js

class Tour {
  constructor(id_tour, nombre, descripcion, id_tipo, costo_empresa, precio_cliente, tipo_tour) {
    this.id_tour = id_tour;
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.id_tipo = id_tipo;
    this.costo_empresa = costo_empresa;
    this.precio_cliente = precio_cliente;
    this.tipo_tour = tipo_tour;
  }
}

module.exports = Tour;
