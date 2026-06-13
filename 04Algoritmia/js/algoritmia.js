function problema1(){
    var input = document.querySelector('#p1-input').value;
    
    if(input.trim() === ""){
        document.querySelector('#p1-output').textContent = 'Error: El campo no puede estar vacío.';
        return;
    }

    var palabrasInvertidas = input.trim().split(/\s+/).reverse().join(' ');
    document.querySelector('#p1-output').textContent = palabrasInvertidas;
}

function problema2(){
    var ids = ['#p2-x1', '#p2-x2', '#p2-x3', '#p2-x4', '#p2-x5', '#p2-y1', '#p2-y2', '#p2-y3', '#p2-y4', '#p2-y5'];
    var valores = [];

    for(var i = 0; i < ids.length; i++){
        var val = document.querySelector(ids[i]).value;
        if(val === ""){
            document.querySelector('#p2-output').textContent = 'Error: Llena todos los campos numéricos.';
            return;
        }
        valores.push(Number(val));
    }

    var v1 = valores.slice(0, 5);
    var v2 = valores.slice(5, 10);

    v1.sort(function(a,b){ return b-a; });
    v2.sort(function(a,b){ return a-b; });

    var p2_producto = 0;
    for(var i = 0; i < v1.length; i++){
        p2_producto += v1[i] * v2[i];
    }

    document.querySelector('#p2-output').textContent = 'El producto escalar minimo es de: ' + p2_producto;
}

function problema3(){
    var input = document.querySelector('#p3-input').value;
    
    if(input.trim() === ""){
        document.querySelector('#p3-output').textContent = 'Error: Ingresa al menos una palabra.';
        return;
    }

    var palabras = input.split(',');
    var palabraMasLarga = "";
    var maxCaracteres = 0;

    palabras.forEach(function(palabra){
        var p = palabra.trim().toUpperCase();
        
        if(p.length > 0){
            var letrasUnicas = new Set(p.replace(/[^A-Z]/g, ""));
            
            if(letrasUnicas.size > maxCaracteres){
                maxCaracteres = letrasUnicas.size;
                palabraMasLarga = p;
            }
        }
    });

    if(palabraMasLarga === ""){
        document.querySelector('#p3-output').textContent = 'Error: No se encontraron palabras válidas (A-Z).';
    } else {
        document.querySelector('#p3-output').textContent = 'La palabra con mas caracteres unicos es: ' + palabraMasLarga + ' con ' + maxCaracteres + ' caracteres.';
    }
}
