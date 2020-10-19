$(document).ready(function () {
    $("#agregar").click(agregarNuevoAdmin);
});


//Función para generar el reporte
function agregarNuevoAdmin() {
    var ok = 1;

    // Obtiene los datos
    var nombre = $("#nombre").val();
    var apellido = $("#apellido").val();
    var correo = $("#correo").val();
    var password = $("#contrasena").val();
    var confirmPassword = $("#confirmPassword").val();
    var idioma = $("#idioma").val();
    var zona = $("#zona").val();
    var regex = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/; // Expresión regular que sirve para revisar que el string que contiene el correo venga en el formato crrecto
    $(".invalid-feedback").css("display", "none");

    // Validación client-side:


    // Verifica que el Correo tenga información
    if (correo.length == 0) {
        $("#error-correo").html("El campo Correo no puede venir vacío");
        $("#error-correo").css("display", "inline-block");
        ok = 0;
    }

    // Verifica que el correo tenga un formato correcto
    if ((!regex.test(correo))) {
        $("#error-correo").html("Ingrese un correo valido");
        $("#error-correo").css("display", "inline-block");
        ok = 0;
    }

    // Verifica que el nombre tenga información
    if (nombre.length == 0) {
        $("#error-nombre-apellido").html("El campo Nombre no puede venir vacío");
        $("#error-nombre-apellido").css("display", "inline-block");
        ok = 0;
    }

    // Verifica que el apellido tenga información
    if (apellido.length == 0) {
        $("#error-nombre-apellido").html("El campo Apellido no puede venir vacío");
        $("#error-nombre-apellido").css("display", "inline-block");
        ok = 0;
    }

    // Verifica que la cotraseña tenga el largo requerido
    if (password.length < 8) {
        $("#error-contrasena").html("La contraseña debe tener al menos 8 caracteres");
        $("#error-contrasena").css("display", "inline-block");
        ok = 0;
    }

    // Verifica que la contraseña cumpla con el formato
    if (ok == 1 && !password.match(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[.-_@$!%*#?&])[A-Za-z\d.-_@$!%*#?&]{8,}$/)) {
        $("#error-contrasena").html("Error: la contraseña no cumple con el formato");
        $("#error-contrasena").css("display", "inline-block");
        ok = 0;
    }

    // Verifica que las contraseñas coincidan
    if (ok == 1 && password !== confirmPassword) {
        $("#error-confirmar-contrasena").html("Error: las contraseñas no coinciden");
        $("#error-confirmar-contrasena").css("display", "inline-block");
        ok = 0;
    }

    // Si todo está bien, envía los datos por AJAX
    if (ok == 1) {
        $.ajax({
            url: "/Administrador/AgregarAdmin",
            method: "POST",
            data: {  correo:correo, nombre:nombre, apellido:apellido, password:password, confirmPassword:confirmPassword, idioma:idioma, zona:zona },
            cache: false,
            success: function (s) {
                if (s == 0) {
                    alert("Se ha enviado un correo de confirmación a "+correo+".");
                    location.reload();
                } else {
                    alert("El correo ya está en uso. No fue agregado.");
                }
            },
            error: function (e) {
                alert(e);
            }
        });
    }
}
