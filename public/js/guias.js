let turnosDisponibles = [];
let especialidadesDisponibles = [];

document.addEventListener('DOMContentLoaded', async () => {
  await cargarTurnos();
  await cargarEspecialidades();
  agregarTurno(); // Inicial
  agregarEspecialidad(); // Inicial
  cargarGuias();
});

async function cargarTurnos() {
  try {
    const res = await fetch('http://localhost:3000/turnos');
    turnosDisponibles = await res.json();
    actualizarSelectsTurnos();
  } catch (error) {
    console.error('Error al cargar turnos:', error);
  }
}

async function cargarEspecialidades() {
  try {
    const res = await fetch('http://localhost:3000/especialidades');
    especialidadesDisponibles = await res.json();
    actualizarSelectsEspecialidades();
  } catch (error) {
    console.error('Error al cargar especialidades:', error);
  }
}

function actualizarSelectsTurnos() {
  document.querySelectorAll('.turno').forEach(select => {
    const valorSeleccionado = select.value;
    select.innerHTML = '<option value="">Seleccione un turno</option>';
    turnosDisponibles.forEach(turno => {
      const option = document.createElement('option');
      option.value = turno.id_turno;
      option.textContent = `${turno.dia_semana} - ${turno.hora_inicio} a ${turno.hora_fin}`;
      select.appendChild(option);
    });
    select.value = valorSeleccionado;
  });
}

function actualizarSelectsEspecialidades() {
  document.querySelectorAll('.especialidad').forEach(select => {
    const valorSeleccionado = select.value;
    select.innerHTML = '<option value="">Seleccione una especialidad</option>';
    especialidadesDisponibles.forEach(tipo => {
      const option = document.createElement('option');
      option.value = tipo.id_tipo;
      option.textContent = tipo.nombre;
      select.appendChild(option);
    });
    select.value = valorSeleccionado;
  });
}

function agregarTurno() {
  const div = document.createElement('div');
  div.className = 'turno-select';

  const select = document.createElement('select');
  select.className = 'turno';
  select.required = true;
  div.appendChild(select);

  if (document.querySelectorAll('.turno').length > 0) {
    const btn = document.createElement('button');
    btn.innerHTML = '&times;';
    btn.type = 'button';
    btn.classList.add('boton-x');
    btn.onclick = () => div.remove();
    div.appendChild(btn);
  }

  document.getElementById('contenedorTurnos').appendChild(div);
  actualizarSelectsTurnos();
}

function agregarEspecialidad() {
  const div = document.createElement('div');
  div.className = 'especialidad-select';

  const select = document.createElement('select');
  select.className = 'especialidad';
  select.required = true;
  div.appendChild(select);

  if (document.querySelectorAll('.especialidad').length > 0) {
    const btn = document.createElement('button');
    btn.innerHTML = '&times;';
    btn.type = 'button';
    btn.classList.add('boton-x');
    btn.onclick = () => div.remove();
    div.appendChild(btn);
  }

  document.getElementById('contenedorEspecializaciones').appendChild(div);
  actualizarSelectsEspecialidades();
}

document.getElementById('formGuia').addEventListener('submit', async (e) => {
  e.preventDefault();

  const id = document.getElementById('idGuiaEditar').value;
  const guia = {
    id_guia: document.getElementById('cedulaGuia').value,
    nombre: document.getElementById('nombreGuia').value,
    telefono: document.getElementById('telefonoGuia').value,
    correo: document.getElementById('correoGuia').value,
    estado: document.getElementById('estadoGuia').value
  };

  const turnos = Array.from(document.querySelectorAll('.turno'))
    .map(select => select.value)
    .filter((id, i, self) => id && self.indexOf(id) === i); // evita repetidos

  const especialidades = Array.from(document.querySelectorAll('.especialidad'))
    .map(select => select.value)
    .filter((id, i, self) => id && self.indexOf(id) === i); // evita repetidos

  const payload = { guia, turnos, especialidades };

  const url = id ? `http://localhost:3000/guias/${id}` : 'http://localhost:3000/guias';
  const metodo = id ? 'PUT' : 'POST';

  try {
    const res = await fetch(url, {
      method: metodo,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    alert(data.mensaje || 'Operación exitosa');
    resetFormulario();
    cargarGuias();
  } catch (error) {
    console.error('Error al guardar guía:', error);
    alert('Ocurrió un error al guardar la guía');
  }
});

async function cargarGuias() {
  try {
    const res = await fetch('http://localhost:3000/guias');
    const guias = await res.json();
    mostrarGuias(guias);
  } catch (error) {
    console.error('Error al cargar guías:', error);
  }
}

function mostrarGuias(guias) {
  const tbody = document.getElementById('tablaGuias');
  const disponibilidad = document.getElementById('tablaDisponibilidad');
  const especialidades = document.getElementById('tablaEspecializaciones');

  tbody.innerHTML = '';
  disponibilidad.innerHTML = '';
  especialidades.innerHTML = '';

  guias.forEach(g => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${g.id_guia}</td>
      <td>${g.nombre}</td>
      <td>${g.telefono}</td>
      <td>${g.correo}</td>
      <td>${g.estado}</td>
      <td>
        <button onclick="editarGuia('${g.id_guia}')">Editar</button>
        <button onclick="eliminarGuia('${g.id_guia}')">Eliminar</button>
      </td>
    `;
    tbody.appendChild(tr);

    const turnoTR = document.createElement('tr');
    turnoTR.innerHTML = `
      <td>${g.nombre}</td>
      <td>${g.turnos.map(t => `${t.dia_semana} (${t.hora_inicio}-${t.hora_fin})`).join(', ')}</td>`;
    disponibilidad.appendChild(turnoTR);

    const espTR = document.createElement('tr');
    espTR.innerHTML = `
      <td>${g.nombre}</td>
      <td>${g.especialidades.map(e => e.nombre).join(', ')}</td>`;
    especialidades.appendChild(espTR);
  });
}

async function editarGuia(id) {
  try {
    const res = await fetch(`http://localhost:3000/guias/${id}`);
    const data = await res.json();

    const g = data.guia;
    const turnos = data.turnos.map(t => t.id_turno);
    const especialidades = data.especialidades.map(e => e.id_tipo);

    document.getElementById('idGuiaEditar').value = g.id_guia;
    document.getElementById('cedulaGuia').value = g.id_guia;
    document.getElementById('cedulaGuia').disabled = true;
    document.getElementById('nombreGuia').value = g.nombre;
    document.getElementById('telefonoGuia').value = g.telefono;
    document.getElementById('correoGuia').value = g.correo;
    document.getElementById('estadoGuia').value = g.estado;

    document.getElementById('contenedorTurnos').innerHTML = '';
    document.getElementById('contenedorEspecializaciones').innerHTML = '';

    turnos.forEach(id_turno => {
      agregarTurno();
      const selects = document.querySelectorAll('.turno');
      selects[selects.length - 1].value = id_turno;
    });

    especialidades.forEach(id_tipo => {
      agregarEspecialidad();
      const selects = document.querySelectorAll('.especialidad');
      selects[selects.length - 1].value = id_tipo;
    });

  } catch (error) {
    console.error('Error al editar guía:', error);
  }
}

async function eliminarGuia(id) {
  if (!confirm('¿Desea eliminar este guía?')) return;

  try {
    const res = await fetch(`http://localhost:3000/guias/${id}`, {
      method: 'DELETE'
    });
    const data = await res.json();
    alert(data.mensaje || 'Guía eliminado');
    cargarGuias();
  } catch (error) {
    console.error('Error al eliminar guía:', error);
  }
}

function resetFormulario() {
  document.getElementById('formGuia').reset();
  document.getElementById('idGuiaEditar').value = '';
  document.getElementById('cedulaGuia').disabled = false;
  document.getElementById('contenedorTurnos').innerHTML = '';
  document.getElementById('contenedorEspecializaciones').innerHTML = '';
  agregarTurno();
  agregarEspecialidad();
}

