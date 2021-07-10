
var map = L.map('mapid', {
    zoom: 8.25,
    minZoom: 1.25,
    boxZoom: true,
    maxBounds: L.latLngBounds(L.latLng(-100.0,-270.0), L.latLng(100.0, 270.0)),
    center: [19, -70.6],
});


var Esri_WorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}');
var Esri_Imagery_Labels = L.esri.basemapLayer('ImageryLabels');
basemaps = {"Basemap": L.layerGroup([Esri_WorldImagery, Esri_Imagery_Labels]).addTo(map)}

var GetSiteInfo = function(){
    $.ajax({
        type: "GET",
        url: "GetSiteInfo/",
        dataType: "JSON",

        success: function(result) {

            var myInfo =result.siteInfo;
            const myOtherSites = [];

 //           console.log(typeof result);
//            console.log(typeof myInfo);

            for(var i=0; i< myInfo.length; ++i){
                if (myInfo[i]['sitename'].includes("Presa") || myInfo[i]['sitename'].includes("presa")) {
                    myOtherSites.push(myInfo[i]);
                }
            }
            console.log(myOtherSites)
        }
    })
}

var GetSitesNow = function(){
    $.ajax({
        type: "GET",
        url: "getMySites/",
        dataType: "JSON",

        success: function(result) {

            var mySites = result.siteInfo;
            const myGoodSites = [];

 //           console.log(typeof mySites);

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
                            var markerLocation = new L.LatLng(myGoodSites[i-1]['latitude'], myGoodSites[i-1]['longitude']);
                            map.setView(markerLocation, 10);
                            marker = new L.Marker(markerLocation);
                            marker.bindPopup(myGoodSites[i]['sitename']);
                            marker.openPopup()

                        }
                    }
                }
            })
        }
    })
}
GetSiteInfo()
GetSitesNow()

function load_timeseries() {
    let myreservoir = $("#variables").val();
    if (myreservoir === 'none') {
        alert("You have not selected a reservoir");
    } else {
        GetSitesNow()
        console.log(myinfo)
        $("#obsgraph").modal('show');
        $("#siteinfo").html(`<h1>${myinfo}</h1>`);
    }}

$("#timeseries").click(function() {
    load_timeseries();
})

