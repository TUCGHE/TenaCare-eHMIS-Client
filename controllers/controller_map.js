/*
 * 
 * Copyright © 2006-2017 TenaCareeHMIS  software, by The Administrators of the Tulane Educational Fund, 
 * dba Tulane University, Center for Global Health Equity is distributed under the GNU General Public License(GPL).
 * All rights reserved.

 * This file is part of TenaCareeHMIS
 * TenaCareeHMIS is free software: 
 * 
 * you can redistribute it and/or modify it under the terms of the 
 * GNU General Public License as published by the Free Software Foundation, 
 * version 3 of the License, or any later version.
 * TenaCareeHMIS is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or 
 * FITNESS FOR A PARTICULAR PURPOSE.See the GNU General Public License for more details.

 * You should have received a copy of the GNU General Public License along with TenaCareeHMIS.  
 * If not, see http://www.gnu.org/licenses/.    
 * 
 * 
 */

app.controller('mapController', ['$scope', 'mapService', 'leafletData', function ($scope, mapService, leafletData) {
    $scope.selectedFacility = "";
    var map = {};
    angular.extend($scope, {
        center: {
            lat: 8.9806,
            lng: 38.7578,
            zoom: 6
        },
        defaults: {
            scrollWheelZoom: false
        }
    });
  
    function getRandomColor() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }
    
    function showFacility() {
        mapService.getFacilityGISLocation($scope.temphierarchy[0].HMISCode, function (response) {
            if (response.data.length > 0) {
                var latlng = L.latLng(response.data[0].POINT_X, response.data[0].POINT_Y);
                L.marker(latlng, { title: response.data[0].FacilityName }).addTo(map);
                if (response.data[0].FacilityTypeName != "Regional Health Bureau" &&
                    response.data[0].FacilityTypeName != "Zonal Health Department" &&
                    response.data[0].FacilityTypeName != "Woreda Health Bureau")
                    map.setView(latlng, 9);
            }
        });
    }
    function getLocationsByLevel()
    {
        if ($scope.temphierarchy[0].FacilityTypeName == "Regional Health Bureau") {
            mapService.getLocationByRegion($scope.temphierarchy[0].HMISCode, function (response) {
                $scope.locations = response.data;
                getMapLevel();
            });
        }
        else if ($scope.temphierarchy[0].FacilityTypeName == "Zonal Health Department") {
            mapService.getLocationByZone($scope.temphierarchy[0].HMISCode, function (response) {
                $scope.locations = response.data;
                getMapLevel();
            });
        }
        else if ($scope.temphierarchy[0].FacilityTypeName == "Woreda Health Bureau") {
            mapService.getLocationByWoreda($scope.temphierarchy[0].HMISCode, function (response) {
                $scope.locations = response.data;
                getMapLevel();
            });
        }
    }
    $scope.$watch('$scope.temphierarchy[0].FacilityName', function (newValue, oldValue) {
        $scope.selectedFacility = $scope.temphierarchy[0].FacilityName;
        if (newValue != undefined && newValue != oldValue) {
            //clean_map();
            //filter(newValue);
            var promise = mapService.getEthiMap();
            promise.then(function (respond) {
                showFacility();
                $scope.mapData = respond.features;
                getMaps();
                //getLocationsByLevel();
            });
        }
    });
    $scope.$watch('$scope.selectedFacility', function (newValue, oldValue) {

        if (newValue == undefined) {
            //clean_map();
            //filter(newValue);
            var promise = mapService.getEthiMap();
            promise.then(function (respond) {
                showFacility();
                $scope.mapData = respond.features;
                getMaps();
                //getLocationsByLevel();
            });
        }
    });
    function getColor() {
        return {
            fillColor: '#'+Math.floor(Math.random()*16777215).toString(16), weight: 2, opacity: 1, color: 'red', dashArray: '3', fillOpacity: 0.01
        };
    }

    function filter(hmiscode) {       
        L.geoJson($scope.geojson.data, {
            onEachFeature: function (feature, layer) {
                map.fitBounds(layer.getBounds());
                layer.bindPopup(feature.properties.NAME);
            },
            filter: function (feature, _layer) {
                if (feature.properties.HMISCode == hmiscode)
                    return true;
            }
        }).addTo(map);
    }
    function getName(hmisCode) {
        for (var i = 0, len = $scope.mapData.length; i < len; i++) {
            if ($scope.mapData[i].properties.HMISCode === hmisCode)
                return i;
        }
        return -1;
    }

    function getMapLevel() {
        var mapLevel = []

        for (var i = 0; i < $scope.mapData.length; i++) {
            for (var j = 0; j < $scope.locations.length ; j++) {
                if ($scope.mapData[i].properties.HMISCode == $scope.locations[j].HMISCode) {
                    mapLevel.push($scope.mapData[i]);
                }
            }
        }

        angular.extend($scope, {
            geojson: {
                data: mapLevel
                ,
                style: function (feature) {
                    return {
                        fillColor: '#' + Math.floor(Math.random() * 16777215).toString(16), weight: 2, opacity: 1, color: 'black', dashArray: '3', fillOpacity: 0.1
                    };
                }
                ,
                onEachFeature: function (feature, layer) {
                    //map.fitBounds(layer.getBounds());
                    layer.bindPopup();
                }
                //,
                //filter: function (feature, layer) {
                //    if (feature.properties.HMISCode == $scope.temphierarchy[0].HMISCode)
                //        return true;
                //}
            }
        });

    }

    function getMaps() {
        var viewMaps = [];
        for (var i = 0, len = $scope.mapData.length; i < len; i++) {
            if ($scope.mapData[i].properties.HMISCode == $scope.temphierarchy[0].WoredaId ||
                $scope.mapData[i].properties.HMISCode == $scope.temphierarchy[0].ZoneId ||
                $scope.mapData[i].properties.HMISCode == $scope.temphierarchy[0].RegionId)
                    viewMaps.push($scope.mapData[i]);
        }
        
        angular.extend($scope, {
            geojson: {
                data: viewMaps
                ,
                style: function (feature) {
                    return {
                        fillColor: '#' + Math.floor(Math.random() * 16777215).toString(16), weight: 2, opacity: 1, color: 'black', dashArray: '3', fillOpacity: 0.1
                    };
                }
                ,
                onEachFeature: function (feature, layer) {
                    map.fitBounds(layer.getBounds());
                    layer.bindPopup();
                }
            //,
            //filter: function (feature, layer) {
            //    if (feature.properties.HMISCode == $scope.temphierarchy[0].HMISCode)
            //        return true;
            //}
            }
        });
    }

    function IndexOfObject() {
        for (var i = 0, len = $scope.mapData.length; i < len; i++) {
            if ($scope.mapData[i].properties.HMISCode === $scope.temphierarchy[0].HMISCode)
                return i;
        }
        return -1;
    }

    var init = function () {
            leafletData.getMap().then(function (_map) {
            L.control.scale().addTo(_map);
            map = _map;
            });
            
            //var promise = mapService.getEthiMap();
            //promise.then(function (respond) {
            //    showFacility();
            //    $scope.mapData = respond.features;
            //    getMaps();
            //});
    }
   
    function clean_map() {
        map.eachLayer(function (layer) {
            if (layer instanceof L.GeoJSON)
            {
                map.removeLayer(layer);
            }
            console.log(layer);
        });
    }



    init();

}]);