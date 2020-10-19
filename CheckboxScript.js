/*
function cambioCursoSelecionado(cursoId) {
    obtenerCantidadEstudiantes(cursoId);
    obtenerPromedioClase(cursoId);
}

function obtenerCantidadEstudiantes(cursoId) {
    $.get("/CursoDetalles/ObtenerCantidadEstudiantes", {
        cursoId: cursoId
    }, function (resultadoCantidadEstudiantes) {
        $('#cantidadEstudiantes').val(resultadoCantidadEstudiantes);
    });
}

function obtenerPromedioClase(cursoId) {
    $.get("/CursoDetalles/ObtenerPromedioClase", {
        cursoId: cursoId
    }, function (resultadoPromedioClase) {
        $('#promedio').val(resultadoPromedioClase);
    });
}
*/

const lc = document.querySelector('#locaCb');
const pc = document.querySelector('#peorCheck');
const cc = document.querySelector('#concheriasCheck');
const botona = document.querySelector('#botonPrincipal')
botona.onclick = () => {
    const result = lc.checked;
    alert(result); // muestra en un pop-up si el check está marcado o no
};