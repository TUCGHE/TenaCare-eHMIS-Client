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
app.controller('servicedataentryQuarterController', function ($scope, servicedataentryService, ValueService, LanguageFactory) {    

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

		    $scope.title = $scope.dataEntry['quarterlyServiceDataEntry'];
		    $scope.status = $scope.dataEntry['loading'];
		    $scope.status_class = $scope.dataEntry['info'];

		    $scope.init = function () {
		        initCurrentDate();
		        $scope.loadData($scope.LocationId);
		    }

		})
    }

    lang = localStorage.getItem('languageSet', 'english');

    $scope.getLanguageLabel(lang, className);

   
    $scope.data = [];// initially... later, the data can change any way...
    
    $scope.ChangedValue = [];
    var chagedData = [];
    $scope.getChangedValue = function (year, quarter, value, lbid, LocationId, facilityTypeId, zone, region, woreda) {
        //var monthIdex = getMonthIndex(month);
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1; //January is 0!
        var yyyy = today.getFullYear();

        if (value != undefined) {

            if (dd < 10) {
                dd = '0' + dd
            }

            if (mm < 10) {
                mm = '0' + mm
            }
            today = mm + '/' + dd + '/' + yyyy;

            var quartertomonth = getQuarterMonth(quarter);

            var changedValueObj = {
                "LabelID": lbid,
                "DataEleClass": 6,
                "FederalID": 0,
                "RegionID": region,
                "ZoneID": zone,
                "WoredaID": woreda,
                "LocationID": LocationId,
                "Week": 0,
                "Month": quartertomonth.month,
                "Quarter": 0,
                "Year": year,
                "Value": value,
                "Level": 0,
                "FACILITTYPE": facilityTypeId,
                "DateEntered": today,
                "Editable": true
            };

            $scope.ChangedValue.push(changedValueObj);
            chagedData = $scope.ChangedValue;
            
            //var validateMessage = {};
            //ValueService.validate(changedValueObj, function (response) {
               
            //    var fName = "";
            //    if (facilityTypeId == 1) {
            //        fName = "HC";
            //    }
            //   else if (facilityTypeId == 2) {
            //        fName = "HC";
            //    }
            //    else if (facilityTypeId == 3) {
            //        fName = "HP";
            //    }
            //    else {
            //        fName = "HP"
            //    }

            //    var validateMessages = getValidationByLabelID(response.data, lbid, 'labelId', fName);
            //    if (validateMessages.length == 0) {
            //        $scope.ChangedValue.push(changedValueObj);
            //        chagedData = $scope.ChangedValue;
            //    }
            //    eval("document.getElementById('" + lbid + "_labelWarning').innerText= '';");
            //    eval("document.getElementById('" + lbid + "_labelError').innerText= '';");

            //    for (var i = 0; i < validateMessages.length; i++) {
            //        var strTest = validateMessages[i]["sumRule"];
            //        var strArray = [];

            //        if (strTest.indexOf("==") !== -1) {
            //            strArray = strTest.split("==");
            //        }
            //        else if (strTest.indexOf("<=") !== -1) {
            //            strArray = strTest.split("<=");
            //        }
            //        else if (strTest.indexOf(">=") !== -1) {
            //            strArray = strTest.split(">=");
            //        }

            //        var left = strArray[0];
            //        var right = strArray[1];

            //        var leftVal = eval(left);
            //        var rightVal = eval(right);

            //        if (!eval(validateMessages[i]["sumRule"]) && (!isNaN(eval(left)) && !isNaN(eval(right)))) {

            //            if (validateMessages[i]["RuleType"] == "Warning") {
            //                $scope.ChangedValue.push(changedValueObj);
            //                //chagedData = $scope.ChangedValue;
            //                eval("document.getElementById('" + lbid + "_labelWarning').innerText= '" + validateMessages[i]["message"] + "';");
            //                //alert(validateMessages[i]["message"], "Warning");
            //            }
            //            else if (validateMessages[i]["RuleType"] == "NotWarning") {
            //                eval("document.getElementById('" + lbid + "').focus();")
            //                eval("document.getElementById('" + lbid + "_labelError').innerText= '" + validateMessages[i]["message"] + "';");
            //                //alert(validateMessages[i]["message"], "Error");
            //                //break;
            //            }
            //        }
            //        else {
            //            $scope.ChangedValue.push(changedValueObj);
            //            chagedData = $scope.ChangedValue;
            //        }

            //    }
               
                
            //});
        }
    }

    var getValidationByLabelID = function arrayObjectIndexOf(myArray, searchTerm, property,fName) {
        var validations= [];
        if (searchTerm != null) {
            for (var i = 0, len = myArray.length; i < len; i++) {
                if (myArray[i][property] === searchTerm.toString() && myArray[i][fName] === 1 && myArray[i]["dataEleClass"] === 6)
                    validations.push(myArray[i]);
            }
            return validations;
        }
        return -1;
    }

    $scope.saveClicked = function () {
        ValueService.updateData(chagedData, function (response) {
            var val = response.data;
            chagedData = [];
            //alert(val);
            alert($scope.dataEntry['dataUpdatedSuccessfully']);
        });
    }
   
    var getQuarterFromMonth = function (month, year) {
        if (month < 1 || month >= 11) {
            return { "year":year+1, "quarter": 1 };
        }
        else if (month == 1 ) {
            return { "year": year, "quarter": 1};
        }
        else if (month >= 2 || month <= 4) {
            return { "year": year, "quarter": 2 };
        }
        else if (month >= 5 || month <= 7) {
            return { "year": year, "quarter": 3 };
        }
        else if (month >= 8 || month <=10) {
            return { "year": year, "quarter": 4 };
        }
    }
    
    var getQuarterMonth = function (quarter) {
        if (quarter == 1) {

            return { "month": 1 };
        }
        else if (quarter == 2) {
            return { "month": 4 };
        }
        else if (quarter == 3) {
            return { "month": 7 };
        }
        else if (quarter == 4) {
            return { "month": 10 };
        }
    }

    var getMonthIndex = function (month) {
        var monthIndex = 0;

        if (month == $scope.dataEntry['meskerem']) {
            monthIndex = 1;
        }
        else if (month == $scope.dataEntry['tikimt']) {
            monthIndex = 2;
        }
        else if (month == $scope.dataEntry['hidar']) {
            monthIndex = 3;
        }
        else if (month == $scope.dataEntry['tahisas']) {
            monthIndex = 4;
        }
        else if (month == $scope.dataEntry['tir']) {
            monthIndex = 5;
        }
        else if (month == $scope.dataEntry['yekatit']) {
            monthIndex = 6;
        }
        else if (month == $scope.dataEntry['megabit']) {
            monthIndex = 7;
        }
        else if (month == $scope.dataEntry['miyazia']) {
            monthIndex = 8;
        }
        else if (month == $scope.dataEntry['ginbot']) {
            monthIndex = 9;
        }
        else if (month == $scope.dataEntry['sene']) {
            monthIndex = 10;
        }
        else if (month == $scope.dataEntry['hamle']) {
            monthIndex = 11;
        }
        else if (month == $scope.dataEntry['nehase']) {
            monthIndex = 12;
        }
        return monthIndex;
    }

    $scope.getIndex = function arrayObjectIndexOf(myArray, searchTerm, property) {
        //console.log(myArray + ' ' + searchTerm + ' ' + property);
        if (searchTerm != null){
        for (var i = 0, len = myArray.length; i < len; i++) {
            if (myArray[i][property] === searchTerm) return i;
        }
        }
        return -1;
    }

    $scope.loadData = function (locationId) {
        var quartertomonth = getQuarterMonth($scope.selectedQuarter);
        ValueService.getHmisData($scope.selectedYear, 0, 0, quartertomonth.month, 6, temphierarchy[0].HMISCode, function (response) {
            fetch($scope.temphierarchy[0].FacilityTypeId);
            $scope.loadedData = response.data;            
        });
    } 

    var initCurrentDate = function () {
        Date.prototype.getJulian = function () {
            return Math.floor((this / 86400000) - (this.getTimezoneOffset() / 1440) + 2440587.5);
        }

        var now = new Date();

        var dd = now.getDate();
        var mm = now.getMonth()
        var yyyy = now.getFullYear();

        var today = new Date(yyyy, mm, dd); //set any date
        var julian = today.getJulian(); //get Julian counterpart 

        var ec = $.calendars.instance('ethiopian').fromJD(julian);
        var ethioyear = ec.year();
        var ethiomonth = ec.month();
        var quarter = getQuarterFromMonth(ethiomonth, ethioyear);
        $scope.selectedYear = quarter.year;
        $scope.selectedQuarter = quarter.quarter.toString();
    }
    $scope.$watch('hierarchy[0].FacilityTypeId', function (newValue, oldValue) {
        if (newValue != undefined) {
            fetch(newValue);
            $scope.loadData($scope.LocationId);
        }
    });
    
    var fetch = function (facilityType) {

        var FacilityType = "";

        if (facilityType == 1) {
            FacilityType = "Hospital";
        }
        else if (facilityType == 2) {
            FacilityType = "HC";
        }
        else if (facilityType == 3) {
            FacilityType = "HP";
        }
        else if (facilityType == 4) {
            FacilityType = "HC";
        }
        else if (facilityType == 5) {
            FacilityType = "Hospital";
        }
        else if (facilityType == 6) {
            FacilityType = "HC";
        }
        else if (facilityType == 7) {
            FacilityType = "Hospital";
        }
        else if (facilityType == 8) {
            FacilityType = "WHO";
        }
        else if (facilityType == 9) {
            FacilityType = "ZHD";
        }
        else if (facilityType == 10) {
            FacilityType = "RHB";
        }
        else if (facilityType == 11) {
            FacilityType = "FMOH";
        }
        var limit = 0;
        servicedataentryService.get(limit, FacilityType, 1, function (response) {
            $scope.data = response.data; // update the scope ref, which will update the grid automatically
            $scope.status_class = $scope.dataEntry['info']; 
            $scope.status = "";
        }, function (error) {
            //$scope.data = response.data; // update the scope ref, which will update the grid automatically
            $scope.status_class = $scope.dataEntry['danger'];
            $scope.status = $scope.dataEntry['failedToLoadValues'];
        });
        //$scope.loadData($scope.LocationId);
    }
    $scope.$watch('status', function (newValue, oldValue) {
        if (newValue != $scope.dataEntry['loading']) {
            $scope.loadData($scope.LocationId);
        }
    });
});