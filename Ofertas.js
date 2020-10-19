/*
 * Actividad supervisada 26/05/2020 Roy Padilla Calderon B85854.
 * Voy a generar el javascript que envia los parametros de creacion a los controladores desde la vista select:
 *          Directo
 *          Subasta
 *          Circular
 * Este javascript valida que se hayan seleccionado tanto items como trueques.
 * */

/*Función para llamar a los crear del trueque respectivo
 * ->Se evalúa que se seleccionen ítems.
 * ->Se evalúa que se seleccione un tipo de trueque.
 * ->Se obtienen los valores de los campos Descripción, Fecha Final y Monto(Subasta).
 * ->Si es Subasta entonces se ve que el Monto sea mayor a cero.
 * */

function DireccionarOfertas(id) {
    var input_combo = document.getElementsByTagName('input');//variable para recorrer el checkBox
    var datos = "";//Almacenar todos los datos que se le van a pasar al crear algún trueque
    var items = 0; //Almacenar la cantidad de items seleccionados para saber si no se seleccionaron
    var monto = -1;
    var tipoMoneda = "nil";
    var tipoOferta = document.getElementById("tipoOferta");
    var id_Tipo = id + "-" + tipoOferta.value;
    var destinatedController = "/Ofertas/"
    var validData = true;
    var descripcionValidada = "";
    var loc = location.pathname.split("/");
    var isSubasta = false;

    if (loc.includes("OfertarSubasta")) {
        isSubasta = true;
    }
    else if (loc.includes("EditarOfertaSubasta")) {
        isSubasta = true;
    }

    //alert(isSubasta);

    //Recorrer el check_box obteniendo los valores de los items seleccionados
    for (var com = 0; com < input_combo.length && !isSubasta; com++) {
        if ((input_combo[com].type == 'checkbox') && (input_combo[com].checked == true)) {
            datos += input_combo[com].value + "-";
            items++;
        }
    }

    if (items == 0 && !isSubasta) {
        alert("Por favor seleccione al menos un ítem para hacer la oferta.");
    } else if (isSubasta || items > 0) {

        if (!isSubasta) {
            //seleccionar respecto al radio button o tipo de Trueque seleccionado

            var descripcionPura = document.datos.descripcion.value;//hilera a codificar

            /*
            Actividad supervisada 16/06/2020
            Josué Amador
            Ignacio Arroyo

            Historia de usuario: PIG-01-35
            Tareas técnicas:     validar datos en la capa de la vista
                                 validar datos en la capa del controlador
            */

            var restriccion = new RegExp('\[^A-Za-z0-9 .,äáàëéèíìöóòúùüñçÄÁÀËÉÈÍÌÖÓÒÚÙÜÑ]+', 'g');
            // cualquiera de los caracteres especificados es permitido, si no está en la instrucción, no se permite.

            if (restriccion.test(descripcionPura)) {
                alert("Estimado usuario, solo se permiten palabras, espacios, números, comas y puntos.");
                return false;
            } else {
                stringCode = document.datos.descripcion.value;
                descripcionValidada = stringCode.replace(/[.]/gi, '|01');
            }

            //alert(id_Tipo + "," + datos + "," + descripcionValidada + "," + monto + "," + tipoMoneda);
        }
        else {
            var temp = document.getElementById("montoOferta");
            var min = parseInt($('#montoOferta').attr('min'));
            tipoMoneda = document.getElementById('tipoMoneda').options[0].text;

            if (temp.value <= 0 || temp.value < min) {
                alert("El monto mínimo de esta oferta es de: " + tipoMoneda + " " + min)
                temp.focus();
                return false;
            }
            else {
                monto = parseFloat(temp.value);
            }

            
        }

        if (tipoOferta.value == "Create") {
            destinatedController += "CreateOferta";
        }
        else if (tipoOferta.value == "Edit") {
            destinatedController += "EditOferta";
        }
        else {
            validData = false;
        }
    }

    //alert(id_Tipo + ", " + datos + ", " + descripcionValidada + ", " + monto + ", " + tipoMoneda + ", " + validData + ", " + destinatedController)

    if (validData) {
        $.get(destinatedController, {
            id: id_Tipo,
            items: datos,
            descripcion: descripcionValidada,
            monto: monto,
            tipoMoneda: tipoMoneda,
        }, function (data) {
            //alert("Exito")
            if (tipoOferta.value == "Create") {
                $('#createOfertaSuccess').modal('show');
            }
            else {
                $('#confirmEditOferta').modal('hide');
                $('#editOfertaSuccess').modal('show');
            }
        });
    }
}

function Ofertar(idTrueque) {

    var tipoTrueque = document.getElementById('tipoTrueque');
    var origin = location.origin;

    if (tipoTrueque.value == "Subasta") {
        var path = origin + "/Ofertas/OfertarSubasta/" + idTrueque;
        window.location.href = path;
    }
    else {
        var path = origin + "/Ofertas/OfertarDirectoCircular/" + idTrueque;
        window.location.href = path;
    }
}

function EliminarOFerta(idOferta) {
    $.get("/Ofertas/DeleteOferta/", {
        id: idOferta,
    }, function (data) {
            var mod = "#eliminar" + idOferta
            $(mod).modal('hide');
            $('#deleteSuccess').modal('show');
    });
}