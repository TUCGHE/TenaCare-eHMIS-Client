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

app.controller('denominatorController', function ($scope, denominatorService, ValueService, LanguageFactory) {
    $scope.denominator = {};
    $scope.languageSet = {};
    $scope.title = {};
    $scope.status = {};
    $scope.selectedYear = "";

    var className = "denominator";

    var lang = $scope.languageSet;

    $scope.getLanguageLabel = function (lang, className) {
        LanguageFactory.getLanguageLabelService(lang, className)
		.then(function (data) {
		    $scope.values = data;

		    for (var i = 0; i < $scope.values.length; i++) {
		        $scope.denominator[$scope.values[i].indexName] = $scope.values[i].LanguageName;
		    }

		    $scope.title = $scope.denominator['denominatorDataEntry'];
		    $scope.status = $scope.denominator['loading'] + '...';
		})
    }

    lang = localStorage.getItem('languageSet', 'english');

    $scope.getLanguageLabel(lang, className);   

    $scope.$watch('temphierarchy[0].FacilityTypeId', function (newValue, oldValue) {
        if (newValue != undefined) {
            if (newValue == 1) {
                facilityType = 3;
            }
            else if (newValue == 2) {
                facilityType = 2;
            }
            else if (newValue == 3) {
                facilityType = 1;
            }
            else if (newValue == 4) {
                facilityType = 2;
            }
            else if (newValue == 5) {
                facilityType = 3;
            }
            else if (newValue == 6) {
                facilityType = 2;
            }
            else if (newValue == 7) {
                facilityType = 3;
            }
            else if (newValue == 8) {
                facilityType = 4;
            }
            else if (newValue == 9) {
                facilityType = 5;
            }
            else if (newValue == 10) {
                facilityType = 6;
            }
            else if (newValue == 11) {
                facilityType = 7;
            }

            denominatorService.getDenominator(facilityType, function (response) {
                $scope.data = response.data;
                $scope.status = $scope.denominator['denominatorHaveBeenLoaded'];
            }, function (error) {
                $scope.status = $scope.denominator['failedToLoadValues']; 
            });
            $scope.loadData($scope.LocationId);
        }
    });
    var initCurrentDate = function () {
        Date.prototype.getJulian = function () {
            return Math.floor((this / 86400000) - (this.getTimezoneOffset() / 1440) + 2440587.5);
        }

        var today = new Date(); //set any date
        var julian = today.getJulian(); //get Julian counterpart 

        var ec = $.calendars.instance('ethiopian').fromJD(julian);
        var ethioyear = ec.year();
        //$scope.selectedYear = ethioyear;
    }

    var getValidationByLabelID = function arrayObjectIndexOf(myArray, searchTerm, property, fName) {
        var validations = [];
        if (searchTerm != null) {
            for (var i = 0, len = myArray.length; i < len; i++) {
                if (myArray[i][property] === searchTerm.toString() && myArray[i][fName] === 1 && myArray[i]["dataEleClass"] === 4)
                    validations.push(myArray[i]);
            }
            return validations;
        }
        return -1;
    }

    $scope.ChangedValue = [];
    var chagedData = [];
    $scope.getChangedValue = function (year, value, lbid, LocationId, facilityTypeId, zone, region, woreda) {

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
                "DataEleClass": 4,
                "FederalID": 0,
                "RegionID": region,
                "ZoneID": zone,
                "WoredaID": woreda,
                "LocationID": LocationId,
                "Week": 0,
                "Month": 0,
                "Quarter": 0,
                "Year": year,
                "Value": value,
                "Level": 0,
                "FACILITTYPE": facilityTypeId,
                "DateEntered": today,
                "Editable": true
            };

            var validateMessage = {};
            ValueService.validate(changedValueObj, function (response) {

                var fName = "";
                if (facilityTypeId == 1) {
                    fName = "HC";
                }
                else if (facilityTypeId == 2) {
                    fName = "HC";
                }
                else if (facilityTypeId == 3) {
                    fName = "HP";
                }
                else {
                    fName = "HP"
                }

                var validateMessages = getValidationByLabelID(response.data, lbid, 'labelId', fName);
                if (validateMessages.length == 0) {
                    $scope.ChangedValue.push(changedValueObj);
                    chagedData = $scope.ChangedValue;
                }
                eval("document.getElementById('" + lbid + "_labelWarning').innerText= '';");
                eval("document.getElementById('" + lbid + "_labelError').innerText= '';");

                for (var i = 0; i < validateMessages.length; i++) {
                    var strTest = validateMessages[i]["sumRule"];
                    var strArray = [];

                    if (strTest.indexOf("==") !== -1) {
                        strArray = strTest.split("==");
                    }
                    else if (strTest.indexOf("<=") !== -1) {
                        strArray = strTest.split("<=");
                    }
                    else if (strTest.indexOf(">=") !== -1) {
                        strArray = strTest.split(">=");
                    }

                    var left = strArray[0];
                    var right = strArray[1];

                    var leftVal = eval(left);
                    var rightVal = eval(right);

                    if (!eval(validateMessages[i]["sumRule"]) && (!isNaN(eval(left)) && !isNaN(eval(right)))) {

                        if (validateMessages[i]["RuleType"] == "Warning") {
                            $scope.ChangedValue.push(changedValueObj);
                            //chagedData = $scope.ChangedValue;
                            eval("document.getElementById('" + lbid + "_labelWarning').innerText= '" + validateMessages[i]["message"] + "';");
                            //alert(validateMessages[i]["message"], "Warning");
                        }
                        else if (validateMessages[i]["RuleType"] == "NotWarning") {
                            eval("document.getElementById('" + lbid + "').focus();")
                            eval("document.getElementById('" + lbid + "_labelError').innerText= '" + validateMessages[i]["message"] + "';");
                            //alert(validateMessages[i]["message"], "Error");
                            //break;
                        }
                    }
                    else {
                        $scope.ChangedValue.push(changedValueObj);
                        chagedData = $scope.ChangedValue;
                    }

                }


            });
        }
    }

    $scope.getIndex = function arrayObjectIndexOf(myArray, searchTerm, property) {
        //console.log(myArray + ' ' + searchTerm + ' ' + property);
        if (searchTerm != null) {
            for (var i = 0, len = myArray.length; i < len; i++) {
                if (myArray[i][property] === searchTerm) return i;
            }
        }
        return -1;
    }
    $scope.saveClicked = function () {
        ValueService.updateData(chagedData, function (response) {
            var val = response.data;
            chagedData = [];
            //alert(val);
            alert($scope.denominator['dataUpdatedSuccessfully']);
        });
    }
    $scope.loadData = function (locationId) {
        ValueService.getHmisData($scope.selectedYear, 0, 0, 0, 4, locationId, function (response) {
            fetch($scope.temphierarchy[0].FacilityTypeId);
            $scope.loadedData = response.data;
        });
    }

    $scope.init = function () {
        initCurrentDate();
    }

});