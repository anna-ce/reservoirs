
function getSiteInfoTable() {

    let full_site_code = $("#variables").val();
    let site_full_name = $("#variables option:selected").text();

    let fsc = {
      full_code: full_site_code,
      site_name: site_full_name
    }

    $.ajax({
    type: "GET",
    url: "GetSiteInfo2/",
    dataType: "JSON",
    data: fsc,

    success: function(result) {
        console.log(result)


        var myInfo = result.siteInfo;
        const myOtherSites = [];

        if (myInfo['siteInfo'][0]['siteName'].includes("Presa") || myInfo['siteInfo'][0]['siteName'].includes("presa")) {
            myOtherSites.push(myInfo);
        }

        let myreservoir = $("#variables").val();

        for (var i=0; i<myOtherSites.length; ++i) {

            if (myreservoir == i) { break; }

                let MyGoodInfo = myOtherSites[i];

                var mysitename = MyGoodInfo.siteInfo[0].siteName;
                var sitecode = MyGoodInfo.siteInfo[0].siteCode;
                var citation = MyGoodInfo.siteInfo[0].citation;
                var description = MyGoodInfo.siteInfo[0].description;
                var variable = MyGoodInfo.siteInfo[0].variableName;
                var latitude = MyGoodInfo.siteInfo[0].latitude;
                var longitude = MyGoodInfo.siteInfo[0].longitude;
                var beginDateTime = MyGoodInfo.siteInfo[0].beginDateTime;
                var endDateTime = MyGoodInfo.siteInfo[0].endDateTime;

        }

        $("#info_site_table").html(

          `<div class="table-responsive">
            <table class="table">
              <tbody>
                <tr>
                  <td>Site Name</td>
                  <td>${mysitename}</td>
                </tr>
                <tr>
                  <td>Site Code</td>
                  <td>${sitecode}</td>
                </tr>
                <tr>
                  <td>Organization</td>
                  <td>${citation}</td>
                </tr>
                <tr>
                  <td>Description</td>
                  <td>${description}</td>
                </tr>
                <tr>
                  <td>Active Variable</td>
                  <td>${variable}</td>
                </tr>
                <tr>
                  <td>Geolocation</td>
                  <td>${latitude} , ${longitude} </td>
                </tr>
                <tr>
                  <td>Beginning Date Time </td>
                  <td>${beginDateTime.split("T")[0]} </td>
                </tr>
                <tr>
                  <td>End Date Time </td>
                  <td>${endDateTime.split("T")[0]} </td>
                </tr>
              </tbody>
            </table>
          </div>`);
          $("#info_site_table").removeClass("hidden");
          $("#title-site").removeClass("hidden");
    }})
}


$("#variables").on("change",function(){
  getSiteInfoTable()
})

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
            const myGoodSites = [];

//           console.log(mySites);

            for(var i=0; i< mySites.length; ++i){
                if (mySites[i]['sitename'].includes("Presa") || mySites[i]['sitename'].includes("presa")) {
                    myGoodSites.push(mySites[i]);
                }}

            for(var i=0; i< myGoodSites.length; ++i){
                var markerLocation = new L.LatLng(myGoodSites[i]['latitude'], myGoodSites[i]['longitude']);
                var marker = new L.Marker(markerLocation)
                marker.bindPopup(myGoodSites[i]['sitename']);
                map.addLayer(marker)
            }

            $("#variables").change(function() {

                let curres = $("#variables").val()
                id = curres
                var markers = [];

                if (id == "none") {
                    map.fitBounds(L.latLngBounds(L.latLng(20.178299, -72.084407), L.latLng(17.609021, -68.267347)))
                } else {
                    for (var i=0; i<myGoodSites.length; ++i) {

                        var markerLocation = new L.LatLng(myGoodSites[i]['latitude'], myGoodSites[i]['longitude']);
                        var marker = new L.Marker(markerLocation);
                        marker.bindPopup(myGoodSites[i]['sitename']);
                        map.addLayer(marker)
                        markers.push(marker)

                        if (id == myGoodSites[i]['fullSiteCode']) {
                            map.setView(markerLocation, 10);


                            for (var j in markers){
                                if (markers[j]._popup._content == myGoodSites[i]['sitename']){
                                    markers[j].openPopup()
                                }
                            }
                        }
                    }
                }
            })
         }
    })
}
GetSitesNow();

function getValues() {

    $('#mytimeseries-loading').removeClass('hidden');


    let site_full_code = $("#variables").val();
    let fsc = {
        full_code: site_full_code
    }

    $.ajax({
        type: "GET",
        url: "GetValues",
        dataType: "JSON",
        data: fsc,

        success: function(result) {

            // Plotly.purge('myDiv')
            $('#mytimeseries-loading').addClass('hidden');


            var values = result.myvalues;
            specific_values = values[0]['values'];
            sitename = values[0]['values'][0]['siteName']
            const mydatavalues = [];
            const mydateTime = [];

            for(var i=0; i<specific_values.length; ++i){
                mydatavalues.push(specific_values[i]['dataValue']);
                mydateTime.push(specific_values[i]['dateTime'])
            }

            var values_trace = {
              type: "scatter",
              x: mydateTime,
              y: mydatavalues,
              line: {color: '#17BECF'}
            }

            var data = [values_trace];

            var layout = {
                title: 'Water Surface Level',
                xaxis: {
                    title: {
                        text: 'Years [yr]',
                        font: {
                        family: 'Courier New, monospace',
                        size: 18,
                        color: '#7f7f7f'
                        }
                    },
                },
                yaxis: {
                    title: {
                        text: 'Meters [m]',
                        font: {
                        family: 'Courier New, monospace',
                        size: 18,
                        color: '#7f7f7f'
                        }
                    }
                },
                autosize:true
            };
            Plotly.newPlot('myDiv', data, layout);
            window.onresize = function() {
                Plotly.relayout('myDiv', {
                    'xaxis.autorange': true,
                    'yaxis.autorange': true
                });
            };
        }
    })
}

function getSiteInfo() {

    let full_site_code = $("#variables").val();
    let site_full_name = $("#variables option:selected").text();

    let fsc = {
      full_code: full_site_code,
      site_name: site_full_name
    }
    $("#info_site-loading").removeClass("hidden");
    $.ajax({
    type: "GET",
    url: "GetSiteInfo/",
    dataType: "JSON",
    data: fsc,

    success: function(result) {
        console.log(result)
        var storage_capacity = result.values_sc;
        var elvs = storage_capacity.map(function (i) { return i[1]})
        var vols = storage_capacity.map(function (i) { return i[0]})
        var historical_data = result.values_hist;

        var date_hist = historical_data.map(function (i) { return i[0]})
        var elv_hist = historical_data.map(function (i) { return i[1]})
        var min_vals_hist = Array(date_hist.length).fill(result.minimum);
        var max_vals_hist = Array(date_hist.length).fill(result.maximum);


        let myreservoir = $("#variables").val();


        var sc_max_trace = {
          type: "scatter",
          name: 'Niveles Reportados',
          x: elvs,
          y: vols,
          fill: 'tozeroy',
          mode: 'lines',
        }
        var data = [sc_max_trace];

        var layout = {
            title: 'Storage Capacity Curve',
            xaxis: {
                title: {
                    text: 'Water Surface Level [m]',
                    font: {
                    family: 'Courier New, monospace',
                    size: 18,
                    color: '#7f7f7f'
                    }
                }
            },
            yaxis: {
                title: {
                    text: 'Volume[CMC]',
                    font: {
                    family: 'Courier New, monospace',
                    size: 18,
                    color: '#7f7f7f'
                    }
                }
            },
            autosize:true

        };

        Plotly.newPlot('site_sc_chart', data, layout);
        window.onresize = function() {
            Plotly.relayout('site_sc_chart', {
                'xaxis.autorange': true,
                'yaxis.autorange': true
            });
        };
        var hist_trace = {
          type: "scatter",
          name: 'Water Level Reported',
          x: date_hist,
          y: elv_hist,
          fill: 'tozeroy',
          mode: 'lines',
        }
        var max_trace = {
          type: "scatter",
          name: 'Water Level Reported',
          x: date_hist,
          y: max_vals_hist,
          mode: 'lines',
        }
        var min_trace = {
          type: "scatter",
          name: 'Water Level Reported',
          x: date_hist,
          y: min_vals_hist,
          mode: 'lines',
        }
        var data_hist = [hist_trace,max_trace,min_trace ];

        var layout = {
            title: 'Historical Data',
            xaxis: {
                title: {
                    text: 'Time',
                    font: {
                    family: 'Courier New, monospace',
                    size: 18,
                    color: '#7f7f7f'
                    }
                }
            },
            yaxis: {
                title: {
                    text: 'Water Surface Level [m]',
                    font: {
                    family: 'Courier New, monospace',
                    size: 18,
                    color: '#7f7f7f'
                    }
                }
            },
            autosize:true
        };
        Plotly.newPlot('site_hist_chart', data_hist, layout);
        window.onresize = function() {
            Plotly.relayout('site_hist_chart', {
                'xaxis.autorange': true,
                'yaxis.autorange': true
            });
        };
        $("#site_info_ta").html(

          `<div class="table-responsive">
            <table class="table table-hover">
            <thead>
              <tr>
              <th>Volume Type</th>
              <th>Value (MCM)</th>
              </tr>
            </thead>
              <tbody>
                <tr>
                  <td>Last Volume</td>
                  <td>${result['volumes']['Actual']} </td>
                </tr>
                <tr>
                  <td>Util Volume</td>
                  <td>${result['volumes']['Util']}</td>
                </tr>
                <tr>
                  <td>Maximun Volume</td>
                  <td>${result['volumes']['Max']}</td>
                </tr>
                <tr>
                  <td>Minimun Volume</td>
                  <td>${result['volumes']['Min']}</td>
                </tr>
              </tbody>
            </table>
          </div>`);
        $("#site_info_ta2").html(

          `<div class="table-responsive">
            <table class="table table-hover">
            <thead>
              <tr>
              <th>Elevation Type</th>
              <th>Value (M)</th>
              </tr>
            </thead>
              <tbody>
                <tr>
                  <td>Last Elevation</td>
                  <td>${result['last_elv']} </td>
                </tr>
                <tr>
                  <td>Maximun Elevation</td>
                  <td>${result['maximum']}</td>
                </tr>
                <tr>
                  <td>Annually Average Elevation</td>
                  <td>${result['el_ua']}</td>
                </tr>
                <tr>
                  <td>Monthly Average Elevation</td>
                  <td>${result['el_um']}</td>
                </tr>
                <tr>
                  <td>Minimun Elevation</td>
                  <td>${result['minimum']}</td>
                </tr>
              </tbody>
            </table>
          </div>`);
        $("#info_site-loading").addClass("hidden");


    }})
}

function getForecast() {

    $('#fe-loading').removeClass('hidden');
    $('#fv-loading').removeClass('hidden');

    let site_full_name = $("#variables option:selected").text();
    let fsc = {
        site_name: site_full_name
    }

    $.ajax({
        type: "GET",
        url: "GetForecast",
        dataType: "JSON",
        data: fsc,

        success: function(result) {
          console.log(result);
          $('#fe-loading').addClass('hidden');
          $('#fv-loading').addClass('hidden');

          if(!result.hasOwnProperty('error')){
            var values_avg = result.avg;
            var values_se = result.se5;
            var values_max = result.max;
            var mydateTime =  result.date;
            // var init_elv = result.init_elv;

            var values_avg2 = result.avg2;
            var values_se2 = result.se52;
            var values_max2 = result.max2;
            var mydateTime2 =  result.date2;
            // var init_vol = result.init_vol;
            //
            //
            // var min_vals = [values_avg[0],values_se[0]];
            // var chart_min =  Math.min.apply(null,min_vals);
            //
            // console.log([values_max[0],values_avg[0],values_se[0]]);
            // console.log(chart_min);
            // var data_chart_limits = Array(mydateTime.length).fill(chart_min-20);
            // var init_chart_limits = Array(mydateTime.length).fill(init_elv);
            // console.log(data_chart_limits);

            // var values_limits_trace= {
            //   type: "scatter",
            //   x: mydateTime,
            //   y: init_chart_limits,
            //   mode: 'lines',
            //   // line: {color: 'rgba(255,0,0,0.2)'},
            //   name: '',
            //
            // }
            var values_max_trace = {
              type: "scatter",
              name: 'Max StreamFlow Forecast',
              x: mydateTime,
              y: values_max,
              fill: 'tonexty',
              mode: 'lines',
              visible:'legendonly'
            }
            var values_avg_trace = {
              type: "scatter",
              name: 'Average StreamFlow Forecast',
              mode: 'lines',
              x: mydateTime,
              y: values_avg,
              // line: {color: '#17BECF'}
            }
            var values_se5_trace = {
              type: "scatter",
              name: '75% StreamFlow Forecast',
              x: mydateTime,
              y: values_se,
              line: {
                dash: 'dashdot',
                width: 4
              }
            }
            // var init_limits_trace= {
            //   type: "scatter",
            //   x: mydateTime,
            //   y: init_chart_limits,
            //   mode: 'lines',
            //   // line: {color: 'rgba(255,0,0,0.2)'},
            //   name: 'Initial Volume',
            // }
            var values_max_trace2 = {
              type: "scatter",
              name: 'Max StreamFlow Forecast',
              x: mydateTime,
              y: values_max2,
              fill: 'tonexty',
              mode: 'lines',
              visible: 'legendonly'
            }
            var values_avg_trace2 = {
              type: "bar",
              name: 'Average StreamFlow Forecast',
              mode: 'lines',
              x: mydateTime,
              y: values_avg2,
              fill: 'tozeroy',

              // line: {color: '#17BECF'}
            }
            var values_se5_trace2 = {
              type: "bar",
              name: '75% StreamFlow Forecast',
              x: mydateTime,
              y: values_se2,
              // fill: 'tozeroy',
              line: {
                dash: 'dashdot',
                width: 4
              }
            }
            // var data = []
            // if(chart_min > 0){
            //   var data = [values_se5_trace,values_max_trace,values_avg_trace];
            //   // var data = [values_limits_trace,values_max_trace,values_avg_trace,values_se5_trace];
            // }
            // else{
            //   var data = [values_avg_trace,values_max_trace,values_se5_trace];
            //   // var data = [values_limits_trace,values_max_trace,values_avg_trace,values_se5_trace];
            // }
            // var data = [values_limits_trace,values_max_trace,values_avg_trace,values_se5_trace];
            var data = [values_avg_trace,values_max_trace,values_se5_trace];

            var data2 = [values_avg_trace2,values_se5_trace2,values_max_trace2];

            var layout = {
                title: 'Forecasted Water Surface Level',
                yaxis: {
                    title: {
                        text: 'Water Surface Level [m]',
                        font: {
                        family: 'Courier New, monospace',
                        size: 18,
                        color: '#7f7f7f'
                        }
                    }
                },
                autosize:true
            };
            var layout2 = {
                title: 'Forecasted Volume',
                yaxis: {
                    title: {
                        text: 'Volume [MCM]',
                        font: {
                        family: 'Courier New, monospace',
                        size: 18,
                        color: '#7f7f7f'
                        }
                    }
                },
                autosize:true
            };
            Plotly.newPlot('forecast_chart', data, layout);
            Plotly.newPlot('volume_chart', data2, layout2);
            window.onresize = function() {
                Plotly.relayout('forecast_chart', {
                    'xaxis.autorange': true,
                    'yaxis.autorange': true
                });
                Plotly.relayout('volume_chart', {
                    'xaxis.autorange': true,
                    'yaxis.autorange': true
                });
            };
          }
          else{
            $("#forecast_chart").html(result['error']);
          }
        }
    })
}

function load_timeseries() {

    let myreservoir = $("#variables").val();

    if (myreservoir === 'none') {

        alert("You have not selected a reservoir");

    } else {
        // $("#siteinfo").html('');
        // $("#mytimeseries").html('');
        getSiteInfo();
        getValues();
        getForecast();

        $("#obsgraph").modal('show');
    }
}

$("#timeseries").click(function() {
    load_timeseries();
})


$('#forecast_tab_link').click(function(){
  Plotly.Plots.resize("forecast_chart");
  Plotly.relayout("forecast_chart", {
      'xaxis.autorange': true,
      'yaxis.autorange': true
    });

})

$('#mytimeseries_tab_link').click(function(){
  Plotly.Plots.resize("myDiv");
  Plotly.relayout("myDiv", {
      'xaxis.autorange': true,
      'yaxis.autorange': true
    });
})
$('#volumechart_tab_link').click(function(){
  Plotly.Plots.resize("volume_chart");
  Plotly.relayout("volume_chart", {
      'xaxis.autorange': true,
      'yaxis.autorange': true
    });
})
$('#siteinfo_tab_link').click(function(){
  Plotly.Plots.resize("site_sc_chart");
  Plotly.relayout("site_sc_chart", {
      'xaxis.autorange': true,
      'yaxis.autorange': true
    });
  Plotly.Plots.resize("site_hist_chart");
  Plotly.relayout("site_hist_chart", {
      'xaxis.autorange': true,
      'yaxis.autorange': true
    });
})
