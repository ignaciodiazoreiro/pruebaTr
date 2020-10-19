$(document).ready(function () {
    // Ordenamiento
    $("#ordenar-reportes-recientes").change(function () {
        var lista = $.makeArray($("#lista-reportes tr"));
        lista.reverse();
        $("#lista-reportes").html(lista);
    });

    // POPUP
    $(".abrir-reporte").click(function () {
        cargaReporte($(this).data("reporte"));
        muestraPopup();
    });
    $("body").on("click", "#cerrar-popup", function () {
        escondePopup($(this).data("reporte"));
    });

    // UI SUSPENDER
    $("body").on("click", ".boton-suspender", function () {
        $(this).css("background-color", "#008641");
        mostrarSuspender($(this).data("usuario"));
    });
    $("body").on("click", ".boton-cancelar-suspension", function () {
        $(".usuario-reportado[data-usuario='" + $(this).data("usuario") + "'] .boton-suspender").css("background-color", "#6DC067");
        esconderSuspender($(this).data("usuario"));
    });

    // DATEPICKER SUSPENDER
    $("body").on("click", ".datepicker-suspension", function () {
        var t = $(this);
        var j = jQuery.noConflict();
        j(function () {
            j(t).datepicker();
            j(t).datepicker("show");
        });
    });

    // BOTONES ACCION USUARIO
    $("body").on("click", ".boton-accion-reporte", function () {
        accionReporte($(this).data("usuario"), $(this).data("accion"));
    });
});

/* FUNCIONES DE UI */
function muestraPopup() {
    $("body").css("overflow", "hidden");
    $("#fondo-oscuro").css("display", "block");
    $("#fondo-oscuro").animate({ opacity: 1 }, 500);
}

function escondePopup(reporte) {
    $("#fondo-oscuro").animate({ opacity: 0 }, 500, function () {
        $("#fondo-oscuro").css("display", "none");
        $("body").css("overflow", "auto");

        // Si no hay más reportes sin revisar, elimina la fila
        if ($(".card[data-reporte='" + reporte + "'] .lista-denunciados").children().length == 0) {
            // Marca la Denuncia como revisada
            $.ajax({
                url: "/Administrador/RevisarDenuncia",
                method: "POST",
                cache: false,
                data: { id: reporte },
                success: function (s) {
                    if (s == 0) {
                        $("tr[data-reporte='" + reporte + "']").animate({ opacity: "0", height: "0px" }, 700, function () {
                            $(this).css("display", "none");
                        });
                    } else {
                        alert(s);
                    }
                },
                error: function (e) {
                    alert("Error desconocido");
                    console.log(e);
                }
            });
        }
    });
}

function mostrarSuspender(usuario) {
    $(".usuario-reportado[data-usuario='" + usuario + "'] .footer-suspender").animate({
        height: "215px",
        padding: "13px"
    }, 500);
}

function esconderSuspender(usuario) {
    $(".usuario-reportado[data-usuario='" + usuario + "'] .footer-suspender").animate({
        height: "0px",
        padding: "0px"
    }, 500);
}

/* FUNCIONES DE REPORTES */
var reporte_activo;
function cargaReporte(reporte) {
    $.ajax({
        url: "/Administrador/CargaReporte",
        data: { id: reporte },
        dataType: "html",
        cache: false,
        success: function (d) {
            $("#popup-content").html(d);
            reporte_activo = reporte;
        },
        error: function (e) {
            alert("Error desconocido");
            console.log(e);
        }
    });
}

function accionReporte(usuario, accion) {
    switch (accion) {
        case 1:
            ignorarReporte(usuario);
            break;
        case 2:
            amonestarReporte(usuario);
            break;
        case 3:
            suspenderReporte(usuario);
            break;
    }
}

function enviarDenunciadoARevisado(usuario) {
    // Obtiene las dimensiones del elemento
    var w = $(".usuario-reportado[data-usuario='" + usuario + "']").width();
    var h = $(".usuario-reportado[data-usuario='" + usuario + "']").height();

    // Encoje el elemento
    $(".usuario-reportado[data-usuario='" + usuario + "']").css("width", w + "px").css("height", h + "px").css("flex", "none");
    $(".usuario-reportado[data-usuario='" + usuario + "'] .footer-suspender").css("height", "0px").css("padding", "0px");
    $(".usuario-reportado[data-usuario='" + usuario + "']").animate({ width: "0px" }, 500, function () {
        // Cambia el estilo
        $(".usuario-reportado[data-usuario='" + usuario + "'] .card").removeClass("bg-rojo").addClass("bg-info");
        $(".usuario-reportado[data-usuario='" + usuario + "']").detach().appendTo($("#denunciados-revisados"));
        $(".usuario-reportado[data-usuario='" + usuario + "'] .lista-botones").remove();
        $(".usuario-reportado[data-usuario='" + usuario + "'] .bg-dark-danger").removeClass("bg-dark-danger");
        $(".usuario-reportado[data-usuario='" + usuario + "'] .veces-denunciado").remove();
    });

    // Muestra el elemento de nuevo
    $(".usuario-reportado[data-usuario='" + usuario + "']").animate({ width: w + "px" }, 500, function () {
        $(".usuario-reportado[data-usuario='" + usuario + "']").css("flex", "0 0 33.33333%");
    });
}

function ignorarReporte(usuario) {
    $.ajax({
        url: "/Administrador/IgnorarDenuncia",
        method: "POST",
        cache: false,
        data: { correo: usuario, idDenuncia: reporte_activo },
        success: function (s) {
            if (s == 0) {
                enviarDenunciadoARevisado(usuario);
                $(".usuario-reportado[data-usuario='" + usuario + "'] .footer-suspender").html("<small>Ignorado</small>").css("height", "49px").css("padding", ".75rem");
            } else {
                alert(s);
            }
        },
        error: function (e) {
            alert("Error desconocido");
            console.log(e);
        }
    });
}

function amonestarReporte(usuario) {
    $.ajax({
        url: "/Administrador/AmonestarUsuario",
        method: "POST",
        cache: false,
        data: { correo: usuario, idDenuncia: reporte_activo },
        success: function (s) {
            if (s == 0) {
                enviarDenunciadoARevisado(usuario);
                $(".usuario-reportado[data-usuario='" + usuario + "'] .footer-suspender").html("<small>Amonestado</small>").css("height", "49px").css("padding", ".75rem");
            } else {
                alert(s);
            }
        },
        error: function (e) {
            alert("Error desconocido");
            console.log(e);
        }
    });
}

function suspenderReporte(usuario) {
    var ok = 1;

    // Esconde los errores
    $(".usuario-reportado[data-usuario='" + usuario + "'] .error-inicio").css("display", "none");
    $(".usuario-reportado[data-usuario='" + usuario + "'] .error-fin").css("display", "none");

    // Obtiene los datos
    var inicio = $(".usuario-reportado[data-usuario='" + usuario + "'] .inicio-suspension").val();
    var fin = $(".usuario-reportado[data-usuario='" + usuario + "'] .fin-suspension").val();

    // Valida que no estén vacíos
    if (inicio.length == 0) {
        $(".usuario-reportado[data-usuario='" + usuario + "'] .error-inicio").html("Este campo no puede estar vacío");
        $(".usuario-reportado[data-usuario='" + usuario + "'] .error-inicio").css("display", "block");
        ok = 0;
    }
    if (fin.length == 0) {
        $(".usuario-reportado[data-usuario='" + usuario + "'] .error-fin").html("Este campo no puede estar vacío");
        $(".usuario-reportado[data-usuario='" + usuario + "'] .error-fin").css("display", "block");
        ok = 0;
    }

    // Valida que la fecha de fin sea mayor que la fecha de inicio
    if (ok == 1) {
        if (Date.parse(inicio) >= Date.parse(fin)) {
            $(".usuario-reportado[data-usuario='" + usuario + "'] .error-fin").html("La fecha de fin de la suspención debe ser posterior a la de inicio");
            $(".usuario-reportado[data-usuario='" + usuario + "'] .error-fin").css("display", "block");
            ok = 0;
        }
    }

    //Envía por Ajax
    if (ok == 1) {
        $.ajax({
            url: "/Administrador/SuspenderCuenta",
            method: "POST",
            data: { correo: usuario, desde: inicio, hasta: fin, idDenuncia: reporte_activo },
            cache: false,
            success: function (s) {
                if (s == 0) {
                    enviarDenunciadoARevisado(usuario);
                    $(".usuario-reportado[data-usuario='" + usuario + "'] .footer-suspender").html("<small>Suspendido desde " + inicio + " hasta " + fin + "</small>").css("height", "49px").css("padding", ".75rem");
                } else {
                    alert(s);
                }
            },
            error: function (e) {
                alert("Error desconocido");
                console.log(e);
            }
        });
    }
}