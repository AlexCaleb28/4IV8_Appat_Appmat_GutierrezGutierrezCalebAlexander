var instrucciones = [
    "Utiliza las flechas de navegación para mover las piezas",
    "Para ordenar las piezas guíate por la imagen Objetivo"
];

// Arreglo para guardar los movimientos
var movimientos = [];

// Posiciones dinámicas del rompecabezas
var rompe = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
];

// Rompecabezas correcto para comparar si ganamos
var rompeCorrecta = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
];

// Posición inicial de la pieza vacía (la 9, que está en la fila 2, columna 2)
var filaVacia = 2;
var columnaVacia = 2;

// Funciones base que mandaste para mostrar instrucciones
function mostrarInstrucciones(instrucciones) {
    for (var i = 0; i < instrucciones.length; i++) {
        mostrarInstruccionesLista(instrucciones[i], "lista-instrucciones");
    }
}

function mostrarInstruccionesLista(instruccion, idLista) {
    var ul = document.getElementById(idLista);
    var li = document.createElement("li");
    li.textContent = instruccion;
    ul.appendChild(li);
}

function actualizarVista() {
    var juego = document.getElementById('juego');
    juego.innerHTML = ''; // Limpiamos el tablero

    for (var i = 0; i < rompe.length; i++) {
        for (var j = 0; j < rompe[i].length; j++) {
            var numeroPieza = rompe[i][j];
            var divPieza = document.createElement('div');
            divPieza.className = 'piezas';
            divPieza.id = 'pieza' + numeroPieza;

            if (numeroPieza !== 9) {
                var img = document.createElement('img');
                img.src = './images/' + numeroPieza + '.jpg';
                img.alt = 'Pieza ' + numeroPieza;
                divPieza.appendChild(img);
            }
            juego.appendChild(divPieza);
        }
    }
}

function moverEnDireccion(direccion) {
    var nuevaFila;
    var nuevaColumna;

    if (direccion === 'ArrowDown') {
        nuevaFila = filaVacia - 1;
        nuevaColumna = columnaVacia;
    } else if (direccion === 'ArrowUp') {
        nuevaFila = filaVacia + 1;
        nuevaColumna = columnaVacia;
    } else if (direccion === 'ArrowRight') {
        nuevaFila = filaVacia;
        nuevaColumna = columnaVacia - 1;
    } else if (direccion === 'ArrowLeft') {
        nuevaFila = filaVacia;
        nuevaColumna = columnaVacia + 1;
    }
    if (nuevaFila >= 0 && nuevaFila <= 2 && nuevaColumna >= 0 && nuevaColumna <= 2) {
        var piezaAIntercambiar = rompe[nuevaFila][nuevaColumna];
        rompe[filaVacia][columnaVacia] = piezaAIntercambiar;
        rompe[nuevaFila][nuevaColumna] = 9;

        filaVacia = nuevaFila;
        columnaVacia = nuevaColumna;

        actualizarVista();
        actualizarUltimoMovimiento(direccion);
        checarSiGano();
    }
}

function actualizarUltimoMovimiento(direccion) {
    var flechaDiv = document.getElementById('flecha');
    if (direccion === 'ArrowUp') flechaDiv.textContent = '↑';
    if (direccion === 'ArrowDown') flechaDiv.textContent = '↓';
    if (direccion === 'ArrowLeft') flechaDiv.textContent = '←';
    if (direccion === 'ArrowRight') flechaDiv.textContent = '→';
}

function checarSiGano() {
    var gano = true;
    for (var i = 0; i < rompe.length; i++) {
        for (var j = 0; j < rompe[i].length; j++) {
            if (rompe[i][j] !== rompeCorrecta[i][j]) {
                gano = false;
            }
        }
    }
    if (gano) {
        setTimeout(function() {
            alert('¡Felicidades! Completaste el rompecabezas.');
        }, 200);
    }
}

function mezclarRompecabezas(veces) {
    var teclas = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
    for (var i = 0; i < veces; i++) {
        var random = Math.floor(Math.random() * teclas.length);
        moverEnDireccion(teclas[random]);
    }
}

// 6. Evento que escucha el teclado
document.addEventListener('keydown', function(evento) {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(evento.key)) {
        evento.preventDefault(); // Evita que se baje toda la página con las flechas
        moverEnDireccion(evento.key);
    }
});


mostrarInstrucciones(instrucciones);
actualizarVista(); 
mezclarRompecabezas(30); 