async function cargarTodo() {
    cargarMesas();
    cargarRentasActivas();
    cargarProductos();
    cargarVentas();
}

// 1. MESAS Y RENTAS DE TIEMPO

async function cargarMesas() {
    const res = await fetch('/api/mesas');
    const mesas = await res.json();
    const tbody = document.getElementById('tabla-mesas');
    tbody.innerHTML = '';
    
    mesas.forEach(m => {
        const isDisp = m.estado.toLowerCase() === 'disponible';
        tbody.innerHTML += `
            <tr>
                <td>Mesa ${m.id}</td>
                <td>${m.tipo}</td>
                <td><span class="${isDisp ? 'status-disponible' : 'status-ocupada'}">${m.estado}</span></td>
                <td>
                    <button class="btn btn-blue" ${!isDisp ? 'disabled style="opacity:0.5; cursor:not-allowed;"' : ''} onclick="rentarMesa(${m.id})">Rentar</button>
                </td>
            </tr>
        `;
    });
}

async function rentarMesa(id_mesa) {
    const res = await fetch('/api/rentar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_mesa })
    });
    if(res.ok) cargarTodo();
}

async function cargarRentasActivas() {
    const res = await fetch('/api/rentas-activas');
    const rentas = await res.json();
    const tbody = document.getElementById('tabla-rentas');
    tbody.innerHTML = '';

    if(rentas.length === 0) return tbody.innerHTML = `<tr><td colspan="3" class="empty-msg">No hay mesas ocupadas</td></tr>`;

    rentas.forEach(r => {
        tbody.innerHTML += `
            <tr>
                <td>Mesa ${r.id_mesa}</td>
                <td>${r.hora_inicio}</td>
                <td><button class="btn btn-red" onclick="cobrarRenta(${r.id_renta})">Cobrar</button></td>
            </tr>
        `;
    });
}

async function cobrarRenta(id_renta) {
    const res = await fetch('/api/cobrar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_renta })
    });
    if(res.ok) {
        const data = await res.json();
        alert(`¡Mesa liberada! Tiempo cobrado: $${data.total}`);
        cargarTodo();
    }
}

// 2. CATÁLOGO DE PRODUCTOS (ACCESORIOS)

async function cargarProductos() {
    const res = await fetch('/api/productos');
    const productos = await res.json();
    const tbody = document.getElementById('tabla-productos');
    tbody.innerHTML = '';

    if(productos.length === 0) return tbody.innerHTML = `<tr><td colspan="4" class="empty-msg">Catálogo vacío</td></tr>`;
    
    productos.forEach(p => {
        tbody.innerHTML += `
            <tr>
                <td>${p.nombre}</td>
                <td>${p.stock}</td>
                <td>$${parseFloat(p.precio).toFixed(2)}</td>
                <td>
                    <div class="action-group">
                        <button class="btn btn-green" onclick="rentarAccesorio(${p.id})">Asignar</button>
                        <button class="btn btn-purple" onclick='editarProducto(${p.id}, "${p.nombre}", ${p.stock}, ${p.precio})'>Editar</button>
                        <button class="btn btn-orange" onclick="modificarStock(${p.id}, ${p.stock})">Disp.</button>
                        <button class="btn btn-red" onclick="eliminarProducto(${p.id})">Quitar</button>
                    </div>
                </td>
            </tr>
        `;
    });
}

async function editarProducto(id, nombreActual, stockActual, precioActual) {
    let nuevoNombre = prompt("Modifica el nombre:", nombreActual);
    let nuevoStock = prompt("Modifica la cantidad (mayor a 0):", stockActual);
    let nuevoPrecio = prompt("Modifica el precio de renta (mayor a $0):", precioActual);

    if (nuevoNombre === null || nuevoStock === null || nuevoPrecio === null) return; 

    const res = await fetch(`/api/productos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            nombre: nuevoNombre,
            stock: parseInt(nuevoStock),
            precio: parseFloat(nuevoPrecio)
        })
    });

    if (res.ok) cargarTodo();
    else {
        const data = await res.json();
        alert(`Servidor rechazó la acción:\n${data.error}`);
    }
}

async function rentarAccesorio(id) {
    const inputCantidad = prompt("¿Cuántos artículos vas a rentar? (mayor a 0)", "1");
    if (inputCantidad === null) return; 

    const res = await fetch('/api/productos/vender', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: parseInt(id), cantidad: parseInt(inputCantidad) })
    });

    if (res.ok) cargarTodo();
    else {
        const data = await res.json();
        alert(`Servidor rechazó la acción:\n${data.error}`);
    }
}

async function modificarStock(id, stockActual) {
    const inputStock = prompt("Actualizar la cantidad (mayor a 0):", stockActual);
    if(inputStock === null) return;
    
    const res = await fetch('/api/productos/stock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: parseInt(id), nuevoStock: parseInt(inputStock) })
    });
    
    if(res.ok) cargarTodo();
    else {
        const data = await res.json();
        alert(`Servidor rechazó la acción:\n${data.error}`);
    }
}

async function eliminarProducto(id) {
    if (!confirm("¿Seguro que quieres borrar este artículo del catálogo?")) return;
    const res = await fetch(`/api/productos/${id}`, { method: 'DELETE' });
    if (res.ok) cargarTodo();
}

// 3. REGISTRO DE RENTAS Y DEVOLUCIÓN

async function cargarVentas() {
    const res = await fetch('/api/ventas');
    const ventas = await res.json();
    const tbody = document.getElementById('tabla-ventas');
    tbody.innerHTML = '';

    if(ventas.length === 0) return tbody.innerHTML = `<tr><td colspan="4" class="empty-msg">Sin registros de equipo rentado</td></tr>`;

    ventas.forEach(v => {
        tbody.innerHTML += `
            <tr>
                <td>${v.nombre}</td>
                <td>${v.cantidad}</td>
                <td>$${parseFloat(v.total).toFixed(2)}</td>
                <td>
                    <button class="btn btn-red" onclick="cobrarAccesorio(${v.id}, ${v.total})">Cobrar</button>
                </td>
            </tr>
        `;
    });
}

async function cobrarAccesorio(id_venta, totalCobro) {
    if (!confirm(`¿Confirmar cobro de $${totalCobro} y devolver el artículo al inventario?`)) return;

    const res = await fetch('/api/ventas/cobrar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_venta: id_venta })
    });

    if (res.ok) {
        cargarTodo();
    } else {
        const data = await res.json();
        alert(`Error al devolver equipo:\n${data.error}`);
    }
}

// 4. NUEVO ARTÍCULO (Agregar)
document.getElementById('btnAgregarProducto').addEventListener('click', async (e) => {
    e.preventDefault(); 
    let nombre = prompt('Descripción del Artículo (Ej. Guante Kamui, Taco Predator):');
    if(nombre === null) return;

    let inputStock = prompt('Cantidad en mostrador (mayor a 0):', "5");
    if(inputStock === null) return;

    let inputPrecio = prompt('Precio de renta por partida en $ (mayor a 0):', "30");
    if(inputPrecio === null) return;

    const response = await fetch('/api/productos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            nombre: nombre, 
            stock: parseInt(inputStock), 
            precio: parseFloat(inputPrecio) 
        })
    });

    if (response.ok) cargarTodo();
    else {
        const data = await response.json();
        alert(`Servidor rechazó la acción:\n${data.error}`);
    }
});

window.onload = cargarTodo;