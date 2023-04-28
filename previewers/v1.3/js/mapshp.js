$(document).ready(function() {
    startPreview(true);
});
    
function translateBaseHtmlPage() {
    var mapPreviewText = $.i18n( "mapPreviewText" );
    $( '.mapPreviewText' ).text( mapPreviewText );
}

function writeContentAndData(data, fileUrl, file, title, authors) {
    addStandardPreviewHeader(file, title, authors);
    
    console.log('file'); 
    console.log(file); 
    
    // initialize the map
    var map = L.map('map').fitWorld();

    // load a tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // add shp data to map and zoom to added features    
    console.log('handleZipFile'); 
    handleZipFile(file);
    
}

function handleZipFile(data){
    var reader = new FileReader();
    reader.onload = function(){
        if (reader.readyState != 2 || reader.error){
            return;
        } else {
            convertToLayer(reader.result);
        }
    }
    reader.readAsArrayBuffer(data);
}

function convertToLayer(buffer){
    shp(buffer).then(function(geojson){	
        var layer = L.shapefile(geojson).addTo(map);
        map.fitBounds(layer.getBounds());
    //console.log(layer);
    });
}
