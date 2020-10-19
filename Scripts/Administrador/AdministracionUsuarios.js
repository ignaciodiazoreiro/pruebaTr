$(document).ready(function () {
    //Ordenamiento inicial
    var lista_inicial = $.makeArray($("#lista-usuarios tr"));
    lista_inicial.sort(function (a, b) {
        return String.prototype.localeCompare.call($(a).data('nombre').toLowerCase(), $(b).data('nombre').toLowerCase());
    });
    $("#lista-usuarios").html(lista_inicial);

    //Ordenamiento
    $("body").on("change", "#ordenar-usuarios", function () {
        var lista = $.makeArray($("#lista-usuarios tr"));
        if ($(this).val() == 0) {
            lista.sort(function (a, b) {
                return String.prototype.localeCompare.call($(a).data('nombre').toLowerCase(), $(b).data('nombre').toLowerCase());
            });
        }
        if ($(this).val() == 1) {
            lista.sort(function (a, b) {
                return String.prototype.localeCompare.call($(b).data('nombre').toLowerCase(), $(a).data('nombre').toLowerCase());
            });
        }
        if ($(this).val() == 2) {
            lista.sort(function (a, b) {
                return String.prototype.localeCompare.call($(a).data('apellido').toLowerCase(), $(b).data('apellido').toLowerCase());
            });
        }
        if ($(this).val() == 3) {
            lista.sort(function (a, b) {
                return String.prototype.localeCompare.call($(b).data('apellido').toLowerCase(), $(a).data('apellido').toLowerCase());
            });
        }
        $("#lista-usuarios").html(lista);
    });

    // Filtrar por usuario
    $("body").on("keyup", "#filtro-buscar", function () {
        var dato = $(this).val();
        var lista = $("#lista-usuarios tr");
        for (var i = 0; i < lista.length; i++) {
            if (lista.eq(i).data("nombre").indexOf(dato) >= 0 || lista.eq(i).data("apellido").indexOf(dato) >= 0 || lista.eq(i).data("email").indexOf(dato) >= 0) {
                lista.eq(i).removeAttr("style");
            } else {
                lista.eq(i).css("display", "none");
            }
        }
    });

    $("body").on("click", ".btn-administrar", function () {
        cargaUsuario($(this).data("usuario"));
        muestraPopup();
    })

    $("body").on("click", "#cerrar-popup", function () {
        escondePopup();
    })

    $("body").on("click", ".card-header-tabs .nav-link", function (e) {
        e.preventDefault();
        swapTab($(this).attr("id"));
    });

    $("body").on("click", "#cancela-cancelar", function (e) {
        swapTab("tab-datos");
    });

    $("body").on("click", "#boton-suspender", function () {
        suspenderUsuario($(this).data("usuario"));
    });

    $("body").on("click", "#boton-reactivar", function () {
        activarCuenta($(this).data("usuario"));
    });

    $("body").on("click", "#boton-cancelar", function () {
        cancelarCuenta($(this).data("usuario"));
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
});

function muestraPopup() {
    $("body").css("overflow", "hidden");
    $("#fondo-oscuro").css("display", "block");
    $("#fondo-oscuro").animate({ opacity: 1 }, 500);
}

function escondePopup() {
    $("#fondo-oscuro").animate({ opacity: 0 }, 500, function () {
        $("#fondo-oscuro").css("display", "none");
        $("body").css("overflow", "auto");
        $("#popup-content").html("");
    });
}

function cargaUsuario(usuario) {
    $.ajax({
        url: "/Administrador/CargarUsuario",
        data: { email: usuario },
        dataType: "html",
        cache: false,
        success: function (d) {
            $("#popup-content").html(d);
        },
        error: function (e) {
            alert("Error desconocido");
            console.log(e);
        }
    });
}

function swapTab(t) {
    // Borra la clase active de los tabs
    $(".card-header-tabs .nav-link").removeClass("active");

    //Agrega el active a la tab clickeada
    $("#" + t).addClass("active");

    //Esconde los bodies para los tabs
    $(".tab-body").css("display", "none");

    //Muestra el body solicitado
    $("#" + t + "-body").css("display", "block");
}

function suspenderUsuario(usuario) {
    console.log(usuario);
    var ok = 1;

    // Esconde los errores
    $("#error-inicio").css("display", "none");
    $("#error-fin").css("display", "none");

    // Obtiene los datos
    var inicio = $("#suspenderInicio").val();
    var fin = $("#suspenderFin").val();

    // Valida que no estén vacíos
    if (inicio.length == 0) {
        $("#error-inicio").html("Este campo no puede estar vacío");
        $("#error-inicio").css("display", "block");
        ok = 0;
    }
    if (fin.length == 0) {
        $("#error-fin").html("Este campo no puede estar vacío");
        $("#error-fin").css("display", "block");
        ok = 0;
    }

    // Valida que la fecha de fin sea mayor que la fecha de inicio
    if (ok == 1) {
        if (Date.parse(inicio) >= Date.parse(fin)) {
            $("#error-fin").html("La fecha de fin de la suspención debe ser posterior a la de inicio");
            $("#error-fin").css("display", "block");
            ok = 0;
        }
    }

    //Envía por Ajax
    if (ok == 1) {
        $.ajax({
            url: "/Administrador/SuspenderCuenta",
            method: "POST",
            data: { correo: usuario, desde: inicio, hasta: fin },
            cache: false,
            success: function (s) {
                if (s == 0) {
                    alert("El usuario fue suspendido con éxito");
                    $(".estado-suspencion").html("");
                    $("#suspenderInicio").attr("readonly", true);
                    $("#suspenderInicio").removeClass("datepicker-suspension");
                    $("#suspenderFin").attr("readonly", true);
                    $("#suspenderFin").removeClass("datepicker-suspension");
                    $("#area-boton-suspencion").html('<button type="button" class="btn btn-verde align-self-right" id="boton-reactivar" data-usuario="' + usuario + '">Reactivar</button>');
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

function activarCuenta(usuario) {
    $.ajax({
        url: "/Administrador/ReactivarCuenta",
        method: "POST",
        cache: false,
        data: { email: usuario },
        success: function (s) {
            if (s == 0) {
                alert("Cuenta reactivada con éxito");
                $(".estado-suspencion").html("no");
                $("#suspenderInicio").attr("readonly", false);
                $("#suspenderInicio").addClass("datepicker-suspension");
                $("#suspenderInicio").val("");
                $("#suspenderFin").attr("readonly", false);
                $("#suspenderFin").addClass("datepicker-suspension");
                $("#suspenderFin").val("");
                $("#area-boton-suspencion").html('<button type="button" class="btn btn-verde align-self-right" id="boton-suspender" data-usuario="' + usuario + '">Suspender</button>');
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

function cancelarCuenta(usuario) {
    $.ajax({
        url: "/Administrador/CancelarCuenta1",
        method: "POST",
        data: { correo: usuario },
        cache: false,
        success: function (s) {
            if (s == 0) {
                alert("La cuenta se canceló con éxito");
                location.reload();
            } else {
                alert(s);
            }
        },
        error: function (e) {
            alert("Error desconocido");
            console.log(e);
        }
    });}