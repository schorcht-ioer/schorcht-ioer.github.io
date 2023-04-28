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

    var request = new XMLHttpRequest();
    request.open('GET', fileUrl, true);
    request.responseType = 'blob';
    request.onload = function() {
        var reader = new FileReader();
        reader.readAsArrayBuffer(request.response);
        reader.onload =  function(e){
            //console.log('DataURL:', e.target.result);
      console.log('data readed');
            convertToLayer(e.target.result);
      
        };
    };
    request.send();
        
}

//More info: https://developer.mozilla.org/en-US/docs/Web/API/FileReader
function handleZipFile(file){
	var reader = new FileReader();
  reader.onload = function(){
	  if (reader.readyState != 2 || reader.error){
		  return;
	  } else {
		  convertToLayer(reader.result);
  	}
  }
  reader.readAsArrayBuffer(file);
}

function convertToLayer(buffer){
	shp(buffer).then(function(geojson){	//More info: https://github.com/calvinmetcalf/shapefile-js
    var layer = L.shapefile(geojson).addTo(map);//More info: https://github.com/calvinmetcalf/leaflet.shapefile
    console.log(layer);
  });
}
