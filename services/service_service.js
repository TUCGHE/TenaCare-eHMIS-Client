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

app.service('servicedataentryService', function ($http, HostConfigFactory) {

    var serverConfig = HostConfigFactory.getHostConfigServer();
    var clientConfig = HostConfigFactory.getHostConfigClient();

    this.get = function (limit, type, periodType, successCallback, errorCallback) {
      
        $http({
            method: 'GET',
            url: serverConfig + 'api/EhmisValues/GetByFacilityType/?id=1&type=' + type + '&periodType=' + periodType 
        }).then(successCallback, errorCallback);
    }

    this.getQuarterOpdDisease = function (year, quarter, locationID, successCallback, errorCallback) {
        $http({
            method: 'GET',
            url: serverConfig + 'api/values/getQuarterOpdDisease/?year=' + year + '&quarter=' + quarter + '&LocationID=' + locationID
        }).then(successCallback, errorCallback);
    }

    this.getSiteSettingService = function (id) {
        return $http.get(serverConfig + "api/Location/?id=1" + "&locationid=" + id)
            .then(function (response) {
                console.log(response); //I get the correct items, all seems ok here
                return response.data;
            });
        return this;
    }

    this.getSiteName = function (id) {
        return $http.get(serverConfig + "api/OfficialReports/?id=" + id)
            .then(function (response) {
                console.log(response); //I get the correct items, all seems ok here
                return response.data;
            });
        return this;
    }
});