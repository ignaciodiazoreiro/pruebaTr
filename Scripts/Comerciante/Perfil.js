$(document).ready(function () {
    $("#campo-foto").change(subirFotoPerfil);
    $("#borrar-foto").click(borrarFotoPerfil);
    $("#guardar-cambios").click(subirDatosPersonales);
    $("#guardar-correo-alternativo").click(agregarCorreoAlternativo);
    $("#guardar-telefono").click(agregarTelefono);
    $("#guardar-interes").click(agregarInteres);
    $("#privacidad-foto").change(editarPrivacidadFoto);
    $("#privacidad-nacimiento").change(editarPrivacidadNacimiento);
    $("#privacidad-direccion").change(editarPrivacidadDireccion);
    $("#privacidad-pais").change(editarPrivacidadPais);
    $("#privacidad-provEstado").change(editarPrivacidadProvEstado);
    $("#privacidad-cantCiudad").change(editarPrivacidadCantCiudad);
    $("#guardar-categoria-preferida").click(agregarCategoriaPreferida);
    $("#guardar-hashtag-preferido").click(agregarHashtagPreferido);

    $(".borrar-correo").click(function () {
        borrarCorreoAlternativo($(this));
    });
    $(".borrar-telefono").click(function () {
        borrarTelefono($(this));
    });
    $(".borrar-interes").click(function () {
        borrarInteres($(this));
    });
    $(".privacidad-alternativo").change(function () {
        editarPrivacidadCorreo($(this));
    });
    $(".privacidad-telefono").change(function () {
        editarPrivacidadTelefono($(this));
    });
    $(".privacidad-interes").change(function () {
        editarPrivacidadInteres($(this));
    });
    $(".borrar-categoria-preferida").click(function () {
        borrarCategoriaPreferida($(this));
    });
    $(".borrar-hashtag-preferido").click(function () {
        borrarHashtagPreferido($(this));
    });
});

/*
 * FUNCIONES PARA DATOS PERSONALES Y FOTO DE PERFIL
 */

// Función para subir una foto de perfil
function subirFotoPerfil() {
    if (window.FormData !== undefined) {
        // Crea un FormData
        var formData = new FormData();

        // Agrega la foto al FormData
        var campo_foto = document.getElementById("campo-foto");
        for (var i = 0; i < campo_foto.files.length; i++) {
            formData.append(campo_foto.files[i].name, campo_foto.files[i]);
        }

        $.ajax({
            url: "/Perfil/ActualizarFotoPerfil",
            type: "POST",
            contentType: false,
            processData: false,
            cache: false,
            data: formData,
            success: function (s) {
                recargarFotoPerfil();
            },
            error: function (e) {
                alert(e.statusText);
            }
        });
    } else {
        alert("Error 1");
    }
}

// Función para regargar la foto de perfil luego de actualizarla
function recargarFotoPerfil() {
    $.ajax({
        url: "/Perfil/RecargarFotoPerfil",
        type: "POST",
        contentType: false,
        processData: false,
        cache: false,
        success: function (s) {
            $("#foto-perfil-editar").attr("src", s);
            $("#foto-layout").attr("src", s);
        },
        error: function (e) {
            alert(e.statusText);
        }
    });
}

// Función para borrar la foto de perfil
function borrarFotoPerfil() {
    $.ajax({
        url: "/Perfil/BorrarFotoPerfil",
        type: "POST",
        contentType: false,
        processData: false,
        cache: false,
        success: function (s) {
            $("#foto-perfil-editar").attr("src", s);
            $("#foto-layout").attr("src", s);
        },
        error: function (e) {
            alert(e.statusText);
        }
    });
}

// Función para subir los datos personales
function subirDatosPersonales() {
    var datos_personales = [];
    var ok = 1;
    $(".invalid-feedback").css("display", "none");

    // Obtiene los datos personales de los campos de texto
    datos_personales[0] = $("#campo-nombre").val();
    datos_personales[1] = $("#campo-apellido").val();
    datos_personales[2] = $("#campo-nacimiento").val();
    datos_personales[3] = $("#campo-pais").val();
    datos_personales[4] = $("#campo-provEstado").val();
    datos_personales[5] = $("#campo-CantCiudad").val();
    datos_personales[6] = $("#campo-direccion").val();

    // Validaciones client-side
    // Campo nombre
    if (datos_personales[0].length == 0) {
        $("#nombre-error").html("El campo Nombre no puede estar vacío");
        $("#nombre-error").css("display", "inline-block");
        ok = 0;
    }

    // Campo Apellido
    if (datos_personales[1].length == 0) {
        $("#apellido-error").html("El campo Apellido no puede estar vacío");
        $("#apellido-error").css("display", "inline-block");
        ok = 0;
    }

    // Envía los datos por AJAX
    if (ok == 1) {
        $.ajax({
            url: "/Perfil/EditarDatosPersonales",
            type: "POST",
            cache: false,
            data: { datos: datos_personales },
            traditional: true,
            success: function (s) {
                if (s == 0) {
                    alert("Cambios guardados con éxito");
                    location.reload();
                } else {
                    alert("Error " + s);
                }
            },
            error: function (e) {
                alert("Error " + e);
            }
        });
    }
}

/*
 * FUNCIONES PARA CORREOS ELECTRÓNICOS ADICIONALES
 */

// Agrega un Correo alternativo
function agregarCorreoAlternativo() {
    // Lee los datos del formulario
    var correo = $("#campo-email-alternativo").val();
    var privacidad = $("#privacidad-nuevo-correo").val();

    $(".invalid-feedback").css("display", "none");
    var ok = 1;

    // Validación client-side
    if (correo.length == 0) {
        $("#correo-alternativo-error").html("El campo Correo no puede estar vacío");
        $("#correo-alternativo-error").css("display", "inline-block");
        ok = 0;
    }

    if (ok == 1 && !$("#campo-email-alternativo")[0].checkValidity()) {
        alert("Eoo");
        $("#correo-alternativo-error").html("Debe ingresar un correo válido");
        $("#correo-alternativo-error").css("display", "inline-block");
        ok = 0;
    }

    // Envía los datos por AJAX
    if (ok == 1) {
        $.ajax({
            url: "/Perfil/AgregarCorreoAlternativo",
            method: "POST",
            data: { correo: correo, privacidad: privacidad },
            cache: false,
            traditional: true,
            success: function (s) {
                if (s == 0) {
                    alert("Correo agregado con éxito");
                    location.reload();
                } else {
                    $("#correo-alternativo-error").html(s);
                    $("#correo-alternativo-error").css("display", "inline-block");
                }
            },
            error: function (e) {
                $("#correo-alternativo-error").html(e);
                $("#correo-alternativo-error").css("display", "inline-block");
            }
        });
    }
}

// Agrega un número de Teléfono
function agregarTelefono() {
    // Lee los datos del formulario
    var telefono = $("#campo-telefono").val();
    var privacidad = $("#privacidad-nuevo-telefono").val();

    $(".invalid-feedback").css("display", "none");
    var ok = 1;

    // Validación client-side
    if (telefono.length == 0) {
        $("#telefono-error").html("El campo Teléfono no puede estar vacío");
        $("#telefono-error").css("display", "inline-block");
        ok = 0;
    }
    if (!telefono.match(/^(\(?\+?[0-9]*\)?)?[0-9\-\(\)]*$/)) {
        $("#telefono-error").html("Debe ingresar un teléfono válido");
        $("#telefono-error").css("display", "inline-block");
        ok = 0;
    }

    // Envía los datos por AJAX
    if (ok == 1) {
        $.ajax({
            url: "/Perfil/AgregarTelefono",
            method: "POST",
            data: { telefono: telefono, privacidad: privacidad },
            cache: false,
            traditional: true,
            success: function (s) {
                if (s == 0) {
                    alert("Teléfono agregado con éxito");
                    location.reload();
                } else {
                    $("#telefono-error").html(s);
                    $("#telefono-error").css("display", "inline-block");
                }
            },
            error: function (e) {
                $("#telefono-error").html(e);
                $("#telefono-error").css("display", "inline-block");
            }
        });
    }
}


// Agrega un interés
function agregarInteres() {
    var interes = $("#campo-interes").val();
    var privacidad = $("#privacidad-nuevo-interes").val();

    $(".invalid-feedback").css("display", "none");
    var ok = 1;

    if (interes.length == 0) {
        $("#interes-error").html("El campo Interés no puede estar vacío");
        $("#interes-error").css("display", "inline-block");
    }

    if (ok == 1) {
        $.ajax({
            url: "/Perfil/AgregarInteres",
            method: "POST",
            data: { interes: interes, privacidad: privacidad },
            cache: false,
            success: function (s) {
                if (s == 0) {
                    alert("Interés agregado con éxito");
                    location.reload();
                } else {
                    $("#interes-error").html(s);
                    $("#interes-error").css("display", "inline-block");
                }
            },
            error: function (e) {
                $("#interes-error").html(e);
                $("#interes-error").css("display", "inline-block");
            }
        });
    }
}

// Edita la privacidad de la foto de perfil
function editarPrivacidadFoto() {
    var privacidad = $("#privacidad-foto").val();

    $.ajax({
        url: "/Perfil/EditarPrivacidadFoto",
        method: "POST",
        data: { privacidad: privacidad },
        cache: false,
        success: function (s) {
            if (s != 0) {
                alert(s);
            }
        },
        error: function (e) {
            alert(e);
        }
    });
}

// Edita la privacidad de la fecha de nacimiento
function editarPrivacidadNacimiento() {
    var privacidad = $("#privacidad-nacimiento").val();

    $.ajax({
        url: "/Perfil/EditarPrivacidadNacimiento",
        method: "POST",
        data: { privacidad: privacidad },
        cache: false,
        success: function (s) {
            if (s != 0) {
                alert(s);
            }
        },
        error: function (e) {
            alert(e);
        }
    });
}


// Edita la privacidad de pais
function editarPrivacidadPais() {
    var privacidad = $("#privacidad-pais").val();

    $.ajax({
        url: "/Perfil/EditarPrivacidadPais",
        method: "POST",
        data: { privacidad: privacidad },
        cache: false,
        success: function (s) {
            if (s != 0) {
                alert(s);
            }
        },
        error: function (e) {
            alert(e);
        }
    });
}

// Edita la privacidad de provincia/estado
function editarPrivacidadProvEstado() {
    var privacidad = $("#privacidad-ProvEstado").val();

    $.ajax({
        url: "/Perfil/EditarPrivacidadProvEstado",
        method: "POST",
        data: { privacidad: privacidad },
        cache: false,
        success: function (s) {
            if (s != 0) {
                alert(s);
            }
        },
        error: function (e) {
            alert(e);
        }
    });
}

// Edita la privacidad de provincia/estado
function editarPrivacidadCantCiudad() {
    var privacidad = $("#privacidad-CantCiudad").val();

    $.ajax({
        url: "/Perfil/EditarPrivacidadCantCiudad",
        method: "POST",
        data: { privacidad: privacidad },
        cache: false,
        success: function (s) {
            if (s != 0) {
                alert(s);
            }
        },
        error: function (e) {
            alert(e);
        }
    });
}

// Edita la privacidad de la foto de dirección
function editarPrivacidadDireccion() {
    var privacidad = $("#privacidad-direccion").val();

    $.ajax({
        url: "/Perfil/EditarPrivacidadDireccion",
        method: "POST",
        data: { privacidad: privacidad },
        cache: false,
        success: function (s) {
            if (s != 0) {
                alert(s);
            }
        },
        error: function (e) {
            alert(e);
        }
    });
}

// Edita la privacidad de un correo alternativo
function editarPrivacidadCorreo(e) {
    var correo = e.data("privacidad-correo");
    var privacidad = e.val();

    $.ajax({
        url: "/Perfil/EditarPrivacidadCorreo",
        method: "POST",
        data: { correo: correo, privacidad: privacidad },
        cache: false,
        success: function (s) {
            if (s != 0) {
                alert(s);
            }
        },
        error: function (e) {
            alert(e);
        }
    });
}

// Edita la privacidad de un teléfono
function editarPrivacidadTelefono(e) {
    var telefono = e.data("privacidad-telefono");
    var privacidad = e.val();

    $.ajax({
        url: "/Perfil/EditarPrivacidadTelefono",
        method: "POST",
        data: { telefono: telefono, privacidad: privacidad },
        cache: false,
        success: function (s) {
            if (s != 0) {
                alert(s);
            }
        },
        error: function (e) {
            alert(e);
        }
    });
}

// Edita la privacidad de un interés
function editarPrivacidadInteres(e) {
    var interes = e.data("privacidad-interes");
    var privacidad = e.val();

    $.ajax({
        url: "/Perfil/EditarPrivacidadInteres",
        method: "POST",
        data: { interes: interes, privacidad: privacidad },
        cache: false,
        success: function (s) {
            if (s != 0) {
                alert(s);
            }
        },
        error: function (e) {
            alert(e);
        }
    });
}

// Borra un correo electrónico alternativo
function borrarCorreoAlternativo(e) {
    var correo = e.data("borrar-correo");

    $.ajax({
        url: "/Perfil/BorrarCorreoAlternativo",
        method: "POST",
        data: { correo: correo },
        cache: false,
        success: function (s) {
            if (s == 0) {
                alert("Se ha borrado el correo con éxito");
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

// Borra un teléfono
function borrarTelefono(e) {
    var telefono = e.data("borrar-telefono");

    $.ajax({
        url: "/Perfil/BorrarTelefono",
        method: "POST",
        data: { telefono: telefono },
        cache: false,
        success: function (s) {
            if (s == 0) {
                alert("Se ha borrado el teléfono con éxito");
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

// Borra un interés
function borrarInteres(e) {
    var interes = e.data("borrar-interes");

    $.ajax({
        url: "/Perfil/BorrarInteres",
        method: "POST",
        data: { interes: interes },
        cache: false,
        success: function (s) {
            if (s == 0) {
                alert("Se ha borrado el interés con éxito");
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

// Borrar categoria preferida
function borrarCategoriaPreferida(e) {
    var nombreCategoria = e.data("borrar-categoria-preferida");

    $.ajax({
        url: "/Perfil/BorrarCategoriaPreferida",
        method: "POST",
        data: { nombreCategoria: nombreCategoria },
        cache: false,
        success: function (s) {
            if (s == 0) {
                alert("Se ha borrado la categoría con éxito");
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

// Borrar hashtag preferido
function borrarHashtagPreferido(e) {
    var nombreHashtag = e.data("borrar-hashtag-preferido");

    $.ajax({
        url: "/Perfil/BorrarHashtagPreferido",
        method: "POST",
        data: { nombreHashtag: nombreHashtag },
        cache: false,
        success: function (s) {
            if (s == 0) {
                alert("Se ha borrado el hashtag con éxito");
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


// Agrega una categoría preferida
function agregarCategoriaPreferida() {

    var nombreCategoria = $("#seleccion-categorias").val();
    //var privacidad = $("#privacidad-nueva-categoria-preferida").val(); Se deshabilita por el momento la privacidad para categorías preferidas.
    var privacidad = 0

    $.ajax({
        url: "/Perfil/AgregarCategoriaPreferida",
        method: "POST",
        data: { nombreCategoria: nombreCategoria, privacidad: privacidad },
        cache: false,
        success: function (s) {
            if (s == 0) {
                alert("Categoría agregada con éxito");
                location.reload();
            } else {
                $("#categoria-error").html(s);
                $("#categoria-error").css("display", "inline-block");
            }
        },
        error: function (e) {
            $("#categoria-error").html(e);
            $("#categoria-error").css("display", "inline-block");
        }
    });
}

// Agrega un hashtag preferido
function agregarHashtagPreferido() {

    var nombreHashtag = $("#seleccion-hashtags").val();
    //var privacidad = $("#privacidad-nueva-categoria-preferida").val(); Se deshabilita por el momento la privacidad para categorías preferidas.
    var privacidad = 0

    $.ajax({
        url: "/Perfil/AgregarHashtagPreferido",
        method: "POST",
        data: { nombreHashtag: nombreHashtag, privacidad: privacidad },
        cache: false,
        success: function (s) {
            if (s == 0) {
                alert("Hashtag agregado con éxito");
                location.reload();
            } else {
                $("#hashtag-error").html(s);
                $("#hashtag-error").css("display", "inline-block");
            }
        },
        error: function (e) {
            $("#hashtag-error").html(e);
            $("#hashtag-error").css("display", "inline-block");
        }
    });
}


