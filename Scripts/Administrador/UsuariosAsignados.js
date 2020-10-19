$(document).ready(function () {
    $("#buscar").click(buscarUsuario);
});

function buscarUsuario() {
    var usuario = $("#campoUser").val();
    $(".usuario-asignado").each(function (i, e) {
        var id = $(e).attr("id");
        if (id.indexOf(usuario) >= 0) {
            $(".ua[data-email='" + id + "']").attr("style", "display: flex !important");
        } else {
            $(".ua[data-email='" + id + "']").attr("style", "display: none !important");
        }
    })
}