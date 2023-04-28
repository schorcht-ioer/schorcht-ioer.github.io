$(document).ready(function() {
    startPreview(true);
});
    
function translateBaseHtmlPage() {
    var mapPreviewText = $.i18n( "mapPreviewText" );
    $( '.mapPreviewText' ).text( mapPreviewText );
}

function writeContentAndData(data, fileUrl, file, title, authors) {
    addStandardPreviewHeader(file, title, authors);
    
    console.log('fileUrl');
    console.log(fileUrl);

    
    // initialize the map
    var map = L.map('map').fitWorld();

    // load a tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // add shp data to map and zoom to added features    
    //console.log('handleZipFile'); 
    //var data_complete = data;
    //handleZipFile(data);   
	
    var request = new XMLHttpRequest();
    request.open('GET', MY_URL, true);
    request.responseType = 'blob';
    request.onload = function() {
        var reader = new FileReader();
        reader.readAsDataURL(request.response);
        reader.onload =  function(e){
            console.log('DataURL:', e.target.result);
            convertToLayer(e.target.result);
	    
        };
    };
    request.send();
        
}

function handleZipFile(data){
    console.log(data);
    //data.then(convertToLayer(str2ab(data)));
    //if (document.readyState == 'loading') {
    //  // still loading, wait for the event
    //  document.addEventListener('DOMContentLoaded', convertToLayer);
    //} else {
    //  // DOM is ready!
    //  convertToLayer(str2ab(data));
    //}
}

function convertToLayer(buffer){
    shp(buffer).then(function(geojson){	
        var layer = L.shapefile(geojson).addTo(map);
        map.fitBounds(layer.getBounds());
    //console.log(layer);
    });
}

function str2ab(str) {
    var buf = new ArrayBuffer(str.length*2);
    var bufView = new Uint8Array(buf);
    for (var i=0, strLen=str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
    }
    return buf;
}
