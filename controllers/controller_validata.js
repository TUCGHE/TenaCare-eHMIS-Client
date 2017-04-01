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

app.controller('validateController', ['$scope', '$timeout', 'ValueService', 'mapService', function ($scope, $timeout, ValueService, mapService) {
    var changedValueObj = {};
   
    $scope.showValidation = false;

    $scope.checkAll = function () {
        if ($scope.selectedAll) {
            $scope.selectedAll = true;
        } else {
            $scope.selectedAll = false;
        }
        angular.forEach($scope.locations, function (location) {
            location.Selected = $scope.selectedAll;
        });

    };

    var getLocationsByLevel = function () {
        $scope.status = "Getting facilities. wait ...";

        mapService.getLocationByRegion($scope.sltRegion, function (response) {
              $scope.locations = response.data;                
         });
    

        //if ($scope.levelSelect == "1") {
        //    mapService.getLocationAll(function (response) {
        //        $scope.locations = response.data;

        //    });
        //}
        //else if ($scope.levelSelect == "2") {
        //    mapService.getLocationByRegion($scope.sltRegion, function (response) {
        //        $scope.locations = response.data;
                
        //    });
        //}
        //else if ($scope.levelSelect == "3") {
        //    mapService.getLocationByZone($scope.sltZone, function (response) {
        //        $scope.locations = response.data;
                
        //    });
        //}
        //else if ($scope.levelSelect == "4") {
        //    mapService.getLocationByWoreda($scope.sltWoreda, function (response) {
        //        $scope.locations = response.data;
                
        //    });
        //}
    }

    $scope.fillZone = function (regionid) {
        if (regionid != undefined) {
            mapService.getLocationByRegionByType(regionid, 9, function (response) {
                $scope.zones = response.data;

            });
        }
    }

    $scope.fillWoreda = function (zoneid) {
        if (zoneid != undefined) {            
                mapService.getLocationByZoneByType(zoneid, 8, function (response) {
                    $scope.Woredas = response.data;
                });            
        }       
    }

    $scope.fillfacilities = function (woredaid) {
        if (woredaid != undefined) {
            mapService.getLocationByWoredaByHF(woredaid, function (response) {
                $scope.facilities = response.data;
            });
        }
    }

    $scope.init = function(){
        var today = new Date(); //set any date
        var julian = today.getJulian(); //get Julian counterpart 

        var ec = $.calendars.instance('ethiopian').fromJD(julian);
        var ethioyear = ec.year();
        var ethiomonth = ec.month();

        $scope.validationYear = ethioyear;
        $scope.validationMonth = ethiomonth;
        $scope.dataElementType = 1;
        
        $scope.bag = [{
            label: 'Glasses',
            value: 'glasses',
            children: [{
                label: 'Top Hat',
                value: 'top_hat'
            }, {
                label: 'Curly Mustache',
                value: 'mustachio'
            }]
        }];
    }
    
    $scope.$watch('temphierarchy[0].HMISCode', function (newValue, oldValue) {
        if (newValue != undefined ) {
            
            ValueService.validate(changedValueObj, function (response) {
               
                $scope.validateRule = response.data;
            });

        }
    });

    var getValidationByLabelID = function arrayObjectIndexOf(myArray, searchTerm, property, fName) {
        var validations = [];
        if (searchTerm != null) {
            for (var i = 0, len = myArray.length; i < len; i++) {
                if (myArray[i][property] == searchTerm.toString() && myArray[i][fName] == 1 && myArray[i]["dataEleClass"] == $scope.dataElementType)
                    validations.push(myArray[i]);
            }
            return validations;
        }
        return -1;
    }
   
   

    $scope.$watch('status', function (newValue, oldValue) {
        if (newValue != undefined && newValue == "Data element values are loaded for valiation. wait ...") {
            //$scope.locations.forEach(function (currentHMIScode, index, arr) {

                $scope.status = "Validation started. wait ...";

                var errorCount = 0;
                var warningCount = 0;

                if ($scope.validateData.length == 0) {
                    $scope.status = "There is no data.";
                    return;
                }
                    
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

                $scope.validateData.forEach(function (currentValue, index, arr) {
                    changedValueObj = {
                        "LabelID": currentValue.LabelID,
                        "DataEleClass": $scope.dataElementType,
                        "FederalID": 0,
                        //"RegionID": currentHMIScode.RegionId,
                        //"ZoneID": currentHMIScode.ZoneId,
                        //"WoredaID": currentHMIScode.WoredaId,
                        //"LocationID": currentHMIScode.HMISCode,
                        "Week": 0,
                        "Month": $scope.validationMonth,
                        "Quarter": 0,
                        "Year": $scope.validationYear,
                        "Value": currentValue.value,
                        "Level": 0,
                        //"FACILITTYPE": currentHMIScode.FacilityTypeId,
                        "DateEntered": today,
                        "Editable": true
                    };
                    var validateMessage = {};
                    var fName = "";
                    if ($scope.validationFacilityType == 2 || $scope.validationFacilityType == 1) {
                        fName = "HC";
                    }
                    else if ($scope.validationFacilityType == 3) {
                        fName = "HP";
                    }
                    else {
                        fName = "HC"
                    }
                   
                    if (temphierarchy[0].FacilityTypeName == 'Federal Ministry of Health') {
                        if (document.getElementsByClassName(changedValueObj.LabelID + '_' + $scope.sltRegion + '_' + $scope.dataElementType + '_' + $scope.validationYear + '_' + $scope.validationMonth).length > 0) {

                            if (document.getElementsByClassName(changedValueObj.LabelID + '_' + $scope.sltRegion + '_' + $scope.dataElementType + '_' + $scope.validationYear + '_' + $scope.validationMonth)[0].attributes.tag.nodeValue == changedValueObj.LabelID + '_' + $scope.sltRegion + '_' + $scope.dataElementType + '_' + $scope.validationYear + '_' + $scope.validationMonth) {

                                var validateMessages = getValidationByLabelID($scope.validateRule, changedValueObj.LabelID, 'labelId', fName);

                                for (var j = 0; j < validateMessages.length; j++) {

                                    var strTest = validateMessages[j]["sumRule"];
                                    var strArray = [];

                                    if (strTest != null) {

                                        if (strTest.indexOf("==") !== -1) {
                                            strArray = strTest.split("==");
                                        }
                                        else if (strTest.indexOf("<=") !== -1) {
                                            strArray = strTest.split("<=");
                                        }
                                        else if (strTest.indexOf(">=") !== -1) {
                                            strArray = strTest.split(">=");
                                        }
                                    }
                                    var left = strArray[0];
                                    var right = strArray[1];

                                    var leftVal;
                                    var rightVal;

                                    try {
                                        leftVal = eval(left);
                                    } catch (e) {
                                        //$scope.status = $scope.status + "\n" + left;
                                    }

                                    try {
                                        rightVal = eval(right);
                                    } catch (e) {
                                        //$scope.status = $scope.status + "\n" + right;
                                    }


                                    var validateMessage = {};

                                    if (leftVal != null && rightVal != null) {
                                        try {
                                            if (!eval(validateMessages[j]["sumRule"]) && (!isNaN(eval(left)) && !isNaN(eval(right)))) {

                                                if (validateMessages[j]["RuleType"] == "Warning") {
                                                    warningCount++;
                                                    validateMessage =
                                                        {
                                                            //woreda: currentHMIScode.WoredaName,
                                                            //zone: currentHMIScode.ZONENAME,
                                                            //region: currentHMIScode.ReportingRegionName,
                                                            //facilityName: currentHMIScode.FacilityName,
                                                            message: validateMessages[j]["message"],
                                                            messageType: "Warning"
                                                        }
                                                    $scope.errors.push(validateMessage);

                                                }
                                                else if (validateMessages[j]["RuleType"] == "NotWarning") {
                                                    errorCount++;
                                                    validateMessage =
                                                       {
                                                           //woreda: currentHMIScode.WoredaName,
                                                           //zone: currentHMIScode.ZONENAME,
                                                           //region: currentHMIScode.ReportingRegionName,
                                                           //facilityName: currentHMIScode.FacilityName,
                                                           message: 'Error: ' + validateMessages[j]["message"],
                                                           messageType: "Error"
                                                       }
                                                    $scope.errors.push(validateMessage);

                                                }
                                            }
                                        } catch (e) {

                                        }


                                    }

                                }
                            }
                        }
                    }
                    else if (temphierarchy[0].FacilityTypeName == 'Regional Health Bureau' && temphierarchy[0].RegionId != 14 && temphierarchy[0].RegionId != 15) {
                        if (document.getElementsByClassName(changedValueObj.LabelID + '_' + $scope.sltZone + '_' + $scope.dataElementType + '_' + $scope.validationYear + '_' + $scope.validationMonth).length > 0) {

                            if (document.getElementsByClassName(changedValueObj.LabelID + '_' + $scope.sltZone + '_' + $scope.dataElementType + '_' + $scope.validationYear + '_' + $scope.validationMonth)[0].attributes.tag.nodeValue == changedValueObj.LabelID + '_' + $scope.sltZone + '_' + $scope.dataElementType + '_' + $scope.validationYear + '_' + $scope.validationMonth) {

                                var validateMessages = getValidationByLabelID($scope.validateRule, changedValueObj.LabelID, 'labelId', fName);

                                for (var j = 0; j < validateMessages.length; j++) {

                                    var strTest = validateMessages[j]["sumRule"];
                                    var strArray = [];

                                    if (strTest != null) {

                                        if (strTest.indexOf("==") !== -1) {
                                            strArray = strTest.split("==");
                                        }
                                        else if (strTest.indexOf("<=") !== -1) {
                                            strArray = strTest.split("<=");
                                        }
                                        else if (strTest.indexOf(">=") !== -1) {
                                            strArray = strTest.split(">=");
                                        }
                                    }
                                    var left = strArray[0];
                                    var right = strArray[1];

                                    var leftVal;
                                    var rightVal;

                                    try {
                                        leftVal = eval(left);
                                    } catch (e) {
                                        //$scope.status = $scope.status + "\n" + left;
                                    }

                                    try {
                                        rightVal = eval(right);
                                    } catch (e) {
                                        //$scope.status = $scope.status + "\n" + right;
                                    }


                                    var validateMessage = {};

                                    if (leftVal != null && rightVal != null) {
                                        try {
                                            if (!eval(validateMessages[j]["sumRule"]) && (!isNaN(eval(left)) && !isNaN(eval(right)))) {

                                                if (validateMessages[j]["RuleType"] == "Warning") {
                                                    warningCount++;
                                                    validateMessage =
                                                        {
                                                            //woreda: currentHMIScode.WoredaName,
                                                            //zone: currentHMIScode.ZONENAME,
                                                            //region: currentHMIScode.ReportingRegionName,
                                                            //facilityName: currentHMIScode.FacilityName,
                                                            message: validateMessages[j]["message"],
                                                            messageType: "Warning"
                                                        }
                                                    $scope.errors.push(validateMessage);

                                                }
                                                else if (validateMessages[j]["RuleType"] == "NotWarning") {
                                                    errorCount++;
                                                    validateMessage =
                                                       {
                                                           //woreda: currentHMIScode.WoredaName,
                                                           //zone: currentHMIScode.ZONENAME,
                                                           //region: currentHMIScode.ReportingRegionName,
                                                           //facilityName: currentHMIScode.FacilityName,
                                                           message: 'Error: ' + validateMessages[j]["message"],
                                                           messageType: "Error"
                                                       }
                                                    $scope.errors.push(validateMessage);

                                                }
                                            }
                                        } catch (e) {

                                        }


                                    }

                                }
                            }
                        }
                    }
                    else if (temphierarchy[0].FacilityTypeName == 'Zonal Health Department' || temphierarchy[0].RegionId == 14 || temphierarchy[0].RegionId == 15) {
                        if (document.getElementsByClassName(changedValueObj.LabelID + '_' + $scope.sltWoreda + '_' + $scope.dataElementType + '_' + $scope.validationYear + '_' + $scope.validationMonth).length > 0) {

                            if (document.getElementsByClassName(changedValueObj.LabelID + '_' + $scope.sltWoreda + '_' + $scope.dataElementType + '_' + $scope.validationYear + '_' + $scope.validationMonth)[0].attributes.tag.nodeValue == changedValueObj.LabelID + '_' + $scope.sltWoreda + '_' + $scope.dataElementType + '_' + $scope.validationYear + '_' + $scope.validationMonth) {

                                var validateMessages = getValidationByLabelID($scope.validateRule, changedValueObj.LabelID, 'labelId', fName);

                                for (var j = 0; j < validateMessages.length; j++) {

                                    var strTest = validateMessages[j]["sumRule"];
                                    var strArray = [];

                                    if (strTest != null) {

                                        if (strTest.indexOf("==") !== -1) {
                                            strArray = strTest.split("==");
                                        }
                                        else if (strTest.indexOf("<=") !== -1) {
                                            strArray = strTest.split("<=");
                                        }
                                        else if (strTest.indexOf(">=") !== -1) {
                                            strArray = strTest.split(">=");
                                        }
                                    }
                                    var left = strArray[0];
                                    var right = strArray[1];

                                    var leftVal;
                                    var rightVal;

                                    try {
                                        leftVal = eval(left);
                                    } catch (e) {
                                        //$scope.status = $scope.status + "\n" + left;
                                    }

                                    try {
                                        rightVal = eval(right);
                                    } catch (e) {
                                        //$scope.status = $scope.status + "\n" + right;
                                    }


                                    var validateMessage = {};

                                    if (leftVal != null && rightVal != null) {
                                        try {
                                            if (!eval(validateMessages[j]["sumRule"]) && (!isNaN(eval(left)) && !isNaN(eval(right)))) {

                                                if (validateMessages[j]["RuleType"] == "Warning") {
                                                    warningCount++;
                                                    validateMessage =
                                                        {
                                                            //woreda: currentHMIScode.WoredaName,
                                                            //zone: currentHMIScode.ZONENAME,
                                                            //region: currentHMIScode.ReportingRegionName,
                                                            //facilityName: currentHMIScode.FacilityName,
                                                            message: validateMessages[j]["message"],
                                                            messageType: "Warning"
                                                        }
                                                    $scope.errors.push(validateMessage);

                                                }
                                                else if (validateMessages[j]["RuleType"] == "NotWarning") {
                                                    errorCount++;
                                                    validateMessage =
                                                       {
                                                           //woreda: currentHMIScode.WoredaName,
                                                           //zone: currentHMIScode.ZONENAME,
                                                           //region: currentHMIScode.ReportingRegionName,
                                                           //facilityName: currentHMIScode.FacilityName,
                                                           message: 'Error: ' + validateMessages[j]["message"],
                                                           messageType: "Error"
                                                       }
                                                    $scope.errors.push(validateMessage);

                                                }
                                            }
                                        } catch (e) {

                                        }


                                    }

                                }
                            }
                        }
                    }
                    else if (temphierarchy[0].FacilityTypeName == 'Woreda Health Bureau') {
                        if (document.getElementsByClassName(changedValueObj.LabelID + '_' + $scope.sltfacility + '_' + $scope.dataElementType + '_' + $scope.validationYear + '_' + $scope.validationMonth).length > 0) {

                            if (document.getElementsByClassName(changedValueObj.LabelID + '_' + $scope.sltfacility + '_' + $scope.dataElementType + '_' + $scope.validationYear + '_' + $scope.validationMonth)[0].attributes.tag.nodeValue == changedValueObj.LabelID + '_' + $scope.sltfacility + '_' + $scope.dataElementType + '_' + $scope.validationYear + '_' + $scope.validationMonth) {

                                var validateMessages = getValidationByLabelID($scope.validateRule, changedValueObj.LabelID, 'labelId', fName);

                                for (var j = 0; j < validateMessages.length; j++) {

                                    var strTest = validateMessages[j]["sumRule"];
                                    var strArray = [];

                                    if (strTest != null) {

                                        if (strTest.indexOf("==") !== -1) {
                                            strArray = strTest.split("==");
                                        }
                                        else if (strTest.indexOf("<=") !== -1) {
                                            strArray = strTest.split("<=");
                                        }
                                        else if (strTest.indexOf(">=") !== -1) {
                                            strArray = strTest.split(">=");
                                        }
                                    }
                                    var left = strArray[0];
                                    var right = strArray[1];

                                    var leftVal;
                                    var rightVal;

                                    try {
                                        leftVal = eval(left);
                                    } catch (e) {
                                        //$scope.status = $scope.status + "\n" + left;
                                    }

                                    try {
                                        rightVal = eval(right);
                                    } catch (e) {
                                        //$scope.status = $scope.status + "\n" + right;
                                    }


                                    var validateMessage = {};

                                    if (leftVal != null && rightVal != null) {
                                        try {
                                            if (!eval(validateMessages[j]["sumRule"]) && (!isNaN(eval(left)) && !isNaN(eval(right)))) {

                                                if (validateMessages[j]["RuleType"] == "Warning") {
                                                    warningCount++;
                                                    validateMessage =
                                                        {
                                                            //woreda: currentHMIScode.WoredaName,
                                                            //zone: currentHMIScode.ZONENAME,
                                                            //region: currentHMIScode.ReportingRegionName,
                                                            //facilityName: currentHMIScode.FacilityName,
                                                            message: validateMessages[j]["message"],
                                                            messageType: "Warning"
                                                        }
                                                    $scope.errors.push(validateMessage);

                                                }
                                                else if (validateMessages[j]["RuleType"] == "NotWarning") {
                                                    errorCount++;
                                                    validateMessage =
                                                       {
                                                           //woreda: currentHMIScode.WoredaName,
                                                           //zone: currentHMIScode.ZONENAME,
                                                           //region: currentHMIScode.ReportingRegionName,
                                                           //facilityName: currentHMIScode.FacilityName,
                                                           message: 'Error: ' + validateMessages[j]["message"],
                                                           messageType: "Error"
                                                       }
                                                    $scope.errors.push(validateMessage);

                                                }
                                            }
                                        } catch (e) {

                                        }


                                    }

                                }
                            }
                        }
                    }
                    
                });
            //});
                $scope.uniqueError = distinct($scope.errors);
                $scope.showValidation = false;

                var setShowValidation = function () {
                    $scope.showValidation = true;
                }
                $timeout(setShowValidation, 0);
                document.getElementById("loader").style.visibility = "hidden";
                $scope.status = "";
                if ($scope.errors.length == 0) {
                    $scope.showNoErrorMessage = true;
                }
                else {
                    $scope.showNoErrorMessage = false;
                }
           
        }
        
    });

    $scope.$watch('validateData', function (newValue, oldValue) {
        if (newValue != undefined) {
            $scope.status = "Data element values are loaded for valiation. wait ...";
            //getLocationsByLevel();
        }
    });

    function distinct(objectArray) {

        var distinctResult = [];

        $.each(objectArray, function (i, currentObject) {
            if (!exists(distinctResult, currentObject))
                distinctResult.push(currentObject);
        });

        return distinctResult;
    }

    function exists(arr, object) {
        var compareToJson = JSON.stringify(object),
            result = false;
        $.each(arr, function (i, existingObject) {
            if (JSON.stringify(existingObject) === compareToJson) {
                result = true;
                return false; // break
            }
        });

        return result;
    }

    $scope.validateNow = function () {
        $scope.uniqueError = [];
        $scope.warnings = [];
        $scope.errors = [];
        $scope.status = "Please wait ...";
        document.getElementById("loader").style.display = "block";
        document.getElementById("loader").style.visibility = "visible";
        $scope.showNoErrorMessage = false;
        $scope.status = "Getting data element values. wait ...";
        if (temphierarchy[0].FacilityTypeName == 'Federal Ministry of Health') {
            ValueService.getHmisDataForValidation($scope.validationYear, 0, 0, $scope.validationMonth, $scope.dataElementType, $scope.sltRegion, function (successCallback) {
                $scope.validateData = successCallback.data;
            });
        }
        else if (temphierarchy[0].FacilityTypeName == 'Regional Health Bureau' && temphierarchy[0].RegionId!=14 && temphierarchy[0].RegionId!=15) {
            ValueService.getHmisDataByLevel($scope.validationYear, 0, 0, $scope.validationMonth, $scope.dataElementType, $scope.sltZone, 'ZoneID', function (successCallback) {
                $scope.validateData = successCallback.data;
            });
        }
        else if ((temphierarchy[0].FacilityTypeName == 'Zonal Health Department' || temphierarchy[0].RegionId == 14 || temphierarchy[0].RegionId == 15) && temphierarchy[0].FacilityTypeName != 'Woreda Health Bureau') {
            ValueService.getHmisDataByLevel($scope.validationYear, 0, 0, $scope.validationMonth, $scope.dataElementType, $scope.sltWoreda, 'WoredaID', function (successCallback) {
                $scope.validateData = successCallback.data;
            });
        }
        else if (temphierarchy[0].FacilityTypeName == 'Woreda Health Bureau') {
            ValueService.getHmisDataByLevel($scope.validationYear, 0, 0, $scope.validationMonth, $scope.dataElementType, $scope.sltfacility, 'LocationID', function (successCallback) {
                $scope.validateData = successCallback.data;
            });
        }
    }
}]);


//var selectedMonth = function getSelectedMonth(){
//    return document.getElementById("vMonth").options[document.getElementById("vMonth").selectedIndex].text;
//}

function initSocket(recordType) {
    var uri = "ws://localhost:4636/api/LiveConnection/";
    websocket = new WebSocket(uri);

    websocket.onopen = function () {
        $('#messages').prepend('<div>Connected to server.</div>');
        websocket.send(recordType);
    };

    websocket.onerror = function (event) {
        $('#messages').prepend('<div>ERROR</div>');
    };

    websocket.onmessage = function (event) {
        $('#messages').prepend('<div>' + event.data + '</div>');
    };
}

//$scope.init = function () {
//    $scope.fillZone(1);
//}

//$scope.levelSelect = 2;
//initSocket();
$(document).ready(function () {
   // $scope.fillZone(1);
    //initSocket();
    
});