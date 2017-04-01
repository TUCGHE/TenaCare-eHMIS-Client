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

app.factory('AnalyticsFactory', function ($http, $q, HostConfigFactory) {

    var serverConfig = HostConfigFactory.getHostConfigServer();
    var clientConfig = HostConfigFactory.getHostConfigClient();
           
    this.getCategoryService = function (id1, id2, category, serviceElementType) {
        return $http.get(serverConfig + "api/Analytics/?id1=" + id1 + "&id2=" + id2 + "&category=" + category + "&serviceElementType=" + serviceElementType)
				.then(function (response) {
				    console.log(response); //I get the correct items, all seems ok here
				    return response.data;
				});
        }

        this.getDataElementsService = function (parameters) {
            return $http({
                method: 'POST',
                url: serverConfig + 'api/Analytics',
                data: parameters
            })
                .then(function (response) {
                    console.log(response); //I get the correct items, all seems ok here				  				
                    return response.data;
                });
        }

        this.getDiseaseListService = function () {
            return $http.get(serverConfig + "api/Analytics/?id=0")
				.then(function (response) {
				    console.log(response); //I get the correct items, all seems ok here
				    return response.data;
				});
        }

        this.getFacilityTypeService = function () {
            return $http.get(serverConfig + "api/Analytics/?id=2")
				.then(function (response) {
				    console.log(response); //I get the correct items, all seems ok here
				    return response.data;
				});
        }

        this.getFileNamesService = function () {
            return $http.get(serverConfig + "api/Analytics/?id=1")
				.then(function (response) {
				    console.log(response); //I get the correct items, all seems ok here
				    return response.data;
				});
        }

        this.getDashBoardsService = function () {
            return $http.get(serverConfig + "api/Analytics/?id=3")
				.then(function (response) {
				    console.log(response); //I get the correct items, all seems ok here
				    return response.data;
				});
        }

        this.getReportServicePost = function (parameters) {
            return $http({
                method: 'POST',
                url: serverConfig + 'api/Analytics/Reports',
                data: parameters
            })
                .then(function (response) {
                    console.log(response); //I get the correct items, all seems ok here				  				
                    return response.data;
                });
        }

        this.getExportFileService = function (parameters) {
            return $http({
                method: 'POST',
                url: serverConfig + 'api/Analytics/Export',
                responseType: 'arraybuffer',
                data: parameters
            })
                .then(function (response) {
                    console.log(response); //I get the correct items, all seems ok here				  				
                    return response;
                });
        }

        this.saveDashBoardService = function (parameters) {
            return $http({
                method: 'POST',
                url: serverConfig + 'api/Analytics/DashBoards/Save',
                data: parameters
            })
                .then(function (response) {
                    console.log(response); //I get the correct items, all seems ok here				  				
                    return response.data;
                });
        }
       
        return this;
});

app.factory('AnalyticsFilterFactory', function () {

    filteredCustomData = {};    

    this.setfilteredCustomData = function (data) {
        //hierarchy.hierarchyList.hierarchyData = data;
        filteredCustomData = data;
    }

    this.getfilteredCustomData = function () {
        //return hierarchy.hierarchyList.hierarchyData;
        return filteredCustomData;
    }

    return this;
});
	

app.factory('customReportFactory', function ($http, $q, HostConfigFactory) {

    var serverConfig = HostConfigFactory.getHostConfigServer();
    var clientConfig = HostConfigFactory.getHostConfigClient();

	    this.getCustomReportService = function (parameters) {
	        return $http({
	                    method: 'POST',
	                    url: serverConfig + 'api/OfficialReports',
	                    data: parameters
	                })
                .then(function (response) {
				    //console.log(response); //I get the correct items, all seems ok here				  				
				    return response.data;
				});
	    }
	    return this;
	});

