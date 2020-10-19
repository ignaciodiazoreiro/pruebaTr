
var interval = 15000;
setInterval(function () { Update() }, interval);

function Update() {
    $.ajax({
        url: parseUrl(window.location.href, 'origin') + '/Items/ActualizarExpirados',
        //success: function () { alert('Success'); },
        //error: function() { alert('Error'); }
    });
}