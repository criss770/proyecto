function iniciarMap() {
    var coord = { lat: -34.5956145, lng: -58.4431949 };

    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 10,
        center: coord,
    });

    var marker = new google.maps.Marker({
        position: coord,
        map: map,
        draggable: true,
    });

    marker.addListener('dragend', function (event) {
        actualizarUbicacion(event.latLng);
    });

    map.addListener('click', function (event) {
        marker.setPosition(event.latLng); 
        actualizarUbicacion(event.latLng);
    });

    function actualizarUbicacion(latLng) {
        var inputUbicacion = document.querySelector('input[name="ubicacion"]');
        inputUbicacion.value = latLng.lat().toFixed(6) + ", " + latLng.lng().toFixed(6); 
    }
}
