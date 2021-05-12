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


var GetSitesNow = function(){
     $.ajax({
          type: "GET",
          url: "getMySites/",
          dataType: "JSON",
          success: function(result) {
          var mySites = result.siteInfo;
          console.log(result.siteInfo);
          var myGoodSites = [];

          for(var i=0; i< mySites.length; ++i){
            if(mySites[i]['sitename'].includes("Presa") || mySites[i]['sitename'].includes("presa") ){
                myGoodSites.push(mySites[i]);
                // do it here//
            }
          }

//            var presa = ['Presa'];
//            const res = Object.values(result.siteInfo).filter(({
//                  sitename
//            }) => presa.includes(sitename));
//                console.log(res)
//            var output = result.filter function((obj){
//                return obj.siteInfo.sitename == filter_sites;
//            });
          }
      })
}
