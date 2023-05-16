$(document).ready(function() {
    startPreview(false);   
});
    
function translateBaseHtmlPage() {
    var mapPreviewText = $.i18n( "mapPreviewText" );
    $( '.mapPreviewText' ).text( mapPreviewText );
}

function writeContent(fileUrl, file, title, authors) {
    addStandardPreviewHeader(file, title, authors);
    
    console.log("fileUrl:",fileUrl);
    console.log("file:",file);
    console.log("title:",title);
    console.log("authors:",authors);
    console.log("fileSizeBlock: ",$("#fileSizeBlock"));

    // set limits
    const file_size_limit = 15; // in MB
    const row_col_limit = 50000; // number of columns or rows
    const load_timeout = 30 // in seconds
      
    var raster_loaded = false;

    //check file size
    let file_size = parseFloat($( "#fileSizeBlock td" )[0].innerText.split(" ")[0]);
    
    if (file_size > file_size_limit){
        show_error(`The file is too big to be displayed (limit is ${file_size_limit.toString()} MB)`);
    }else{
        // initialize the map
        var map = L.map('map').fitWorld();
        
        // enable spinner
        var target = document.getElementById('spinnerContainer');
        var spinner = new Spinner().spin(target);
        
        // add OpenStreetMap basemap
        L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
        
        // load the raster
        fetch(fileUrl)
        .then(response => response.arrayBuffer())
        .then(arrayBuffer => {
            parseGeoraster(arrayBuffer).then(georaster => {
            raster_loaded = true;
            if (georaster.width > row_col_limit || georaster.height > row_col_limit){
                show_error(`The number of rows or columns is too high to be displayed (limit is ${row_col_limit.toString()})`);
            }
            //console.log("georaster:", georaster);
        
            var layer = new GeoRasterLayer({
                georaster: georaster,
                //debugLevel: 2,
                opacity: 1,
                resolution: 256
            });
            layer.addTo(map);	
            map.fitBounds(layer.getBounds());
            
            // disable spinner
            spinner.stop();
            $('#spinnerContainer').hide();
            
            });
        // check if raster is loaded    
        }).then(checkIfLoaded());
        
    } 
}

function show_error(error_text){
    $('#map').hide();
    $('#file_error').show();
    $('#file_error').append(error_text);
}     
 
// it is not possible to catch the error of parseGeoraster :\ see: https://github.com/GeoTIFF/georaster/issues/71 
// in case of not supported tiffs (e.g. Interleaving type "BSQ" with palette) the script stops
// therefore, after a certain time, it is checked whether the raster has been loaded.
function checkIfLoaded() {
    setTimeout(() => {
        if(!raster_loaded){
            show_error("The raster could not be loaded. Interleaving type 'BSQ' with raster palette is not supported.");
            spinner.stop();
            $('#spinnerContainer').hide();
        }  
    }, load_timeout * 1000);
}
