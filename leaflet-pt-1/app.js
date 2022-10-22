// Create Url
let geoApi = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_day.geojson"

let tetUrl = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"


console.log(geoApi)

// setting up map
// let map = L.map('map').setView([51.505, -0.09], 10);
// Create Base layer
let tile = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
});

// Create tilelayer for topograph
let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.opentopomap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});

// create BaseMap object
let base = {
    'street map': tile,
    'topograph': topo
};

// Create Overlay
let eqs = new L.layerGroup();
let tets = new L.layerGroup();
let overlay = {
    'Earthquakes': eqs,
    'Tetonic Plates': tets,
};

// create Map
let eMap = L.map('map', {
    center:[
        40.7, -94.5
    ],
    zoom: 4,
    layers:[eqs, tets]
});
// Create control layer
L.control.layers(base, overlay, {
    collapsed: false,
}).addTo(eMap);

// Create Earthquake layer
d3.json(geoApi).then(function(data){
    function styleInfo(feature){
        return {
            opacity: 1,
            fillOpacity: 1,
            fillColor: getColor(feature.properties.mag),
            color: "#0000000",
            radius: getRadius(feature.properties.mag),
            stroke: true,
            weight: 0.7,
        };
    }
    // Create Magnitudes
    function getColor(magnitude){
        if (magnitude > 5){
            return "#e0e0e0";
        }
        if (magnitude > 4){
            return "#f2f2f2";
        }
        if (magnitude > 3){
            return "#ffffff";
        }
        if (magnitude > 2){
            return "#ffffff";
        }
        if (magnitude > 1){
            return "#ffffff";
        }
        return "#ffffff"
    }
    function getRadius(magnitude) {
        if (magnitude === 0)
            return 1
            return magnitude * 4;
 }
//  Add geo json layer
L.geoJSON(data, {
    pointToLayer: function(feature, latlng){
        console.log(data);
        return L.circleMarkers(latlng);
    },
    style: styleInfo,
    onEachFeature: function(feature, layer) {
        layer.bindPopup('magnitude: '+feature.properties.mag+"<br>Location: " + feature.properties.place)}
    }).addTo(earthquakes)
    eqs.addTo(eMap)
   });

// Create tetonic plates
d3.json(tetURL).then(function (tplatedata) {
    // L.geojson layer
    L.geoJSON(tplatedata,{
      // add color
     }).addTo(tets)
     tets.addTo(eMap)
    });

// Create legend
let legend = L.control({position: "bottomright"});
legend.onAdd = function () {
    let div = L.DomUtil.create("div", "info legend");
    let grades = [0,1,2,3,4,5];
    let colors = [
        "#EA2C2C",
        "#ECB92D",
        "#F9F966",
        "#35D45A",
        "#00FF3C",
        "#FFFFFF",
    ];
    for (let i = 0; i < grades.length; i++) {
            div.innerHTML +=
            "<i style=' background: " + colors[i] + "'></i> "
            + grades[i] +(grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
        }
    return div;
    };
    legend.addTo(eMap);





// creating earthquake icon
// let eqIcon = L.icon({
//     iconUrl: "../leaflet-pt-1/earthquake.png", iconWidth : 10, iconHeight : 16, iconAnchorX :8, iconAnchorY : 8,
    

//     iconSize:     [20, 35], // size of the icon
//     shadowSize:   [50, 64], // size of the shadow
//     iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
//     shadowAnchor: [4, 62],  // the same for the shadow
//     popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
// });

// L.marker([51.5, -0.9], {icon: eqIcon}).addTo(map);
