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

app.controller('homectrl', function ($scope, $timeout, LanguageFactory) {

    $scope.languageSet = {};
    var className = "home";    

    var lang = $scope.languageSet;

    $scope.getLanguageLabel = function (lang, className) {
        LanguageFactory.getLanguageLabelService(lang, className)
		.then(function (data) {
		    $scope.values = data;
		    
		    $scope.homeLanguages = {};
		    for (var i = 0; i < $scope.values.length; i++) {		        
		        $scope.homeLanguages[$scope.values[i].indexName] = $scope.values[i].LanguageName;
		    }
		})
    }

    lang = localStorage.getItem('languageSet', 'english');

    $scope.getLanguageLabel(lang, className);

    $scope.languageSet = lang;

    $scope.setLanguage = function ()
    {
        if ($scope.selectedLanguage == undefined)
        {
            alert($scope.homeLanguages['pleaseSelectALanguage'] + '!!');
        }
        else
        {
            //LanguageFactory.setLanguageService($scope.selectedLanguage);
            $scope.languageSet = $scope.selectedLanguage;
                       
            localStorage.setItem('languageSet', $scope.languageSet);
            location.reload();
        }        
    }

    //$scope.getLanguage = function () {
    //    LanguageFactory.getLanguageService()
	//	.then(function (data) {
	//	    $scope.languageSet = data;
	//	})
    //}

    //$scope.getLanguage();
})

   