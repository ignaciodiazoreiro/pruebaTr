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
function Direccionar() {
    var input_radio = document.radio_button.radio; //variable para recorrer el radio
    var input_combo = document.getElementsByTagName('input');//variable para recorrer el checkBox
    var seleccionado = false;//guardar si se selecciono un tipo de trueque
    var id_trueque = 0;//Almacenar el tipo de trueque 0->Directo, 1->Circular, 2->Subasta
    var datos = "";//Almacenar todos los datos que se le van a pasar al crear algún trueque
    var items = 0; //Almacenar la cantidad de items seleccionados para saber si no se seleccionaron
    var enviarEdicion = false
    var path_final = ""
    var datos_finales = ""

    //Recorrer el check_box obteniendo los valores de los items seleccionados
    for (var com = 0; com < input_combo.length; com++) {
        if ((input_combo[com].type == 'checkbox') && (input_combo[com].checked == true)) {
            datos += input_combo[com].value+"-";
            items++;
        }
    }

    //Validacion de la descripcion
    var revDescripion = document.datos.descripcion.value;
    var restriccion = new RegExp('\[^A-Za-z0-9 .,äáàëéèíìöóòúùñçÄÁÀËÉÈÍÌÖÓÒÚÙÑ]+','g'); // Permite todo aquello que este en este conjunto, letra, numeros, comas, puntos y espacios;

    if (restriccion.test(revDescripion)) {
        alert("Estimado usuario, solo se permiten palabras, espacios, numeros, comas y puntos");
        return false;
    } else {
        //alert("Pase");//pattern="[A-Za-z0-9]+"
    }

    var fechIni = new Date(document.datos.fechaInicial.value);
    var fechFinal = new Date(document.datos.fechaFinal.value);

    if (fechIni.getTime() > fechFinal.getTime()) {
        alert("Estimado usuario, la fecha inicial seleccionada es mayor a la fecha final.");
        return false;
    }

    //Fin de la verificacion
    if (items == 0) {
        alert("Por favor seleccione al menos un ítem para hacer el trueque.");
    } else {

        for (rad = 0; rad < input_radio.length; rad++) {//conocer el tipo de trueque y si selecciona alguno
            if (input_radio[rad].checked) {
                seleccionado = true;
                id_trueque = rad;
            }
        }

        //seleccionar respecto al radio button o tipo de Trueque seleccionado
        if (!seleccionado) { //si no esta seleccionado entonces se hace una alert
            alert("Seleccione un tipo de trueque por favor.");
        } else {
            if (!document.datos.fechaInicial.value) {
                alert("Por favor ingrese una fecha inicial.");
                document.datos.fechaInicial.focus();
                return false;
            }
            if (!document.datos.fechaFinal.value) {
                alert("Por favor ingrese una fecha final.");
                document.datos.fechaFinal.focus();
            } else {
                //Codificacion de caracteres por medio de replace
                var stringCode = document.datos.descripcion.value;//hilera a codificar
                var stringCode2 = stringCode.replace(/[.]/gi, '|01');//codificacion del punto a |01  / recordar decodificar el punto cuando la descripción sea necesaria.

                switch (id_trueque) {
                    case 0:
                        datos += "^" + document.datos.fechaInicial.value + "^" + document.datos.fechaFinal.value + "^" + stringCode2;
                        var pathDirecto = "/Directo/CrearDirecto"
                        path_final = pathDirecto
                        datos_finales = datos
                        enviarEdicion = true
                        break
                    case 1:
                        datos += "^" + document.datos.fechaInicial.value + "^" + document.datos.fechaFinal.value + "^" + stringCode2;
                        var pathCircular = "/Circular/CrearCircular"
                        path_final = pathCircular
                        datos_finales = datos
                        enviarEdicion = true
                        break
                    case 2:
                        if (document.datos.monto.value < 0.0 || !document.datos.monto.value) {
                            alert("Por favor ingrese un monto mínimo mayor a 0.");
                            document.datos.monto.focus();
                        }
                        else {
                            var monto = document.datos.monto.value.replace('.', 'p');
                            datos += "^" + document.datos.fechaInicial.value + "^" + document.datos.fechaFinal.value + "^" + monto + "^" + document.datos.tipoMoneda.value + "^" + stringCode2;

                            var pathSubasta = "/Subasta/CrearSubasta"
                            path_final = pathSubasta
                            datos_finales = datos
                            enviarEdicion = true
                        }
                        break
                }

            }
        }

        //alert(enviarEdicion)

        if (enviarEdicion) {
            $.get(path_final, {
                id: datos_finales
            }, function (data) {
                    $('#createSuccess').modal('show');
            });
        }

    }
}

function Editar(id) {

    var input_radio = document.radio_button.radio; //variable para recorrer el radio
    var input_combo = document.getElementsByTagName('input');//variable para recorrer el checkBox
    var seleccionado = false;//guardar si se selecciono un tipo de trueque
    var id_trueque = 0;//Almacenar el tipo de trueque 0->Directo, 1->Circular, 2->Subasta
    var datos = arguments[0] + "^";//Almacenar todos los datos que se le van a pasar al crear algún trueque
    var items = 0; //Almacenar la cantidad de items seleccionados para saber si no se seleccionaron
    var stringCode = "";
    var stringCode2 = "";
    var enviarEdicion = false
    var path_final = ""
    var datos_finales = ""

    //Recorrer el check_box obteniendo los valores de los items seleccionados
    for (var com = 0; com < input_combo.length; com++) {
        if ((input_combo[com].type == 'checkbox') && (input_combo[com].checked == true)) {
            datos += input_combo[com].value + "-";
            items++;
        }
    }

    var fechIni = new Date(document.datos.fechaInicial.value);
    var fechFinal = new Date(document.datos.fechaFinal.value);

    if (fechIni.getTime() > fechFinal.getTime()) {
        alert("Estimado usuario, la fecha inicial seleccionada es mayor a la fecha final.");
        return false;
    }

    if (items == 0) {
        alert("Por favor seleccione al menos un ítem para hacer el trueque.");
    } else {
        for (rad = 0; rad < input_radio.length; rad++) { //conocer el tipo de trueque y si selecciona alguno
            if (input_radio[rad].checked) {
                seleccionado = true;
                id_trueque = rad;
                break
            }
        }

        //seleccionar respecto al radio button o tipo de Trueque seleccionado
        if (!seleccionado) //si no esta seleccionado entonces se hace una alert
        {
            alert("Seleccione un tipo de trueque por favor.");
        }
        else if (!document.datos.fechaInicial.value) {
            alert("Por favor ingrese una fecha inicial.");
            document.datos.fechaInicial.focus();
        }
        else if (!document.datos.fechaFinal.value) {
            alert("Por favor ingrese una fecha final.");
            document.datos.fechaFinal.focus();
        }

        var revDescripion = document.datos.descripcion.value;
        var restriccion = new RegExp('\[^A-Za-z0-9 .,äáàëéèíìöóòúùñçÄÁÀËÉÈÍÌÖÓÒÚÙÑ]+', 'g'); // /\w+/g;

        if (restriccion.test(revDescripion))
        {
            alert("Estimado usuario, solo se permiten palabras, espacios, numeros, comas y puntos");
            return false;
        }
        else
        {
            stringCode = document.datos.descripcion.value;//hilera a codificar
            stringCode2 = stringCode.replace(/[.]/gi, '|01');
        }

        switch (id_trueque) {
            case 0:
                datos += "^" + document.datos.fechaInicial.value + "^" + document.datos.fechaFinal.value + "^" + stringCode2;
                var pathDirecto = "/Directo/EditarDirecto"
                path_final = pathDirecto
                datos_finales = datos
                enviarEdicion = true
                break
            case 1:
                datos += "^" + document.datos.fechaInicial.value + "^" + document.datos.fechaFinal.value + "^" + stringCode2;
                var pathCircular = "/Circular/EditarCircular"
                path_final = pathCircular
                datos_finales = datos
                enviarEdicion = true
                break
            case 2:
                if (document.datos.monto.value < 0.0 || !document.datos.monto.value)
                {
                    alert("Por favor ingrese un monto mínimo mayor a 0.");
                    document.datos.monto.focus();
                }
                else
                {
                    var monto = document.datos.monto.value.replace('.', 'p');

                    datos += "^" + document.datos.fechaInicial.value + "^" + document.datos.fechaFinal.value + "^" + monto + "^" + document.datos.tipoMoneda.value + "^" + stringCode2;
                    var pathSubasta = "/Subasta/EditarSubasta"
                    path_final = pathSubasta
                    datos_finales = datos
                    enviarEdicion = true
                }
                break
        }
        
        if (enviarEdicion) {
            $.get(path_final, {
                id: datos_finales
            }, function (data) {
                    $('#editSuccess').modal('show');
            });
        }
    }
}

//Función para ocultar el campo de Monto de la Subasta para ocultar si no se está seleccionando la subasta
function ocultar(){
    var monto = document.getElementById('monto');
    monto.style.visibility = 'hidden';
}

//Función para mostrar el campo de Monto de la Subasta cuando se está seleccionando la subasta
function mostrar() {
    var monto = document.getElementById('monto');
    monto.style.visibility = 'visible';
}

function borrarTrueque(idTrueque) {
    $.get("/Trueques/DeleteTrueque", {
        id: idTrueque,
    }, function (data) {
            var mod = "#del" + idTrueque
            $(mod).modal('hide');
            $('#deleteSuccess').modal('show');
    });
}

function eliminarPermanente(idTrueque) {
    $.get("/Trueques/DeleteConfirmedTrueque", {
        id: idTrueque
    }, function (data) {
            var mod = "#del" + idTrueque
            $(mod).modal('hide');
            $('#deleteSuccess').modal('show');
    });
}

/*
function activarTrueque(idTrueque) {
    $.get("/Trueques/ActivarTrueque", {
        id: idTrueque
    }, function (successType) {

            $('#activateSuccess').modal('show');
            exp = document.getElementById('expirado');
            act = document.getElementById('activado');
            fai = document.getElementById('fail');
            exp1 = document.getElementById('expirado1');
            act1 = document.getElementById('activado1');
            fai1 = document.getElementById('fail1');

            switch (successType) {
                case "expirado":

                    act.style.display = "none";
                    fai.style.display = "none";
                    act1.style.display = "none";
                    fai1.style.display = "none";

                    exp.style.display = "block";
                    exp1.style.display = "block";
                    break;

                case "activo":

                    exp.style.display = "none";
                    fai.style.display = "none";
                    fai1.style.display = "none";
                    exp1.style.display = "none";

                    act.style.display = "block";
                    act1.style.display = "block";
                    break;

                case "fail":

                    exp.style.display = "none";
                    act.style.display = "none";
                    act1.style.display = "none";
                    exp1.style.display = "none";

                    fai.style.display = "block";
                    fai1.style.display = "block";
                    break;
            }
    });

}
*/

function activarTrueque(idTrueque) {
    $.get("/Trueques/ActivarTrueque", {
        id: idTrueque
    }, function (successType) {

            $('#activateSuccess').modal('show');
            var out1 = document.getElementById('modal_body_activate');
            var out2 = document.getElementById('modal_footer_activate');

            switch (successType) {
                case "expirado":

                    $('#modal_body_activate').empty();
                    $('#modal_footer_activate').empty();

                    var newP = document.createElement("p");
                    var newA1 = document.createElement("a");
                    var newA2 = document.createElement("a");
                    var text1 = "Este trueque se encuentra ahora en su lista de trueques activos.";
                    var text2 = "Si lo desea, puede ir ahora a dicha lista.";

                    newP.appendChild(document.createTextNode(text1));
                    newP.appendChild(document.createElement("br"));
                    newP.appendChild(document.createTextNode(text2));
                    newP.appendChild(document.createElement("br"));

                    out1.appendChild(newP);

                    newA1.className = "btn btn-primary";
                    newA1.href = "/Trueques/IndexTruequesExpirados";
                    newA1.innerHTML = "Ir a Mis trueques expirados";

                    newA2.className = "btn btn-secondary";
                    newA2.href = "/Trueques/IndexTruequesEliminados";
                    newA2.innerHTML = "Aceptar";

                    out2.appendChild(newA1);
                    out2.appendChild(newA2);

                    break;

                case "activo":

                    $('#modal_body_activate').empty();
                    $('#modal_footer_activate').empty();

                    var newP = document.createElement("p");
                    var newA1 = document.createElement("a");
                    var newA2 = document.createElement("a");
                    var text1 = "Este trueque tenía una fecha de expiración antigua, por lo que se ha colocado en Mis trueques expirados.";
                    var text2 = "Desde ahí puede editar su trueque para cambiar la expiración por una fecha futura.";
                    var text3 = "Si lo desea, puede ir ahora a dicha lista.";

                    newP.appendChild(document.createTextNode(text1));
                    newP.appendChild(document.createElement("br"));
                    newP.appendChild(document.createTextNode(text2));
                    newP.appendChild(document.createElement("br"));
                    newP.appendChild(document.createTextNode(text3));
                    newP.appendChild(document.createElement("br"));

                    out1.appendChild(newP);

                    newA1.className = "btn btn-primary";
                    newA1.href = "/Trueques/IndexTruequesActivos";
                    newA1.innerHTML = "Ir a Mis trueques activos";

                    newA2.className = "btn btn-secondary";
                    newA2.href = "/Trueques/IndexTruequesEliminados";
                    newA2.innerHTML = "Aceptar";

                    out2.appendChild(newA1);
                    out2.appendChild(newA2);

                    break;

                case "fail":

                    $('#modal_body_activate').empty();
                    $('#modal_footer_activate').empty();

                    var newP = document.createElement("p");
                    var newA = document.createElement("a");
                    var text1 = "Probablemente su trueque tiene ítems que están ahora en otros trueques activos o expirados."; 
                    var text2 = "Si aún desea activar este trueque, elimine los trueques activos o expirados que contengan ítems de este trueque.";

                    newP.appendChild(document.createTextNode(text1));
                    newP.appendChild(document.createElement("br"));
                    newP.appendChild(document.createTextNode(text2));
                    newP.appendChild(document.createElement("br"));

                    out1.appendChild(newP);

                    newA.className = "btn btn-secondary";
                    newA.href = "/Trueques/IndexTruequesEliminados";
                    newA.innerHTML = "Aceptar";

                    out2.appendChild(newA);

                    break;
        }
    });

}

window.onload = function () {
    const items_to_select = document.getElementsByTagName('input');

    for (var i = 0; i < items_to_select.length; i++) {
        if (items_to_select[i].checked && items_to_select[i].id == 'radio3Especial') {
            mostrar()
        }
    }
}