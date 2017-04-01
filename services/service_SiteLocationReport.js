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

app.factory('commonHierarchyService', function () {

    //hierarchy = { hierarchyList: { hierarchyData: {} } };
    hierarchy = {};
    temphierarchy = {};
            
        this.setCommonHierarchy = function (data) {
            //hierarchy.hierarchyList.hierarchyData = data;
            hierarchy = data;
        }

        this.getCommonHierarchy = function () {
            //return hierarchy.hierarchyList.hierarchyData;
            return hierarchy;
        }

        this.setTempHierarchy = function (data) {
            //hierarchy.hierarchyList.hierarchyData = data;
            temphierarchy = data;
        }

        this.getTempHierarchy = function () {
            //return hierarchy.hierarchyList.hierarchyData;
            return temphierarchy;
        }
       
        return this;
    });

app.factory('headFacilityFactory', function ($http, $q, HostConfigFactory) {

    var serverConfig = HostConfigFactory.getHostConfigServer();
    var clientConfig = HostConfigFactory.getHostConfigClient();

		this.getlist = function(){            
			return $http.get(serverConfig + "api/Location")
				.then(function(response) {
				  //console.log(response); //I get the correct items, all seems ok here
				  return response.data;
				});            
		}
		return this;
	});
	
app.factory('childrenFactory', function ($http, $q, HostConfigFactory) {

    var serverConfig = HostConfigFactory.getHostConfigServer();
    var clientConfig = HostConfigFactory.getHostConfigClient();

		this.getChildrenService = function(id){            
			return $http.get(serverConfig + "api/Location/?id=4" + "&locationid=" + id)
				.then(function(response) {
				  //console.log(response); //I get the correct items, all seems ok here
				  return response.data;
				});            
		}
		return this;
	});

app.factory('NoParentFacilityFactory', function ($http, $q, HostConfigFactory) {

    var serverConfig = HostConfigFactory.getHostConfigServer();
    var clientConfig = HostConfigFactory.getHostConfigClient();

	    this.getNoParentFacilityService = function (id) {
	        return $http.get(serverConfig + "api/Location/0")
				.then(function (response) {
				    //console.log(response); //I get the correct items, all seems ok here
				    return response.data;
				});
	    }
	    return this;
	});
	
app.factory('hierarchyFactory', function ($http, $q, HostConfigFactory) {

    var serverConfig = HostConfigFactory.getHostConfigServer();
    var clientConfig = HostConfigFactory.getHostConfigClient();

		this.getHierarchyService = function(id){            
			return $http.get(serverConfig + "api/Location/?id=2" + "&locationid=" + id )
				.then(function(response) {
				  //console.log(response); //I get the correct items, all seems ok here
				  return response.data;
				});            
		}

		this.getSearchedFacilitiesService = function (facilityName) {
		    return $http.get(serverConfig + "api/Location/?id=1&id2=1&facilityName=" + facilityName)
				.then(function (response) {
				    //console.log(response); //I get the correct items, all seems ok here
				    return response.data;
				});
		}
		return this;
	});
	
app.factory('siteSettingsFactory', function ($http, $q, HostConfigFactory) {

    var serverConfig = HostConfigFactory.getHostConfigServer();
    var clientConfig = HostConfigFactory.getHostConfigClient();

		this.getSiteSettingService = function(id){            
			return $http.get(serverConfig + "api/Location/?id=1" + "&locationid=" + id )
				.then(function(response) {
				  //console.log(response); //I get the correct items, all seems ok here
				  return response.data;
				});            
		}
		return this;
	});
	
app.factory('mainLocationSaveFactory', function ($http, $q, HostConfigFactory) {

    var serverConfig = HostConfigFactory.getHostConfigServer();
    var clientConfig = HostConfigFactory.getHostConfigClient();

		this.saveMainLocationIdService = function(id){   					
			return $http.get(serverConfig + "api/Location/?id=3" + "&locationid=" + id )
				.then(function(response) {
				  //console.log(response); //I get the correct items, all seems ok here				 
				  //alert("getSiteSetting called from saveMainLocationIdService!!");
				  return response.data;
				});            
		}
		return this;
	});
	
	app.factory('valuesFactory', function ($http, $q, HostConfigFactory) {

	    var serverConfig = HostConfigFactory.getHostConfigServer();
	    var clientConfig = HostConfigFactory.getHostConfigClient();

		this.getValuesService = function(id, locationId, year, month, reportType){   					
			return $http.get(serverConfig + "api/EhmisValues/?id=0" + "&locationId=" + locationId + "&year=" + year + "&month=" + month + "&reportType=" + reportType)
				.then(function(response) {
				  //console.log(response); //I get the correct items, all seems ok here				  				
				  return response.data;
				});            
		}
		return this;
	});
	
	app.factory('ipdDataEntryFactory', function ($http, $q, HostConfigFactory) {

	    var serverConfig = HostConfigFactory.getHostConfigServer();
	    var clientConfig = HostConfigFactory.getHostConfigClient();

		this.getIPDDictionaryService = function(){   					
			return $http.get(serverConfig + "api/EhmisValues/2")
				.then(function(response) {
				  //console.log(response); //I get the correct items, all seems ok here				  				
				  return response.data;
				});            
		}
		return this;
	});
	
	app.factory('ipdReportFactory', function ($http, $q, HostConfigFactory) {

	    var serverConfig = HostConfigFactory.getHostConfigServer();
	    var clientConfig = HostConfigFactory.getHostConfigClient();

		this.getIPDReportService = function(){   					
		    return $http.get(serverConfig + "api/OfficialReports/?id=0&id2=0")
				.then(function(response) {
				  //console.log(response); //I get the correct items, all seems ok here				  				
				  return response.data;
				});            
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