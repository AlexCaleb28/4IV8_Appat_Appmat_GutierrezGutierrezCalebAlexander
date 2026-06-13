var miRegex = /^[0-9.]+$/; 

var areaResultado = document.getElementById("resultado");

function escribirResultado(mensaje) {
    document.getElementById("resultado").innerHTML = mensaje;
}

// 1
function ejercicio1() {
    var inversion = prompt("Cuanto vas a invertir?");
    if (miRegex.test(inversion)) {
        var interes = parseFloat(inversion) * 0.02; 
        escribirResultado("Tu ganancia es de: $" + interes.toFixed(2));
    } else {
        alert("Pon solo numeros por favor");
    }
}

// 2
function ejercicio2() {
    var sueldoBase = prompt("Cual es tu sueldo base?");
    var v1 = prompt("Venta 1:");
    var v2 = prompt("Venta 2:");
    var v3 = prompt("Venta 3:");

    if (miRegex.test(sueldoBase) && miRegex.test(v1)) {
        var comision = (parseFloat(v1) + parseFloat(v2) + parseFloat(v3)) * 0.10;
        var total = parseFloat(sueldoBase) + comision;
        escribirResultado("Comisiones: $" + comision.toFixed(2) + "<br>Total a recibir: $" + total.toFixed(2));
    } else {
        alert("Datos incorrectos");
    }
}

// 3
function ejercicio3() {
    var totalCompra = prompt("Cual fue el total de la compra?");
    if (miRegex.test(totalCompra)) {
        var descuento = parseFloat(totalCompra) * 0.15;
        var totalPagar = totalCompra - descuento;
        escribirResultado("Total con descuento aplicado: $" + totalPagar.toFixed(2));
    } else {
        alert("Dato incorrecto");
    }
}

// 4
function ejercicio4() {
    var p1 = prompt("Calificacion Parcial 1:");
    var p2 = prompt("Calificacion Parcial 2:");
    var p3 = prompt("Calificacion Parcial 3:");
    var ex = prompt("Calificacion Examen Final:");
    var tr = prompt("Calificacion Trabajo Final:");

    if (miRegex.test(p1) && miRegex.test(ex)) {
        var promedio = (parseFloat(p1) + parseFloat(p2) + parseFloat(p3)) / 3;
        var final = (promedio * 0.55) + (parseFloat(ex) * 0.30) + (parseFloat(tr) * 0.15);
        escribirResultado("Tu calificacion final es: " + final.toFixed(2));
    }
}

// 5
function ejercicio5() {
    var hombres = prompt("Cuantos hombres hay?");
    var mujeres = prompt("Cuantas mujeres hay?");
    
    if (miRegex.test(hombres) && miRegex.test(mujeres)) {
        var total = parseInt(hombres) + parseInt(mujeres);
        var porcH = (parseInt(hombres) / total) * 100;
        var porcM = (parseInt(mujeres) / total) * 100;
        escribirResultado("Hombres: " + porcH.toFixed(2) + "% <br> Mujeres: " + porcM.toFixed(2) + "%");
    }
}

// 6
function ejercicio6() {
    var anioNacimiento = prompt("En que año naciste?");
    if (miRegex.test(anioNacimiento)) {
        var edadActual = 2026 - parseInt(anioNacimiento); 
        escribirResultado("Tu edad es: " + edadActual + " años");
    } else {
        alert("Año no valido");
    }
}