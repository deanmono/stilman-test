'use strict';

angular.module('appInterview')
    .service('FeatureData', ['$http', function ($http) {
        let FeatureData = {}

        FeatureData.getUnits = function() {
            return $http.get("./config/xmlData.xml",
                {
                    transformResponse: function (cnv) {
                        let unitsJSON = xml.xmlToJSON(cnv);
                        let units = unitsJSON['Interview']['Unit']
                        return units;
                    }
                })
                .then(function (response) {
                    let unitMarkers = [];

                    response.data.forEach(function(unit){
                        unitMarkers.push({
                            lat: parseInt(unit.Location.Lat),
                            lng: parseInt(unit.Location.Lon),
                            focus: true,
                            draggable: false,
                            message: unit.ID.toString(),
                            icon: {
                                type: 'div',
                                iconSize: [20, 20],
                                html: `<div style="height:20px;width:20px;background-color:rgb(${unit.Gui.Color.Red},${unit.Gui.Color.Green},${unit.Gui.Color.Blue});display:block;"></div>`,
                                popupAnchor:  [0, 0]
                            }
                        });
                    });
                    return unitMarkers
                });
        }
        return FeatureData;
    }])
    .controller('UnitsmapController', function ($http, $scope, FeatureData, leafletMarkerEvents, leafletLogger, _) {
        FeatureData.getUnits().then(async function(result) {
            $scope.markers = await result
            $scope.marker = _.find(result, 'focus');
            $scope.$apply();
            $scope.changeMarker();
        });

        $scope.metersInMile = 1609;

        $scope.center = {
            lat: 51.505,
            lng: -0.09,
            zoom: 4
        }

        $scope.events =  {
            markers: {
                enable: leafletMarkerEvents.getAvailableEvents()
            }
        }

        $scope.paths = {
           shape: {
               type: "circle",
               radius: 500 * $scope.metersInMile,
               latlngs: {
                   lat: 51.505,
                   lng: -0.09,
               }
           }
        }

        $scope.slider = {
            value: 500,
            options: {
                floor: 0,
                ceil: 10000,
            },
        }

        $scope.$watch('slider.value', function() {
            if($scope.marker) {
                $scope.paths = {
                    shape: {
                        type: "circle",
                        radius: $scope.slider.value * $scope.metersInMile,
                        latlngs: {
                            lat: $scope.marker.lat,
                            lng: $scope.marker.lng
                        }
                    }
                }

                $scope.unselectedMarkers = _.filter($scope.markers, ['focus', false]);

                for(let key in $scope.unselectedMarkers) {
                    let distanceApart = getDistanceFromLatLon($scope.unselectedMarkers[key].lat, $scope.unselectedMarkers[key].lng, $scope.marker.lat, $scope.marker.lng);
                    if (distanceApart < $scope.slider.value) {
                        $scope.markers[key].icon.html = '<div style="height:20px;width:20px;background-color:rgb(255,0,0);display:block;"></div>'
                    } else {
                        $scope.markers[key].icon.html = '<div style="height:20px;width:20px;background-color:rgb(128,224,255);display:block;"></div>'
                    }
                };
            }
            $scope.changeMarker();
        });

        $scope.changeMarker = function(){
            let markerEvents = leafletMarkerEvents.getAvailableEvents();
            for (let k in markerEvents){
                let eventName = 'leafletDirectiveMarker.map.' + markerEvents[k];
                $scope.$on(eventName, function(event, args){
                    let currentMarker = _.find(event.targetScope.markers, 'focus');
                    $scope.eventDetected = event.name;

                    $scope.paths = {
                        shape: {
                            type: "circle",
                            radius: $scope.slider.value * $scope.metersInMile,
                            latlngs: {
                                lat: currentMarker.lat,
                                lng: currentMarker.lng
                            }
                        }
                    }
                    $scope.marker = currentMarker;
                });
            }
        }


        //This function uses the Haversine formula and takes in latitude and longitude of two location and returns the distance between them
        function getDistanceFromLatLon(lat1,lon1,lat2,lon2) {
            let R = 3959; // Radius of the earth in miles
            let dLat = deg2rad(lat2-lat1);  // deg2rad below
            let dLon = deg2rad(lon2-lon1);
            let a =
                Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
                Math.sin(dLon/2) * Math.sin(dLon/2);
            let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
            let d = R * c; // Distance in miles
            return d;
        }

        function deg2rad(deg) {
            return deg * (Math.PI/180)
        }
    })
    .component('unitsmap', {
        templateUrl: './source/shared/unitsmap/unitsmap.html',
        controller: 'UnitsmapController',
        restrict: 'E',
        bindings: {
            active: '@'
        },
        controllerAs: 'vm'
    });