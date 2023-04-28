$(document).ready(function() {
    startPreview(false);   
});

// initialize the map
var map = L.map('map').fitWorld();
    
function translateBaseHtmlPage() {
    var mapPreviewText = $.i18n( "mapPreviewText" );
    $( '.mapPreviewText' ).text( mapPreviewText );
}

function writeContent(fileUrl, file, title, authors) {
    addStandardPreviewHeader(file, title, authors);

    // load a tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    // get data
    var request = new XMLHttpRequest();
    request.open('GET', fileUrl, true);
    request.responseType = 'blob';
    request.onload = function() {
        var reader = new FileReader();
        reader.readAsArrayBuffer(request.response);
        reader.onload =  function(e){
            convertToLayer(e.target.result);
      
        };
    };
    request.send();
        
}

function convertToLayer(buffer){
    shp(buffer).then(function(shape){	//More info: https://github.com/calvinmetcalf/shapefile-js
        var layer = L.shapefile(shape).addTo(map);  //More info: https://github.com/calvinmetcalf/leaflet.shapefile
        map.fitBounds(shape.getBounds());    
    });
}
