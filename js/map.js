//Initialise the map
var map = L.map('map').setView([7.0, -1.09], 7);


//add tile layer to map
var osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
}).addTo(map);

//Add scale to Map
L.control.scale().addTo(map);

//Google street map
var googleStreets = L.tileLayer('http://{s}.google.com/vt?lyrs=m&x={x}&y={y}&z={z}',{
    maxZoom: 20,
    subdomains:['mt0','mt1','mt2','mt3']
});

//Google hybrid map
var googleHybrid = L.tileLayer('http://{s}.google.com/vt?lyrs=s,h&x={x}&y={y}&z={z}',{
    maxZoom: 20,
    subdomains:['mt0','mt1','mt2','mt3']
});

//Satellite map
var googleSat = L.tileLayer('http://{s}.google.com/vt?lyrs=s&x={x}&y={y}&z={z}',{
    maxZoom: 20,
    subdomains:['mt0','mt1','mt2','mt3']
});

//Google Terrain
var googleTerrain = L.tileLayer('http://{s}.google.com/vt?lyrs=p&x={x}&y={y}&z={z}',{
    maxZoom: 20,
    subdomains:['mt0','mt1','mt2','mt3']
})

// Add Marker to map
var marker = L.marker([7.0, -1.09]).addTo(map)

//Add geojson layers without styles
// var regionlayer = L.geoJSON(region)
// .addTo(map)

// var healthsitelayer = L.geoJSON(healthfacility)
// .addTo(map)

// var railwaylayer = L.geoJSON(railway)
// .addTo(map)

//Region styles parameters
var regionStyle = {
  color:"red",
  opacity: 0.1,
  weight: 1
}

//healthfacility Styles parameters
var healthStyle = {
  radius: 8,
  fillColor: "green",
  color: "red",
  weight: 1,
}

// Railway Styles parameters
var railwayStyle = {
  color: "yellow",
}

//Rver Styles parameters


//Add geojson layers with styles
var regionlayer = L.geoJSON(region,{
  style:regionStyle,
  onEachFeature: function (feature, layer) {

    area = (turf.area(feature) / 1000000).toFixed(3);
    center_long = turf.center(feature).geometry.coordinates[0].toFixed(2);
    center_lat = turf.center(feature).geometry.coordinates[1].toFixed(2);

    label = `Name: ${feature.properties.region}<br/>`
    label+=`Area: ${area}<br/>`
    label+=`Center: Long: ${center_long} , Lat: ${center_lat}<br/>`
    layer.bindPopup(label)

    //FOR INDIVIDUAL CONTENTS USE
    // layer.bindPopup(feature.properties.region)
  }
})
// .addTo(map)

var healthsitelayer = L.geoJSON(healthfacility, {
  pointToLayer:function(feature, latlng) {
    return L.circleMarker(latlng, healthStyle );
}
})
// .addTo(map)

//Add geojson function
var railwaylayer = L.geoJSON(railway,{style:railwayStyle,
  onEachFeature: function (feature, layer) {
    layer.bindPopup(feature.properties.NAME)
  }
})
// .addTo(map)

//Adding WMS Layer
var riverWMS = L.tileLayer.wms("http://localhost:8090/geoserver/geospatial/wms", {
    layers: 'geospatial:rivers',
    format: 'image/png',
    transparent: true,
    attribution: ""
}).addTo(map)

//Basemaps
var baseLayers = {
    "Open Street Map": osm,
    "Google Street Map": googleStreets,
    "Google Hybrid Map": googleHybrid,
    "Google Satellite Map": googleSat,
    "Google Terrain Map": googleTerrain,
};

//Layers
var overlays = {
    "Marker": marker,
    // "Roads": roadsLayer
};

var dataSets = {
  "Regions": regionlayer,
  "Heath Facilities": healthsitelayer,
  "Railway": railwaylayer,
  "River": riverWMS,
};

//Add layer control to map
L.control.layers(dataSets, baseLayers, overlays, {collapsed:false}).addTo(map);

//Add leaflet browser print control
L.control.browserPrint({position: 'topleft'}).addTo(map);

//Mouse moveOver coordinate control
map.on("mousemove", function (e) {
  $("#coordinate").html(`Long: ${e.latlng.lng.toFixed(3)}, Lat: ${e.latlng.lat.toFixed(3)}`)
})
