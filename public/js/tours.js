document.addEventListener('DOMContentLoaded', async () => {
  const form = document.getElementById('tourForm');
  const tablaTours = document.querySelector('#tablaTours tbody');
  const visitasContainer = document.getElementById('visitasContainer');
  const tipoTourSelect = document.getElementById('tipo');
  const tiposTour = await fetchTiposTour();

  // Cargar opciones de tipos de tour
  tiposTour.forEach(tipo => {
    const option = document.createElement('option');
    option.value = tipo.id_tipo;
    option.textContent = tipo.nombre;
    tipoTourSelect.appendChild(option);
  });

  // Mostrar tours al cargar
  mostrarTours();

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nombre = document.getElementById('nombre').value;
    const descripcion = document.getElementById('descripcion').value;
    const id_tipo = parseInt(document.getElementById('tipo').value);
    const tipo_tour = document.getElementById('tipo').selectedOptions[0].text;
    const costo_empresa = parseFloat(document.getElementById('costoEmpresa').value);
    const precio_cliente = parseFloat(document.getElementById('precioCliente').value);

    // Validar mínimo 1 lugar
    const lugares = Array.from(visitasContainer.querySelectorAll('.lugar'));
    const descripciones = Array.from(visitasContainer.querySelectorAll('.descLugar'));

    if (lugares.length === 0 || lugares[0].value.trim() === '') {
      alert('Debe agregar al menos un lugar.');
      return;
    }

    const visitas = lugares.map((input, index) => ({
      lugar: input.value,
      descripcion: descripciones[index].value
    }));

    const tour = {
      nombre,
      descripcion,
      id_tipo,
      tipo_tour,
      costo_empresa,
      precio_cliente,
      visitas
    };

    const res = await fetch('/tours', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tour)
    });

    if (res.ok) {
      alert('Tour registrado con éxito');
      form.reset();
      visitasContainer.innerHTML = '';
      agregarCampoVisita(); // Agrega uno por defecto
      mostrarTours();
    } else {
      alert('Error al registrar tour');
    }
  });

  async function mostrarTours() {
    tablaTours.innerHTML = '';
    const tours = await fetch('/tours').then(r => r.json());

    for (const tour of tours) {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${tour.id_tour}</td>
        <td>${tour.nombre}</td>
        <td>${tour.descripcion}</td>
        <td>${tour.costo_empresa}</td>
        <td>${tour.precio_cliente}</td>
        <td>
          <button onclick="verVisitas(${tour.id_tour})">Ver visitas</button>
          <button onclick="eliminarTour(${tour.id_tour})" style="background:red;color:white;">Eliminar</button>
        </td>
      `;
      tablaTours.appendChild(tr);
    }
  }

  window.eliminarTour = async (id) => {
    if (confirm('¿Eliminar este tour y sus visitas?')) {
      await fetch(`/tours/${id}`, { method: 'DELETE' });
      mostrarTours();
    }
  };

  window.verVisitas = async (id) => {
    const visitas = await fetch(`/tours/${id}/visitas`).then(r => r.json());
    let contenido = `Visitas del tour ${id}:\n`;
    visitas.forEach(v => {
      contenido += `Lugar: ${v.lugar} | Descripción: ${v.descripcion}\n`;
    });
    alert(contenido);
  };

  window.agregarCampoVisita = () => {
    const div = document.createElement('div');
    div.classList.add('visita');
    div.innerHTML = `
      <input type="text" class="lugar" placeholder="Lugar" required>
      <input type="text" class="descLugar" placeholder="Descripción" required>
      <button type="button" class="eliminar" onclick="this.parentElement.remove()">❌</button>
    `;
    visitasContainer.appendChild(div);
  };

  async function fetchTiposTour() {
    const res = await fetch('/especialidades');
    return res.ok ? res.json() : [];
  }

  agregarCampoVisita(); // Agrega uno por defecto al inicio
});

