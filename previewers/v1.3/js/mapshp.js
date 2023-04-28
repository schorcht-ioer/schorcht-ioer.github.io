$(document).ready(function() {
    startPreview(true);
});

// initialize the map
var map = L.map('map').fitWorld();  

function translateBaseHtmlPage() {
    var mapPreviewText = $.i18n( "mapPreviewText" );
    $( '.mapPreviewText' ).text( mapPreviewText );
}

function writeContentAndData(data, fileUrl, file, title, authors) {
    addStandardPreviewHeader(file, title, authors);

    // load a tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // add shp data to map and zoom to added features 
    var s = Uint8Array.from(data, x => x.charCodeAt(0));
    convertToLayer(s);
    
}

function convertToLayer(buffer){
    shp(buffer).then(function(shp){	
        var layer = L.shapefile(shp).addTo(map);
        map.fitBounds(layer.getBounds());
    });
}

function str2ab(str) {
    var buf = new ArrayBuffer(str.length*2); // 2 bytes for each char
    var bufView = new Uint8Array(buf);
    for (var i=0, strLen=str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
    }
    return buf;
}
