var map;

function init() {
    map = new OpenLayers.Map('map');
    epsg4326 = new OpenLayers.Projection("EPSG:4326");
    projectTo = new OpenLayers.Projection("EPSG:900913");
   
    var lonLat = new OpenLayers.LonLat(-0.1279688, 51.5077286).transform(epsg4326, projectTo);
    
    var zoom=14;
    
    var gmap = new OpenLayers.Layer.Google(
        "Google Streets", // the default
        {numZoomLevels: 20, visibility: false}
    );
    
    var markers = new OpenLayers.Layer.Markers( "Markers" );
    var marker = new OpenLayers.Marker(new OpenLayers.LonLat(-0.1279688, 51.5077286 ).transform(epsg4326, projectTo));
    markers.addMarker(marker);
    marker.events.register("click", marker, function() {
      $(marker.icon.imageDiv).popover({
        title:"Hola",
        content: "<h1>Hola</h1><a href='http://www.google.com'>google</a>",
        html: true
        });
    });
    var pointLayer = new OpenLayers.Layer.Vector("Point Layer");
    
    // Testin vectors
    // Define markers as "features" of the vector layer:
    var p2 = new OpenLayers.Feature.Vector(
            new OpenLayers.Geometry.Point( -0.1244324, 51.5006728  ).transform(epsg4326, projectTo),
            {description:'Big Ben'}
        );
    
    var p3 = new OpenLayers.Feature.Vector(
            new OpenLayers.Geometry.Point( -0.119623, 51.503308  ).transform(epsg4326, projectTo),
            {description:'London Eye'}
        );
    pointLayer.addFeatures([p2, p3]);
    
    map.addLayers([gmap, pointLayer, markers]);
    map.setCenter(lonLat, zoom);
}