var myEl = document.getElementById('confirmarTrueque');

myEl.addEventListener('click', function () {
    var valores = document.getElementById("idTipo").value.split(",");

    //alert(valores[1] + ", " + valores[0].toString() + ", " + valores[4]);
    
    $.get("/Ofertas/setOfertaSegunda", {
        id: valores[1],
        tipo: valores[0].toString(),
        idSegunda: valores[4]
    }, function (data) {
            var url = window.location.origin + "/Ofertas/EditarEnvio?" + valores[0] + "=" + valores[1] + "&" + "Predecesor=" + valores[2] + "&" + "AceptoTrueque=" + valores[3];
            //alert(url)
            window.location = url;
    });

}, false);