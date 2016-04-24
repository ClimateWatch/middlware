require.config({
    urlArgs: "bust=" + (new Date()).getTime(),
    /*no caching*/
    paths: {
        'async': 'vendor/requirejs-plugins/src/async',
        "jquery": "vendor/jquery/dist/jquery",
        "jqueryui": "vendor/jquery-ui/jquery-ui",
        "underscore": "vendor/underscore-amd/underscore",
        "backbone": "vendor/backbone-amd/backbone",
        "marionette": "vendor/backbone.marionette/lib/backbone.marionette",
        "leaflet": "vendor/leaflet/dist/leaflet",
        "text": 'vendor/requirejs-plugins/lib/text',
        "hc": 'vendor/highstock/js/highstock.src'
    },
    shim: {}
})


require(['jquery', 'underscore', 'text!json/sensores_smart_mobile.geojson', 'text!json/sensores_smart_mobile_xtended.geojson','text!json/AirBase_FR_v4_stations.geojson','text!json/AirBase_GR_v8_stations.geojson', 'modules/console', 'leaflet'], function($, _, geodata, geodataxtended,stationFRdata, stationGRdata, cnl, L) {


// Your API key for panos.peristeropoulos@gmail.com is:

// uk7gHp7PeFSV8l8wbh0j4xK0zNbCLIWjF8fQmf69
var url = "https://api.nasa.gov/planetary/earth/imagery?lon=100.75&lat=1.5&date=2014-02-01&cloud_score=True&api_key=uk7gHp7PeFSV8l8wbh0j4xK0zNbCLIWjF8fQmf69";


$.ajax({
  url: url,
  success: handleResult
});
function handleResult(result){

    console.log(result);
  if("copyright" in result) {
    $("#copyright").text("Image Credits: " + result.copyright);
  }
  else {
    $("#copyright").text("Image Credits: " + "Public Domain");
  }

  if(result.media_type == "video") {
    $("#apod_img_id").css("display", "none");
    $("#apod_vid_id").attr("src", result.url);
  }
  else {
    $("#apod_vid_id").css("display", "none");
    $("#apod_img_id").attr("src", result.url);
  }
  $("#reqObject").text(url);
  $("#returnObject").text(JSON.stringify(result, null, 4));
  $("#apod_explaination").text(result.explanation);
  $("#apod_title").text(result.title);
}




    var busSensoresOpenData = JSON.parse(geodata)

    var geoxtended = JSON.parse(geodataxtended);
    var stationsFR = JSON.parse(stationFRdata);
    var stationsGR = JSON.parse(stationGRdata);
    var userReportsJSON = JSON.parse(geodataxtended);

    $(document).ready(function() {


        // $.get('http://eric.clst.org/wupl/Stuff/gz_2010_us_outline_500k.json', function(data) {
        //   userReports = JSON.parse(data);
        // });
//         var map = L.map('map').setView([43.44419515712329, -1.8474464416503906], 5);

//         // map.legendControl.addLegend(document.getElementById('legend').innerHTML);

//         L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
//             attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
//             maxZoom: 18,
//             id: 'mapbox.streets',
//             accessToken: 'pk.eyJ1IjoiYzNvcGVuIiwiYSI6ImNpbXQwY2JkcTAwNXV2OW0xa3gzaDJ1dDcifQ.7ho2RzMy9_BG2n7rFTbQ3Q'
//         }).addTo(map);


        // Create groups of layers instead of adding them directly to the map, I am using the LayerGroup class:
        var stations = new L.LayerGroup();
        var mobileStations = new L.LayerGroup();
        var userReports = new L.LayerGroup();
        // L.marker([39.61, -105.02]).bindPopup('This is Littleton, CO.').addTo(stations),
        // L.marker([39.74, -104.99]).bindPopup('This is Denver, CO.').addTo(stations),
        // L.marker([39.73, -104.8]).bindPopup('This is Aurora, CO.').addTo(stations),
        // L.marker([39.77, -105.23]).bindPopup('This is Golden, CO.').addTo(stations);

        L.geoJson(userReportsJSON, {
            onEachFeature: function(feature,layer){
                L.marker(layer._latlng).bindPopup('This is random').addTo(userReports);
                    // .bindPopup('<strong>Science Hall</strong><br>Where the GISC was born.')
                    // .openPopup();
            }
        });


        L.geoJson(busSensoresOpenData, {
            onEachFeature: function(feature,layer){
                L.circle(layer._latlng,5,{
                                color: 'red',
                                fillColor: '#e1e1e1',
                                fillOpacity: 0.5
                            }).bindPopup('This is a mobile station').addTo(mobileStations);
                    // .bindPopup('<strong>Science Hall</strong><br>Where the GISC was born.')
                    // .openPopup();
            }
        });

        var gjStationsGR = L.geoJson(stationsGR, {
            onEachFeature: function(feature,layer){
                L.circle(layer._latlng,5,{
                                color: (feature.properties.station_type_of_area =='urban'?'blue':'green'),
                                fillColor: '#e1e1e1',
                                fillOpacity: 0.5
                            }).bindPopup('AirBaseStation: '+feature.properties.station_name).addTo(stations);
                    // .bindPopup('<strong>Science Hall</strong><br>Where the GISC was born.')
                    // .openPopup();
            }

        });
        var gjStationsFR = L.geoJson(stationsFR, {
            onEachFeature: function(feature,layer){
                L.circle(layer._latlng,5,{
                                color: (feature.properties.station_type_of_area =='urban'?'blue':'green'),
                                fillColor: '#e1e1e1',
                                fillOpacity: 0.5
                            }).bindPopup('AirBaseStation: '+feature.properties.station_name).addTo(stations);
                    // .bindPopup('<strong>Science Hall</strong><br>Where the GISC was born.')
                    // .openPopup();
            }

        });
        var mbAttr = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
                '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
                'Imagery © <a href="http://mapbox.com">Mapbox</a>',
            mbUrl = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpandmbXliNDBjZWd2M2x6bDk3c2ZtOTkifQ._QA7i5Mpkd_m30IGElHziw';

        var grayscale   = L.tileLayer(mbUrl, {id: 'mapbox.light', attribution: mbAttr}),
            streets  = L.tileLayer(mbUrl, {id: 'mapbox.streets',   attribution: mbAttr});

        var map = L.map('map', {
            center: [43.44419515712329, -1.8474464416503906],
            zoom: 5,
            layers: [grayscale, stations, mobileStations, userReports]
        });

        var baseLayers = {
            "Grayscale": grayscale,
            "Streets": streets
        };

        var overlays = {
            "AirBase Stations": stations,
            "Mobile Stations" : mobileStations,
            "User Reports" : userReports
        };

        L.control.layers(baseLayers, overlays).addTo(map);

        var measurementIcon = L.icon({
            iconUrl: 'measureicon.png',
            // shadowUrl: 'leaf-shadow.png',

            iconSize:     [38, 95], // size of the icon
            shadowSize:   [50, 64], // size of the shadow
            iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
            shadowAnchor: [4, 62],  // the same for the shadow
            popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
        });

        //station pins



        // L.geoJson(stationsFR, {
        //     icon:measurementIcon,
        //     // onEachFeature: function(feature, layer) {
        //     //     var info = '<h5>' + new Date(feature.properties.airquality.timestamp).toString() + '</h5><h6>' + feature.geometry.coordinates + '</h6><span class="feature-title">NO2</span>:&nbsp;' + feature.properties.airquality.NO2.actual + '<br>' + '<span class="feature-title">ozone</span>:&nbsp;' + feature.properties.airquality.ozone.actual + '<br>' + '<span class="feature-title">CO</span>:&nbsp;' + feature.properties.airquality.CO.actual + '<br>';
        //     //     layer.bindPopup(info);
        //         // if (feature.properties.airquality.ozone.actual > 50) {
        //         //     var circle1 = L.circle(layer._latlng, feature.properties.airquality.ozone.actual, {
        //         //         color: 'white',
        //         //         fillColor: '#e1e1e1',
        //         //         fillOpacity: 0.5
        //         //     }).addTo(map);
        //         //     circle1.bindPopup("ozone levels: "+feature.properties.airquality.ozone.actual);
        //         // }
        //         // if (feature.properties.airquality.NO2.actual > 0) {
        //         //     var circle2 = L.circle(layer._latlng, feature.properties.airquality.NO2.actual, {
        //         //         color: 'blue',
        //         //         fillColor: '#e1e1e1',
        //         //         fillOpacity: 0.5
        //         //     }).addTo(map);
        //         //     circle2.bindPopup("NO2 levels: "+feature.properties.airquality.NO2.actual);
        //         // }
        //         // if (feature.properties.airquality.CO.actual > 50) {
        //         //     var circle3 = L.circle(layer._latlng, feature.properties.airquality.CO.actual, {
        //         //         color: 'grey',
        //         //         fillColor: '#e1e1e1',
        //         //         fillOpacity: 0.5
        //         //     }).addTo(map);
        //         //     circle3.bindPopup("CO levels: "+feature.properties.airquality.CO.actual);
        //         // }
        //         // if (feature.properties.temperature.temperature.actual > 50) {
        //         //     var circle4 = L.circle(layer._latlng, feature.properties.temperature.temperature.actual, {
        //         //         color: 'red',
        //         //         fillColor: '#e1e1e1',
        //         //         fillOpacity: 0.5
        //         //     }).addTo(map);
        //         //     circle4.bindPopup("temperature levels: "+feature.properties.temperature.temperature.actual);
        //         // }
        //     // }
        // }).addTo(map);



        // _.each(geoxtended, function(item) {
        //     console.log(item)
        //     //geoJSON format has to be mapped to LatLng points (if not specified, coords will be assumed to be WGS84 — standard [longitude, latitude] values in degrees).
        //     // L.circle(item.geometry.coordinates,100).addTo(map);
        //     //map.addLayer(L.circleMarker(item.geometry.coordinates,20));
        //     //map.openPopup( "hello", item.geometry.coordinates );
        // });




        // }).addTo(map);
        // marker.bindPopup(popupContent).openPopup();

        // map.on('drag', function(arg1, arg2) {
        //     console.log('dragging',arg1,arg2);
        //     console.log(map.getCenter())
        // })

        mmmmmap.on('click', function(data) {
            //create circle
            if (this.circle) {
                // this.circle.removeFrom(map);
                map.removeLayer(this.circle)
            }
            this.circle = L.circle(data.latlng, 1000).addTo(map);
            var bounds = L.geoJson(this.circle.toGeoJSON()).getBounds();
            console.log(bounds)
                // console.log(bounds.contains([43.44419515712329, -3.8474464416503906]));
            var containedData = _.filter(geojson, function(item) {
                console.log(bounds.contains(item.geometry.coordinates))
                return bounds.contains(item.geometry.coordinates);
            });
            console.log('contained data', containedData)
            cnl.open({ geojson: geoxtended })
            var e = data && data.originalEvent;

        });

        // $('.searchbox').remove();

        $('a.close-search').on('click', function(e) {
            $(this).closest('.searchbox').remove();
        })


        $('.searchbox .btn-danger').on('click', function(e) {
            $(this).closest('.searchbox').remove();
            //..fly map
        })

        $('.new-searchbox').on('click', function() {
            $('body').append('        <div class="searchbox"><a class="close-search" href="#"><span class="glyphicon glyphicon-remove"></span></a><input type="text" placeholder="Choose your country, city or area"><button class="btn btn-danger">GO</button></div>')
            $('a.close-search').on('click', function(e) {
                $(this).closest('.searchbox').remove();
            })


            $('.searchbox .btn-danger').on('click', function(e) {
                $(this).closest('.searchbox').remove();
                //..fly map
            })
        })

    })

});
