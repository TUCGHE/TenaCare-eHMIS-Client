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
app.controller('monthlyipddiseaseController', function ($scope, myService, ValueService, LanguageFactory) {

    $scope.title = {};
    $scope.status = {};
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

		    $scope.title = $scope.dataEntry['monthlyIpdDisease'];
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
    $scope.getChangedValue = function (year, month, value, lbid, LocationId, facilityTypeId, zone, region, woreda, dataEleClass) {
        var monthIdex = getMonthIndex(month);
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
            var changedValueObj = {
                "LabelID": lbid,
                "DataEleClass": dataEleClass,
                "FederalID": 0,
                "RegionID": region,
                "ZoneID": zone,
                "WoredaID": woreda,
                "LocationID": LocationId,
                "Week": 0,
                "Month": monthIdex,
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
            //    if (facilityTypeId == 2 || facilityTypeId == 1) {
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
            //                chagedData = $scope.ChangedValue;
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

    var getValidationByLabelID = function arrayObjectIndexOf(myArray, searchTerm, property, fName) {
        var validations = [];
        if (searchTerm != null) {
            for (var i = 0, len = myArray.length; i < len; i++) {
                if (myArray[i][property] === searchTerm.toString() && myArray[i][fName] === 1 && myArray[i]["dataEleClass"] === 3)
                    validations.push(myArray[i]);
            }
            return validations;
        }
        return -1;
    }

    var getQuarterMonth = function (quarter,year) {
        if (quarter == 1) {
            
            return { "year":year, "month":1 };
        }
        else if (quarter == 2) {
            return { "year": year, "month": 4 };
        }
        else if (quarter == 3) {
            return { "year": year, "month": 7 };
        }
        else if (quarter == 4) {
            return { "year": year, "month": 10 };
        }

    }
    var getQuarterFromMonth = function (month, year) {
        if (month <= 1 || month >= 11) {
            return { "year": year + 1, "quarter": 1 };
        }
        else if (month >= 2 || month <= 4) {
            return { "year": year, "quarter": 2 };
        }
        else if (month >= 5 || month <= 7) {
            return { "year": year, "quarter": 3 };
        }
        else if (month >= 8 || month <= 10) {
            return { "year": year, "quarter": 4 };
        }
    }

    var getMonthName = function (month) {
        var monthName = "";

        if (month == 1) {
            monthName = $scope.dataEntry['meskerem'];
        }
        else if (month == 2) {
            monthName = $scope.dataEntry['tikimt'];
        }
        else if (month == 3) {
            monthName = $scope.dataEntry['hidar'];
        }
        else if (month == 4) {
            monthName = $scope.dataEntry['tahisas'];
        }
        else if (month == 5) {
            monthName = $scope.dataEntry['tir'];
        }
        else if (month == 6) {
            monthName = $scope.dataEntry['yekatit'];
        }
        else if (month == 7) {
            monthName = $scope.dataEntry['megabit'];
        }
        else if (month == 8) {
            monthName = $scope.dataEntry['miyazia'];
        }
        else if (month == 9) {
            monthName = $scope.dataEntry['ginbot'];
        }
        else if (month == 10) {
            monthName = $scope.dataEntry['sene'];
        }
        else if (month == 11) {
            monthName = $scope.dataEntry['hamle'];
        }
        else if (month == 12) {
            monthName = $scope.dataEntry['nehase'];
        }
        return monthName;
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
    $scope.saveClicked = function () {
        ValueService.updateData(chagedData, function (response) {

            var val = response.data;
            chagedData = [];
            //alert(val);
            alert($scope.dataEntry['dataUpdatedSuccessfully']);
        });
    }
  
    $scope.indexOfVal = function arrayObjectIndexOf(myArray, searchTerm, property) {
        alert(myArray + ' ' + searchTerm +' '+ property);
    }

    $scope.getMIPDIndex = function arrayObjectIndexOf(myArray, searchTerm, property, dataEleClass) {
        //console.log(myArray + ' ' + searchTerm + ' ' + property);
        if (searchTerm != null){
        for (var i = 0, len = myArray.length; i < len; i++) {
            if (myArray[i][property] === searchTerm && myArray[i]['DataEleClass'] === dataEleClass) return i;
        }
        }
        return -1;
    }  

    //-----For Opd Official REPORT-----//

    $scope.quarterOptions = [{ name: "1", value: 1 }, { name: "2", value: 2 }, { name: "3", value: 3 }, { name: "4", value: 4 }];
   // $scope.selectedQuarter = $scope.quarterOptions[1];

    $scope.getLocationName = function () {
        quarteropddiseaseService.getSiteName($scope.LocationId)
        .then(function (data) {
            $scope.setLocationName = data[0];
            $scope.LocationName = $scope.setLocationName.FacilityName;
            $scope.FacilityTypeId = $scope.setLocationName.FacilityTypeId;

        });
    }

    $scope.getOpdReport = function (id, selectedQuarter, selectedyear) {
        $scope.getLocationName();
        quarteropddiseaseService.getOPDReportService(id, $scope.FacilityTypeId, selectedQuarter, selectedyear, $scope.LocationId)
        .then(function (data) {
            console.log(data);
            $scope.opdReportdata = data;
        });
    }

    $scope.loadData = function (locationId) {
        var monthIndex = getMonthIndex($scope.selectedMonth);
        ValueService.getHmisDataIPD($scope.selectedYear, 0, 0, monthIndex, 2, 3, temphierarchy[0].HMISCode, function (response) {
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

        //$scope.selectedYear = parseInt(ethioyear);
        //$scope.selectedMonth = getMonthName(ethiomonth);
    }

    $scope.$watch('temphierarchy[0].FacilityTypeId', function (newValue, oldValue) {
        if (newValue != undefined) {
            fetch(newValue);
        }
    });

    var fetch = function (facilityType) {       
        myService.getIPDDictionary(function (response) {
            $scope.ipdDictionarydata = response.data; // update the scope ref, which will update the grid automatically
            $scope.status_class = $scope.dataEntry['info'];
            $scope.status = "";
        }, function (error) {
            //$scope.data = response.data; // update the scope ref, which will update the grid automatically
            $scope.status_class = $scope.dataEntry['danger'];
            $scope.status = $scope.dataEntry['failedToLoadValues']; 
        });
    }
    $scope.$watch('status', function (newValue, oldValue) {
        if (newValue != $scope.dataEntry['loading']) {
            $scope.loadData($scope.LocationId);
        }
    });

});