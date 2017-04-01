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

'use strict';
app.controller('quarterhpopddiseaseController', function ($scope, quarterhpopddiseaseService, ValueService, LanguageFactory) {
    
    $scope.title = {};
    $scope.status = {};
    $scope.status_class = {};
    $scope.dataEntry = {};
    $scope.selectedyear = "";

    var className = "dataEntry";

    var lang = $scope.languageSet;

    $scope.getLanguageLabel = function (lang, className) {
        LanguageFactory.getLanguageLabelService(lang, className)
		.then(function (data) {
		    $scope.values = data;

		    for (var i = 0; i < $scope.values.length; i++) {
		        $scope.dataEntry[$scope.values[i].indexName] = $scope.values[i].LanguageName;
		    }

		    $scope.title = $scope.dataEntry['quarterHpOpdDisease'];
		    $scope.status = $scope.dataEntry['loading'];
		    $scope.status_class = $scope.dataEntry['info'];		   

		})
    }

    lang = localStorage.getItem('languageSet', 'english');

    $scope.getLanguageLabel(lang, className);

   
    $scope.data = [];// initially... later, the data can change any way...
    // then we shall feth the values data...
    this.fetch = function (limit) {
        //obtain values via the values service...
        quarterhpopddiseaseService.get(limit, function (response) {
            $scope.data = response.data; // update the scope ref, which will update the grid automatically
            $scope.status_class = $scope.dataEntry['info'];
            $scope.status = $scope.dataEntry['valuesHaveBeenLoaded'];
        }, function (error) {
            //$scope.data = response.data; // update the scope ref, which will update the grid automatically
            $scope.status_class = $scope.dataEntry['danger']; 
            $scope.status = $scope.dataEntry['failedToLoadValues'];
        });
    }
    $scope.ChangedValue = [];
    var chagedData = [];
    $scope.getChangedValue = function (year, quarter, value, lbid) {
        
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1; //January is 0!
        var yyyy = today.getFullYear();

        if (dd < 10) {
            dd = '0' + dd
        }

        if (mm < 10) {
            mm = '0' + mm
        }

        today = mm + '/' + dd + '/' + yyyy;

        $scope.ChangedValue.push({ "LabelID": lbid, "DataEleClass": 8, "FederalID": 0, "RegionID": 14, "ZoneID": 0, "WoredaID": 14108, "LocationID": "141080021", "Week": 0, "Month": 0, "Quarter": quarter, "Year": year, "Value": value, "Level": 0, "FACILITTYPE": 2, "DateEntered": today, "Editable": true });
        chagedData = $scope.ChangedValue;
    }
    $scope.saveClicked = function () {
        ValueService.updateData(chagedData, function (response) {
            var val = response.data;            
            //alert(JSON.stringify(response));
        });
    }

    $scope.onYearSelect = function() {
        quarterhpopddiseaseService.getQuarterOpdDisease($scope.selectedYear, $scope.selectedQuarter, '141080021', function (response) {
            $scope.loadedData = response.data;
            this.fetch(10);
        });
    }
    $scope.onQuarterSelect = function () {
        quarterhpopddiseaseService.getQuarterOpdDisease($scope.selectedYear, $scope.selectedQuarter, '141080021', function (response) {
            $scope.loadedData = response.data;
            this.fetch(10);
        });

    }
    $scope.indexOfVal = function arrayObjectIndexOf(myArray, searchTerm, property) {
        alert(myArray + ' ' + searchTerm +' '+ property);
    }

    $scope.getQOPDIndex = function arrayObjectIndexOf(myArray, searchTerm, property) {
        //console.log(myArray + ' ' + searchTerm + ' ' + property);
        if (searchTerm != null){
        for (var i = 0, len = myArray.length; i < len; i++) {
            if (myArray[i][property] === searchTerm) return i;
        }
        }
        return -1;
    }
    $scope.init = function () {
        quarterhpopddiseaseService.getQuarterOpdDisease('2006', '1', '141080021', function (response) {
            $scope.loadedData = response.data;
            this.fetch(10);
        });
    }
    //just to instantiate things...
    this.fetch(10);
    
});