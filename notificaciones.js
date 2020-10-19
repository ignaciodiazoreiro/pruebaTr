$(document).ready(function () {

    // ANIMATEDLY DISPLAY THE NOTIFICATION COUNTER.
    $('#contadorNoti')
        .css({ opacity: 0 })
        .css({ top: '-10px' })
        .animate({ top: '-2px', opacity: 1 }, 500);

    $('#botonNot').click(function () {

        // TOGGLE (SHOW OR HIDE) NOTIFICATION WINDOW.
        $('#listaNoti').fadeToggle('fast', 'linear');

        $('#contadorNoti').fadeOut('slow');     // HIDE THE COUNTER.

        return false;
    });

    $.get("/Notificaciones/GetNotificaciones", {
    }, function (result) {
            var notificaciones = result.split("^");//se obtiene por cada campo la notifacion-fecha
            
            var texto = "";
            var fecha = "";
            var tipo = ""; //Oferta o Trueque
            var id = ""; //Id oferta o trueque
            var link = "";//Link del salto a la oferta o trueque
            var textoLink = "";//"Ir al trueque" o "Ir a la oferta"
            var notificationsMenu = document.getElementById('listaNoti');//Panel de notificaciones
            var contadores = notificaciones[0];//setear el numero de notificaciones
            //alert(contadores);
            for (var i = 1; i < notificaciones.length; ++i) {
                if (notificaciones.length == 2) {
                    texto = "No tiene notificaciones";
                } else {
                    texto = notificaciones[i].split("-")[0];
                    fecha = notificaciones[i].split("-")[1];
                    tipo = notificaciones[i].split("-")[2];
                    id = notificaciones[i].split("-")[3];
                    if (tipo == "Oferta") {
                        textoLink = "Ir a la oferta";
                        link = "/Ofertas/DetalleOferta/" + id+"?predecesor=activos";
                    } else if (tipo == "Trueque") { // || tipo == "VPTrueque" || tipo == "TruequeVencido" 
                        textoLink = "Ir al trueque";
                        link = "/Trueques/DetalleTrueque/" + id;
                    }
                }
                if (i != notificaciones.length - 1 || notificaciones.length == 2) {
                    var notifyItem = document.createElement("div");
                    notifyItem.className = "notify_item";
                    var notifyInfo = document.createElement("div");
                    notifyInfo.className = "notify_info";
                    var parrafo = document.createElement("p");
                    parrafo.appendChild(document.createTextNode(texto));

                    var parrafo2 = document.createElement("p");

                    if (tipo != "OfertaD" && tipo != "TruequeD") {
                        var salto = document.createElement("a");
                        salto.href = link;
                        salto.innerHTML = textoLink;
                        parrafo2.appendChild(salto);
                        parrafo2.style.textAlign = "left";
                    }

                    var espan = document.createElement("span");

                    var espanClas = document.createElement("span");
                    espanClas.className = "notify_time";
                    espanClas.innerHTML = fecha;

                    parrafo.appendChild(espan);
                    parrafo.appendChild(parrafo2);
                    notifyInfo.appendChild(parrafo);
                    notifyInfo.appendChild(espanClas);
                    notifyItem.appendChild(notifyInfo);

                    notificationsMenu.appendChild(notifyItem);
                }
            }
            var contador = document.getElementById("contadorNoti");
            if (contadores == 0) {
                $('#contadorNoti').hide();
            }
            
            contador.textContent = contadores;
    });

    //  HIDE NOTIFICATIONS WHEN CLICKED ANYWHERE ON THE PAGE.

    $(document).click(function () {
        $('#listaNoti').hide();
    });

    $('#contadorNoti').click(function () {
        $.get("/Notificaciones/SetContadorCero", {
        }, function (result) {
                if (result) {
                   //alert("Hola mundo");
                }
        });
        $('#contadorNoti').hide();
    });
});