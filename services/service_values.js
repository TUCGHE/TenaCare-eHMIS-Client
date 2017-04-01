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

/*
* global angular app instance "app", defined in the app.js file
*/

// the ValueService is meant to allow us to fetch values from the NuEHMIS API
// write back to it, etc...
// instead of doing these data-related operations in the controllers...
// this allows us to decouple data-related logic from the controllers, whose role should be more
// concerned with using the data in rendering the views...
app.service('ValueService', function ($http, HostConfigFactory) {

    var serverConfig = HostConfigFactory.getHostConfigServer();
    var clientConfig = HostConfigFactory.getHostConfigClient();

    this.get = function (limit, successCallback, errorCallback) {
        $http({
            method: 'GET',
            url: serverConfig + 'api/values?limit=' + (limit || 10)
        }).then(successCallback, errorCallback);
    }

    this.save = function (data, successCallback, errorCallback) {
        $http({
            method: 'POST',
            url: serverConfig + 'api/values/',
            data: data
        }).then(successCallback, errorCallback);
    }

    this.updateData = function (data, successCallback, errorCallback) {
        $http({
            method: 'POST',
            url: serverConfig + 'api/values/save',
            data: data
        }).then(successCallback, errorCallback);
    }

    this.getHmisData = function (year, quarter, week, month, dataEleClass, locationID, successCallback, errorCallback) {

        $http({
            method: 'GET',
            url: serverConfig + 'api/values/getHmisData/?year=' + year + '&quarter=' + quarter + '&week='+ week + '&month='+ month + '&dataEleClass=' + dataEleClass + '&locationID=' + locationID
        }).then(successCallback, errorCallback);
    }

    this.getHmisDataByLevel = function (year, quarter, week, month, dataEleClass, id, level, successCallback, errorCallback) {

        $http({
            method: 'GET',
            url: serverConfig + 'api/values/getHmisDataByLevel/?year=' + year + '&quarter=' + quarter + '&week=' + week + '&month=' + month + '&dataEleClass=' + dataEleClass + '&id=' + id + '&level=' + level
        }).then(successCallback, errorCallback);
    }

    this.getHmisDataIPD = function (year, quarter, week, month, dataEleClassMorbidity, dataEleClassMortality, locationID, successCallback, errorCallback) {

        $http({
            method: 'GET',
            url: serverConfig + 'api/values/getHmisData/?year=' + year + '&quarter=' + quarter + '&week=' + week + '&month=' + month + '&dataEleClassMorbidity=' + dataEleClassMorbidity + '&dataEleClassMortality=' + dataEleClassMortality + '&locationID=' + locationID
        }).then(successCallback, errorCallback);
    }

    this.getHmisDataForValidation = function (year, quarter, week, month, dataEleClass,regionid, successCallback, errorCallback) {

        $http({
            method: 'GET',
            url: serverConfig + 'api/values/getHmisData/?year=' + year + '&quarter=' + quarter + '&week=' + week + '&month=' + month + '&dataEleClass=' + dataEleClass + '&regionid=' + regionid
        }).then(successCallback, errorCallback);
    }

    this.validate = function (data, successCallback) {
        $http({
            method: 'GET',
            url: clientConfig + 'web-app/data/ValidationRuleJSON.json',
            data: data
        }).then(successCallback);
    }
});
