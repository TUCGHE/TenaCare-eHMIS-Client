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

app.service('mapService', function ($http, $q, HostConfigFactory) {

    var serverConfig = HostConfigFactory.getHostConfigServer();
    var clientConfig = HostConfigFactory.getHostConfigClient();

    var deferred = $q.defer();  
    $http.get(clientConfig + "web-app/data/EthiopiaRZW.json").success(function (data) {
        //6222
           deferred.resolve(data);
       });
       this.getEthiMap = function () {
           return deferred.promise;
       };
   
   this.getGeoZone = function (data, status) {
       $http.get(clientConfig + "web-app/data/Zone.json").then(data, status);
       //6222
   }
   this.getGeoWoreda = function (data, status) {
       $http.get(clientConfig + "web-app/data/Woreda.json").then(data, status);
       //6222
   }

   this.getAllFacilityGISLocation = function (data, status) {
       $http.get(serverConfig + "/api/vw_FacilityGIS").then(data, status);
   }

   this.getFacilityGISLocation = function (hmiscode,data, status) {
       $http.get(serverConfig + "/api/vw_FacilityGIS/?HMISCode=" + hmiscode).then(data, status);
   }

   this.getLocationAll = function (response, status) {
       $http.get(serverConfig + "/api/EthEhmis_AllFacilityWithID/Get/").then(response, status);
   }

   this.getLocationByRegion = function (hmiscode, response, status) {
       $http.get(serverConfig + "/api/EthEhmis_AllFacilityWithID/GetByRegion/?regionid=" + hmiscode).then(response, status);
   }
   this.getLocationByZone = function (hmiscode, response, status) {
       $http.get(serverConfig + "/api/EthEhmis_AllFacilityWithID/GetByZone/?zoneid=" + hmiscode).then(response, status);
   }
   this.getLocationByWoreda = function (hmiscode, response, status) {
       $http.get(serverConfig + "/api/EthEhmis_AllFacilityWithID/GetByWoreda/?woredaid=" + hmiscode).then(response, status);
   }


   this.getLocationByRegionByType = function (hmiscode,ftype, response, status) {
       $http.get(serverConfig + "/api/EthEhmis_AllFacilityWithID/GetByRegionByType/?regionid=" + hmiscode + "&ftype=" + ftype).then(response, status);
   }
   this.getLocationByZoneByType = function (hmiscode, ftype, response, status) {
       $http.get(serverConfig + "/api/EthEhmis_AllFacilityWithID/GetByZoneByType/?zoneid=" + hmiscode + "&ftype=" + ftype).then(response, status);
   }
   this.getLocationByWoredaByType = function (hmiscode, ftype, response, status) {
       $http.get(serverConfig + "/api/EthEhmis_AllFacilityWithID/GetByWoredaByType/?woredaid=" + hmiscode + "&ftype=" + ftype).then(response, status);
   }

   this.getLocationByWoredaByHF = function (hmiscode, response, status) {
       $http.get(serverConfig + "/api/EthEhmis_AllFacilityWithID/GetFacilitiesByWoreda/?woredaid=" + hmiscode).then(response, status);
   }

});