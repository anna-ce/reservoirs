

var map = L.map('mapid', {
    zoom: 8.25,
    minZoom: 1.25,
    boxZoom: true,
    maxBounds: L.latLngBounds(L.latLng(-100.0,-270.0), L.latLng(100.0, 270.0)),
    center: [19, -70.6],
});


//let latlon = L.control({ position: "bottomleft" })
//latlon.onAdd = function() {
//    let div = L.DomUtil.create("div", "well well-sm")
//    div.innerHTML = '<div id="mouse-position" style="text-align: center"></div>'
//    return div
//}
//
//const mapObj = map() // used by legend and draw controls
//const basemapObj = basemaps() // used in the make controls function
//mapObj.on("mousemove", function(event) {
//    $("#mouse-position").html(
//        "Lat: " + event.latlng.lat.toFixed(5) + ", Lon: " + event.latlng.lng.toFixed(5)
//    )
//})
//
//latlon.addTo(mapObj)


var Esri_WorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}');
var Esri_Imagery_Labels = L.esri.basemapLayer('ImageryLabels');
basemaps = {"Basemap": L.layerGroup([Esri_WorldImagery, Esri_Imagery_Labels]).addTo(map)}

//gets reservoirs from hydroserver//
//var GetSitesNow = function(){
//     $.ajax({
//          type: "GET",
//          url: "getMySites/",
//          dataType: "JSON",
//
//          success: function(result) {
//          var mySites = result.siteInfo;
//          let myGoodSites = []
//
//          for(var i=0; i< mySites.length; ++i){
//            if(mySites[i]['sitename'].includes("Presa") || mySites[i]['sitename'].includes("presa")){
//                myGoodSites.push(mySites[i]);
//            }}
//
//            for(var i=0; i< myGoodSites.length; ++i){
//                var markerLocation = new L.LatLng(myGoodSites[i]['latitude'], myGoodSites[i]['longitude']);
//                marker = new L.Marker(markerLocation);
//                marker.bindPopup(myGoodSites[i]['sitename']);
//                map.addLayer(marker)
//                //add something here that zooms to marker with associated reservoir name or chooses reservoir name on dropdown list if you click on the reservoir marker
//            }
//          }
//     })
//}


function load_timeseries() {
    let myreservoir = $("#variables").val();
    console.log(myreservoir);
    if (myreservoir === 'none') {
        alert("You have not selected a reservoir");
    } else {
        $("#obsgraph").modal('show');

    }}

$("#timeseries").click(function() {
    load_timeseries();
})

var GetSitesNow = function(){
    $.ajax({
        type: "GET",
        url: "getMySites/",
        dataType: "JSON",

        success: function(result) {
            var mySites = result.siteInfo;
            let myGoodSites = []

            for(var i=0; i< mySites.length; ++i){
                if (mySites[i]['sitename'].includes("Presa") || mySites[i]['sitename'].includes("presa")) {
                    myGoodSites.push(mySites[i]);
                }}

            for(var i=0; i< myGoodSites.length; ++i){
                var markerLocation = new L.LatLng(myGoodSites[i]['latitude'], myGoodSites[i]['longitude']);
                marker = new L.Marker(markerLocation);
                marker.bindPopup(myGoodSites[i]['sitename']);
                map.addLayer(marker)
            }

            $("#variables").change(function() {

                let curres = $("#variables").val()
                id = curres

                if (id == "none") {
                    map.fitBounds(L.latLngBounds(L.latLng(20.178299, -72.084407), L.latLng(17.609021, -68.267347)))
                } else {
                    for (var i=0; i<myGoodSites.length; ++i) {
                        if (id == i) {
                            mylat = myGoodSites[i]['latitude']
                            mylong = myGoodSites[i]['longitude']
                            map.fitBounds(l.latLng(mylat, mylong))
                        }
                    }
                }
            })
        }
    })
}
GetSitesNow()
//        statesFeatureGroup.eachLayer(function(layer) {
//            if (layer.feature.properties.id == id) {
//                matched_layer = layer
//            }
//        })
//
//        mapObj.fitBounds(matched_layer.getBounds())

