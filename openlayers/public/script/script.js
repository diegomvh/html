var map = new OpenLayers.Map('map');

map.addControl(new OpenLayers.Control.LayerSwitcher());

var gmap = new OpenLayers.Layer.Google("Google Streets", {
    sphericalMercator: true,
    'maxExtent': new OpenLayers.Bounds(-20037508.34, -20037508.34, 20037508.34, 20037508.34)
});
var pointLayer = new OpenLayers.Layer.Vector("Point Layer");
map.addLayers([gmap, pointLayer]);

map.zoomToMaxExtent();