var myEl = document.getElementById('enviar');

myEl.addEventListener('click', function () {

    var url = window.location.href.split("=");
    var AceptoTrueque = ((url[url.length - 1] == "true") || (url[url.length - 1] == "True"));

    var MetodoFisico = "";
    var DetalleFisico = "";     
    var MetodoDigital = "";
    var DetalleDigital = "";

    var a = document.getElementById('envioFisico');

    try {
        MetodoFisico = a.options[a.selectedIndex].text;
        DetalleFisico = document.getElementById('detallesFisico').value;        
    }
    catch{

    }

    var b = document.getElementById('envioDigital');

    try {   
        MetodoDigital = b.options[b.selectedIndex].text;
        DetalleDigital = document.getElementById('detallesDigital').value;
    }
    catch{

    }

    var Id = document.getElementById('id').getAttribute('value');

    var restriccion = new RegExp('\[^A-Za-z0-9 .,äáàëéèíìöóòúùñçÄÁÀËÉÈÍÌÖÓÒÚÙÑ]+','g');

    if (restriccion.test(DetalleFisico) || restriccion.test(DetalleDigital) || DetalleFisico.length == 0 || DetalleFisico == "") {
        alert("Estimado usuario, solo se permiten palabras, espacios, numeros, comas y puntos");
        return false;
    }

    //alert(MetodoFisico + ", " + DetalleFisico + ", " + MetodoDigital + ", " + DetalleDigital + ", " + AceptoTrueque + ", " + Id);
    
    $.get("/Ofertas/agregarDetalles", {
        metodoEnvioFisico: MetodoFisico,
        detalleFisico: DetalleFisico,
        metodoEnvioVirtual: MetodoDigital,
        detalleDigital: DetalleDigital,
        aceptoTrueque: AceptoTrueque,
        id: Id
    }, function (data) {
            $('#enviarPropuesta').modal('show');
    });

}, false);

