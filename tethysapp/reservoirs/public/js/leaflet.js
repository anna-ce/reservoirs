//var map = L.map('mapid').setView([51.505, -0.09], 13);
//
//L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//}).addTo(map);
//
//L.marker([51.5, -0.09]).addTo(map)
//    .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
//    .openPopup();
//



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

 //gets reservoirs from hydroserver//
var GetSitesNow = function(){
     $.ajax({
          type: "GET",
          url: "getMySites/",
          dataType: "JSON",

          success: function(result) {
          var mySites = result.siteInfo;
          let myGoodSites = []

          for(var i=0; i< mySites.length; ++i){
            if(mySites[i]['sitename'].includes("Presa") || mySites[i]['sitename'].includes("presa")){
                myGoodSites.push(mySites[i]);
            }}

            for(var i=0; i< myGoodSites.length; ++i){
                var markerLocation = new L.LatLng(myGoodSites[i]['latitude'], myGoodSites[i]['longitude']);
                marker = new L.Marker(markerLocation);
                marker.bindPopup(myGoodSites[i]['sitename']);
                map.addLayer(marker)
                //add something here that zooms to marker with associated reservoir name or chooses reservoir name on dropdown list if you click on the reservoir marker
            }
          }
     })
}
GetSitesNow()

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




