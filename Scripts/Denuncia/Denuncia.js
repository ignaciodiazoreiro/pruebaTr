$(document).ready(function () {
    $("#trueque-denuncia").click(muestraPopup);
    $("#cerrar-popup").click(escondePopup);
    $("body").on("click", "#fondo-oscuro tbody tr", function () {
        seleccionarReporte($(this));
    });
    $("body").on("click", "#aceptar-popup-denuncia", function () {
        aceptarTruequeDenuncia();
    });
    $("#agregar-denunciado").click(agregarDenunciado);
    $("body").on("click", ".borrar-denunciado", borrarDenunciado);
    $("#denunciado-denuncia").keyup(sugerirCorreos);
    $("body").on("click", "#enviar-reporte", enviarReporte);
    cargarTrueques();
});

/* FUNCIONES DE UI */
function muestraPopup() {
    $("body").css("overflow", "hidden");
    $("#fondo-oscuro").css("display", "block");
    $("#fondo-oscuro").animate({ opacity: 1 }, 500);
}

function escondePopup() {
    $("#fondo-oscuro").animate({ opacity: 0 }, 500, function () {
        $("#fondo-oscuro").css("display", "none");
        $("body").css("overflow", "auto");
    });
}

/* FUNCIONES DE DENUNCIAR USUARIO */

function sugerirCorreos() {
    // Datos
    var parcial = $("#denunciado-denuncia").val();

    if (parcial.length >= 2) {
        var sugerencias = obtenerSugerencias(parcial);

        // Genera el autocomplete
        $("#denunciado-denuncia").autocomplete({
            minLength: 2,
            source: sugerencias
        });
    }
}

function obtenerSugerencias(texto) {
    var sugerencias = [];
    if (texto.length >= 2) {
        $.ajax({
            url: "/Comerciante/ObtenerListaAutocompletado",
            method: "POST",
            data: { texto: texto },
            dataType: "json",
            cache: false,
            success: function (s) {
                for (var i = 0; i < s.length; i += 2) {
                    sugerencias.push({ value: s[i], label: s[i] + " - " + s[i + 1] });
                }
            },
            error: function (e) {
                alert("Error desconocido.")
                console.log(e);
            }
        });
    }
    return sugerencias;
}

var lista_correos = [];
function agregarDenunciado() {
    $("#error-denunciado").css("display", "none");
    var email = $("#denunciado-denuncia").val();
    if (email.length > 0) {
        if ($("#denunciado-denuncia")[0].checkValidity() == true) {
            var existe = 0;
            $.ajax({
                url: "/Comerciante/ComercianteExiste",
                method: "POST",
                data: { email: email },
                cache: false,
                success: function (s) {
                    if (s == 1) {
                        agregarCorreoDenunciado(email);
                    } else {
                        $("#error-denunciado").html("El correo ingresado no está registrado en el sistema");
                        $("#error-denunciado").css("display", "block");
                    }
                }
            });
        } else {
            $("#error-denunciado").html("El correo ingresado no es válido");
            $("#error-denunciado").css("display", "block");
        }
    }
}

function agregarCorreoDenunciado(email) {
    var maximo_denunciados = 6;
    if (!lista_correos.includes(email)) {
        // Agrega el correo al arreglo de denunciados
        lista_correos.push(email);

        //Agrega el correo a la lista de denunciados en el HTML
        var codigo = '<div class="form-group row" data-denunciado="' + email + '">';
        codigo += '<div class="col-form-label col-md-3"></div><div class="col-md-9"><div class="input-group">';
        codigo += '<input type="email" class="form-control correo-denunciado" id="denunciado-denuncia" value="' + email + '" disabled>';
        codigo += '<button class="btn btn-danger btn-input borrar-denunciado" type="button" data-borrar="' + email + '">Borrar</button>';
        codigo += '<div class="invalid-feedback" id="error-denunciado"></div></div></div>';
        $("#lista-denunciados").append(codigo);

        //Si se llega al limite de denunciados, se desactiva la opcion de agregar
        if (lista_correos.length == maximo_denunciados) {
            $("#denunciado-denuncia").attr("disabled", true);
        }
    }
    $("#denunciado-denuncia").val("");
}

function borrarDenunciado() {
    var email = $(this).data("borrar");
    if (lista_correos.indexOf(email) >= 0) {
        // Borra el correo del array
        delete lista_correos[lista_correos.indexOf(email)];

        // Limpia los campos vacios del array
        lista_correos = lista_correos.filter((entry) => { return entry.trim() != '' })

        //Borra el div correspondiente
        $(".form-group[data-denunciado='" + email + "']").remove();

        //Abilita la opcion de agregar mas denunciados
        $("#denunciado-denuncia").attr("disabled", false);
    }
}

function cargarTrueques() {
    $.ajax({
        url: "/Denuncia/obtenerTrueques",
        method: "POST",
        dataType: "json",
        cache: false,
        success: function (s) {
            if (s.length > 0) {
                for (var i = 0; i < s.length; i += 3) {
                    agregarTrueque(s[i], s[i + 1], s[i + 2]);
                }
            } else {
                agregarTrueque("", "Usted no ha participado en ningún trueque", "");
            }
        }
    });
}

function agregarTrueque(id, descripcion, tipo) {
    var codigo = '<tr data-trueque="' + id + '">';
    codigo += '<th scope="row"><a href="#">#' + id + '</a></th>';
    codigo += '<td>' + descripcion + '</td>';
    codigo += '<td>' + tipo + '</td><tr>';
    $("#lista-trueques").append(codigo);
}

function seleccionarReporte(e) {
    $(".trueque-seleccionado").removeClass("trueque-seleccionado");
    e.addClass("trueque-seleccionado");
}

function aceptarTruequeDenuncia() {
    var seleccionado = $(".trueque-seleccionado").data("trueque");
    if (seleccionado > 0) {
        $("#trueque-denuncia").val(seleccionado);
    }
    escondePopup();
}

function enviarReporte() {
    var ok = 1;

    // Limpia los campos de error
    $(".invalid-feedback").css("display", "none");
    $(".inavlid-feedback small").html("");

    // Obtiene los datos simples
    var asunto = $("#asunto-denuncia").val();
    var desc = $("#descripcion-denuncia").val();
    var trueque = $("#trueque-denuncia").val();
    if (trueque == "") {
        trueque = -1;
    }

    // Obtiene el arreglo de denunciados
    var denunciados = [];
    $(".correo-denunciado").each(function () {
        denunciados.push($(this).val());
    });

    // Valida el asunto
    if (asunto.length == 0) {
        $("#error-asunto").html("Este campo no puede estar vacío").css("display", "block");
        ok = 0;
    }

    // Valida los denunciados
    if (denunciados.length == 0) {
        $("#error-denunciado").html("Debe denunciar al menos a un usuario").css("display", "block");
        ok = 0;
    }

    // Valida la descripción
    if (desc.length == 0) {
        $("#error-descripcion").html("Este campo no puede estar vacío").css("display", "block");
        ok = 0;
    }

    if (ok == 1) {
        $.ajax({
            url: "/Denuncia/AgregarDenuncia",
            method: "POST",
            cache: false,
            dataType: "json",
            data: {
                asunto: asunto,
                descripcion: desc,
                denunciados: denunciados,
                trueque: trueque
            },
            success: function (s) {
                if (s == 0) {
                    document.location.href = "/Denuncia/DenunciaExitosa";
                } else {
                    alert(s);
                }
            },
            error: function (e) {
                alert("Error desconocido.");
                console.log(e);
            }
        });
    }
}