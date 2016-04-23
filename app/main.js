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


require(['jquery', 'underscore', 'text!json/sensores_smart_mobile.geojson', 'text!json/sensores_smart_mobile_xtended.geojson', 'modules/console', 'leaflet'], function($, _, geodata, geodataxtended, cnl, L) {

    var geojson = JSON.parse(geodata)

    var geoxtended = JSON.parse(geodataxtended);

    $(document).ready(function() {
        var map = L.map('map').setView([43.44419515712329, -3.8474464416503906], 13);

        // map.legendControl.addLegend(document.getElementById('legend').innerHTML);

        L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
            attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
            maxZoom: 18,
            id: 'mapbox.streets',
            accessToken: 'pk.eyJ1IjoiYzNvcGVuIiwiYSI6ImNpbXQwY2JkcTAwNXV2OW0xa3gzaDJ1dDcifQ.7ho2RzMy9_BG2n7rFTbQ3Q'
        }).addTo(map);

        var measurementIcon = L.icon({
            iconUrl: 'measureicon.png',
            // shadowUrl: 'leaf-shadow.png',

            iconSize:     [38, 95], // size of the icon
            shadowSize:   [50, 64], // size of the shadow
            iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
            shadowAnchor: [4, 62],  // the same for the shadow
            popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
        });


        L.geoJson(geoxtended, {
            icon:measurementIcon,
            onEachFeature: function(feature, layer) {
                var info = '<h5>' + new Date(feature.properties.airquality.timestamp).toString() + '</h5><h6>' + feature.geometry.coordinates + '</h6><span class="feature-title">NO2</span>:&nbsp;' + feature.properties.airquality.NO2.actual + '<br>' + '<span class="feature-title">ozone</span>:&nbsp;' + feature.properties.airquality.ozone.actual + '<br>' + '<span class="feature-title">CO</span>:&nbsp;' + feature.properties.airquality.CO.actual + '<br>';
                layer.bindPopup(info);
                if (feature.properties.airquality.ozone.actual > 50) {
                    var circle = L.circle(layer._latlng, feature.properties.airquality.ozone.actual, {
                        color: 'red',
                        fillColor: '#e1e1e1',
                        fillOpacity: 0.5
                    }).addTo(map);
                    circle.bindPopup("ozone levels: "+feature.properties.airquality.ozone.actual);
                }

            }


        }).addTo(map);



        // _.each(geoxtended, function(item) {
        //     console.log(item)
        //     //geoJSON format has to be mapped to LatLng points (if not specified, coords will be assumed to be WGS84 — standard [longitude, latitude] values in degrees).
        //     // L.circle(item.geometry.coordinates,100).addTo(map);
        //     //map.addLayer(L.circleMarker(item.geometry.coordinates,20));
        //     //map.openPopup( "hello", item.geometry.coordinates );
        // });

        // L.geoJson(geojson, {
        //     style: function(feature) {
        //         console.log(feature.properties.color);
        //         return { color: feature.properties.color };
        //     },
        //     onEachFeature: function(feature, layer) {
        //         if (feature.properties.color === 'green') {
        //             // L.circle(feature.coordinates, 200).addTo(map);
        //         }
        //         var info = '<h5>' + new Date(feature.properties.timestamp).toString() + '</h5><h6>'+feature.geometry.coordinates+'</h6><span class="feature-title">NO2</span>:&nbsp;' + feature.properties.NO2 + '<br>' + '<span class="feature-title">ozone</span>:&nbsp;' + feature.properties.ozone + '<br>' + '<span class="feature-title">CO</span>:&nbsp;' + feature.properties.CO + '<br>';
        //         layer.bindPopup(info);
        //     }


        // }).addTo(map);
        // marker.bindPopup(popupContent).openPopup();

        // map.on('drag', function(arg1, arg2) {
        //     console.log('dragging',arg1,arg2);
        //     console.log(map.getCenter())
        // })

        map.on('click', function(data) {
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
