$(document).ready(function () {
    $("#guardar-cambio").click(changePassword);
});

function changePassword() {
    var ok = 1;

    // Obtiene los datos
    var actual = $("#entrada-password-actual").val();
    var password = $("#entrada-password").val();
    var passwordConfirm = $("#confirmacion-entrada-password").val();
    $(".invalid-feedback").css("display", "none");

    // Verifica que la cotraseña tenga el largo requerido
    if (password.length < 8) {
        $("#error-password").html("La contraseña debe tener al menos 8 caracteres");
        $("#error-password").css("display", "inline-block");
        ok = 0;
    }

    // Verifica que la contraseña cumpla con el formato
    if (ok == 1 && !password.match(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[.-_@$!%*#?&])[A-Za-z\d.-_@$!%*#?&]{8,}$/)) {
        $("#error-password").html("Error: la contraseña no cumple con el formato");
        $("#error-password").css("display", "inline-block");
        ok = 0;
    }

    // Verifica que las contraseñas coincidan
    if (ok == 1 && password !== passwordConfirm) {
        $("#error-confirmacion").html("Error: las contraseñas no coinciden");
        $("#error-confirmacion").css("display", "inline-block");
        ok = 0;
    }

    // Si todo está bien, envía los datos por AJAX
    if (ok == 1) {
        $.ajax({
            url: "/Perfil/ChangePassword",
            method: "POST",
            data: { a: password, b: passwordConfirm, c: actual },
            cache: false,
            success: function (s) {
                if (s == 0) {
                    alert("La contraseña se actualizó con éxito");
                    location.reload();
                } else {
                    alert(s);
                }
            },
            error: function (e) {
                alert(e);
            }
        });
    }
}