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

app.factory('LanguageFactory', function ($http, $q, HostConfigFactory) {

    var serverConfig = HostConfigFactory.getHostConfigServer();
    var clientConfig = HostConfigFactory.getHostConfigClient();
        
    this.getLanguageLabelService = function (langName, className) {
        return $http.get(serverConfig + "api/Language/?langName=" + langName + "&className=" + className)
				.then(function (response) {
				    console.log(response); //I get the correct items, all seems ok here
				    return response.data;
				});
    } 

    this.setLanguageService = function (languageSet) {
        return $http.get(serverConfig + "api/Language/?languageSet=" + languageSet + "&id=" + 0)
				.then(function (response) {
				    console.log(response); //I get the correct items, all seems ok here
				    return response.data;
				});
    }

    //this.getLanguageService = function () {
    //    return $http.get(serverConfig + "api/Language/?languageSet=a&id=" + 1)
	//			.then(function (response) {
	//			    console.log(response); //I get the correct items, all seems ok here
	//			    return response.data;
	//			});
    //}
       
        return this;
});
	

	

