function aceptarEnvios(id, aceptoTrueque) {
    $.get("/Ofertas/AceptarEnvio", {
        Id: id,
        AceptoTrueque: aceptoTrueque
    });
}