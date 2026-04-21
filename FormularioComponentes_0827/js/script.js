function validar() {
   
    var nom = document.getElementById("nombre").value;
    var mail = document.getElementById("correo").value;
    var comen = document.getElementById("comentarios").value;

    if (nom == "") {
        alert("Por favor, escribe tu nombre");
        return false;
    }

    if (mail == "") {
        alert("El correo es obligatorio");
        return false;
    }

    if (comen.length < 5) {
        alert("Escribe un comentario mas largo");
        return false;
    }

    alert("Formulario enviado con exito");
    return true;
}