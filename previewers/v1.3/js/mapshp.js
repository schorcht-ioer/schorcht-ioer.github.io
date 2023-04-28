$(document).ready(function() {
    startPreview(true);
    console.log('document ready');
});

// initialize the map
var map = L.map('map').fitWorld();
    
function translateBaseHtmlPage() {
    var mapPreviewText = $.i18n( "mapPreviewText" );
    $( '.mapPreviewText' ).text( mapPreviewText );
}

function writeContentAndData(fileUrl, file, title, authors) {
    addStandardPreviewHeader(file, title, authors);
    
    console.log('fileUrl');
    console.log(fileUrl);

    // load a tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

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
	shp(buffer).then(function(geojson){	//More info: https://github.com/calvinmetcalf/shapefile-js
    var layer = L.shapefile(geojson).addTo(map);//More info: https://github.com/calvinmetcalf/leaflet.shapefile
    console.log(layer);
  });
}
