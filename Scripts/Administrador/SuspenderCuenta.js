$(document).ready(function () {
    $("#suspender").click(suspender);
});

function suspender() {
    var ok = 1;
    var correo = $("#usuario").val();
    var fechaInicioSuspension = $("#campoFecha1").val();
    var fechaFinalSuspension = $("#campoFecha2").val();
    var regex = /^(|(0[1-9])|(1[0-2]))\/((0[1-9])|(1\d)|(2\d)|(3[0-1]))\/((\d{4}))$/; 

    //Revisa que la fecha venga en formato valido, esto por ser text se puede editar el valor de entrada y venir tipo 207/34/2038393, o 20/44/2020
    if ((!regex.test(fechaInicioSuspension))) {
        $("#error-fecha").html("Ingrese una fecha válida");
        $("#error-fecha").css("display", "inline-block");
        ok = 0;
    }

    //Revisa que la fecha venga en formato valido, esto por ser text se puede editar el valor de entrada y venir tipo 207/34/2038393, o 20/44/2020
    if ((!regex.test(fechaFinalSuspension))) {
        $("#error-fecha").html("Ingrese una fecha válida");
        $("#error-fecha").css("display", "inline-block");
        ok = 0;
    }

    if (ok == 1) {
        $.ajax({ // Falta agregar el método del post
            url: "/Administrador/SuspenderCuenta",
            method: "POST",
            data: { correo: correo, desde: fechaInicioSuspension, hasta: fechaFinalSuspension },
            cache: false,
            success: function (s) {
                if (s == 0) {
                    alert("Cuenta Suspendida");
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