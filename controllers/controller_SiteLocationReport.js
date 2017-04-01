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

app.controller('SiteSettingCtrl', function ($scope, $location, siteSettingsFactory,
    hierarchyFactory, commonHierarchyService, LanguageFactory) {
    Date.prototype.getJulian = function () {
        return Math.floor((this / 86400000) - (this.getTimezoneOffset() / 1440) + 2440587.5);
    }

    $scope.siteTitle = {};

    var now = new Date();

    var dd = now.getDate();
    var mm = now.getMonth()
    var yyyy = now.getFullYear();

    var today = new Date(yyyy, mm, dd); //set any date
    var julian = today.getJulian(); //get Julian counterpart 

    var ec = $.calendars.instance('ethiopian').fromJD(julian);
    var ethioyear = ec.year();
    var ethiomonth = ec.month();
    var ethioday = ec.day();   

    $scope.logout = function () {
        Cookies.remove('logged-in');
        window.location.assign('index.html');
    }

    //let's set the user var on scope as well...
    $scope.USER = JSON.parse(Cookies.get('logged-in'))

    // to help toggle active nodes in navigation, relative to routes
    $scope.toggleActive = function () {
        var current = $location.path().substring(1);
        var mapping = {
            "nav-home": ["home"],
            "nav-config": ["SiteSetting", "SiteSettingTemporary", "DenominatorsEntry", "TargetEntry", "ImportFromExcel", "ValidationsIndicators", "Users"],
            "nav-data": ["serviceDataEntry", "serviceDataEntryQuarter", "serviceDataEntryAnnual", "opdDataEntry", "opdDataEntryMonthly", "opdDataEntryQuarter", "ipdDataEntry", "ipdDataEntry"],
            "nav-indicators": ["serviceReport", "opdReport", "ipdReport", "customReport", "customReport_alt"],
            "nav-charts": ["plugin_bi", "analytics", "gis", "dashboards"],
            "nav-comms": ["Import", "Export", "SendReport", "feedbacks"],
            "nav-help": ["Help"],
        }

        for (key in mapping) {

            if (mapping[key].indexOf(current) >= 0) {
                $("#" + key).addClass('active');
            } else
                $("#" + key).removeClass('active');
        }
    };


    $scope.getSiteSetting = function (id) {
        siteSettingsFactory.getSiteSettingService(id)
		.then(function (data) {
		    $scope.setLocation = data[0];
		    //alert("getSiteSetting called!! locationId is: " + $scope.setLocation.LocationId);
		    ////console.log("$scope.setLocation=" + $scope.setLocation.LocationId);
		    $scope.LocationId = $scope.setLocation.LocationId;

		    $scope.getHierarchy = function (id) {
		        hierarchyFactory.getHierarchyService(id)
                .then(function (data) {
                    commonHierarchyService.setCommonHierarchy(data);
                    commonHierarchyService.setTempHierarchy(data);
                    //$scope.hierarchy = data;
                    $scope.hierarchy = commonHierarchyService.getCommonHierarchy();
                    $scope.temphierarchy = commonHierarchyService.getTempHierarchy();

                    $scope.tempLocationId = $scope.temphierarchy[0].HMISCode;
                    localStorage.setItem('tempLocationId', $scope.tempLocationId);
                    // //console.log("$scope.hierarchy=" + $scope.hierarchy);
                });
		    }
		    ////console.log("$scope.LocationId=" + $scope.LocationId);
		    $scope.$watch($scope.LocationId, function (v) {
		        if (v != undefined)
		        {
		            $scope.getHierarchy($scope.LocationId);
		        }
		    });
		   


		});
    }

    $scope.getSiteSetting(0);

    $scope.sethierarchy = function () {
        //$scope.hierarchy = null;
        //$scope.hierarchy = commonHierarchyService.hierarchy;
        $scope.hierarchy = commonHierarchyService.getCommonHierarchy();
        $scope.temphierarchy = commonHierarchyService.getTempHierarchy();
    }

    $scope.languageSet = {};
    var className = "dashboard";

    var lang = $scope.languageSet;

    $scope.getLanguageLabel = function (lang, className) {
        LanguageFactory.getLanguageLabelService(lang, className)
		.then(function (data) {
		    $scope.values = data;

		    $scope.dashboardLanguages = {};
		    for (var i = 0; i < $scope.values.length; i++) {
		        $scope.dashboardLanguages[$scope.values[i].indexName] = $scope.values[i].LanguageName;
		    }

		    $scope.siteTitle = $scope.dashboardLanguages['webBasedEhmis'];

		    $scope.mainButtonColor = {
		        "english": "lightgray",
		        "arabic": "lightgray",
		        "amharic": "lightgray",
		        "french": "lightgray",
		        "portuguese": "lightgray",
		        "spanish": "lightgray"
		    };

		    $scope.mainButtonColor[lang] = "cornflowerblue";
		})
    }

    $scope.mainButtonColor = {
        "english": "lightgray",
        "arabic": "lightgray",
        "amharic": "lightgray",
        "french": "lightgray",
        "portuguese": "lightgray",
        "spanish": "lightgray"
    };

    $scope.mainButtonColor[lang] = "cornflowerblue";

    lang = localStorage.getItem('languageSet', 'english');

    $scope.mainButtonColor[lang] = "cornflowerblue";

    lang = localStorage.getItem('languageSet', 'english');
    $scope.languageSet = lang;

    $scope.getLanguageLabel(lang, className);

    $scope.setLanguage = function (langName) {

        //LanguageFactory.setLanguageService(langName);       

        $scope.mainButtonColor = {
            "english": "lightgray",
            "arabic": "lightgray",
            "amharic": "lightgray",
            "french": "lightgray",
            "portuguese": "lightgray",
            "spanish": "lightgray"
        };

        $scope.mainButtonColor[langName] = "cornflowerblue";
        localStorage.setItem('languageSet', langName);

        location.reload();
    }

    mm = mm + 1;
    if ($scope.languageSet != 'amharic') {
        $scope.currentDate = mm + "/" + dd + "/" + yyyy;
    }
    else {
        $scope.currentDate = ethioday + "/" + ethiomonth + "/" + ethioyear;
    }

});


app.controller('locationCtrl', function ($scope, $timeout, headFacilityFactory, customReportFactory, childrenFactory,
    commonHierarchyService, mainLocationSaveFactory, siteSettingsFactory, hierarchyFactory,
    NoParentFacilityFactory, ValueService, LanguageFactory) {
    $scope.MainSiteTitle = "Main Site Settings";
    $scope.WorkingSiteTitle = "Set Working Location";
    $scope.CustomReportTitle = "Custom Reports";

    $scope.languageSet = {};
    var className = "customReports,siteSetting";

    var lang = $scope.languageSet;

    $scope.getLanguageLabel = function (lang, className) {
        LanguageFactory.getLanguageLabelService(lang, className)
		.then(function (data) {
		    $scope.values = data;

		    $scope.customReports = {};
		    $scope.siteSetting = {};
		    for (var i = 0; i < $scope.values.length; i++) {
		        $scope.customReports[$scope.values[i].indexName] = $scope.values[i].LanguageName;
		    }
		    $scope.siteSetting = $scope.customReports;
		})
    }

    lang = localStorage.getItem('languageSet', 'english');

    $scope.getLanguageLabel(lang, className);


    headFacilityFactory.getlist()
      .then(function (data) {
          $scope.regionLevel = data;
      });


    // Initialization
    $scope.level0Expand = false;
    $scope.level1Expand = false;
    $scope.level2Expand = false;
    $scope.level3Expand = false;
    $scope.showReport = false;
    $scope.children = {};
    $scope.level0ExpandChildren = {};
    $scope.level1ExpandChildren = {};
    $scope.level2ExpandChildren = {};
    $scope.level3ExpandChildren = {};
    $scope.checkedFacilities = {};
    $scope.checkedState = {};
    $scope.MonthPeriod = false;
    $scope.QuarterPeriod = false;
    $scope.showCache = true;
    $scope.showOnlyQDE = false;
    $scope.ViewMoreIndicatorOptions = false;
    $scope.isCacheEnabled = false;
    $scope.showNumDenom = false;
    $scope.showTarget = false;
    $scope.customReportColumns = {};
    $scope.customReportData = {};
    $scope.customReportColumns = null;
    $scope.customReportData = null;
    //$scope.showAllCheck = false;
    $scope.searchedFacilitySize = undefined;
    $scope.showItemsPerPage = 500;
    $scope.entriesToShow = 500;
    $scope.showFacilityTable = false;

    $scope.selectedFacilityName = '';
    $scope.TempLocationIdToSet = -1;
    $scope.mainLocationIdToSet = -1;
    $scope.sortKey = null;
    $scope.reverse = false;
  
    var tmp = localStorage.getItem('tempLocationId', undefined);
    if (tmp != undefined) {
        $scope.tempLocationId = tmp;
    }
    
    $scope.EthYear = { "startMonth": "", "endMonth": "" };

    $scope.sort = function (keyname) {
        $scope.sortKey = keyname;   //set the sortKey to the param passed
        //$scope.reverse = !$scope.reverse; //if true make it false and vice versa
        $scope.reverse = ($scope.sortKey === keyname) ? !$scope.reverse : false;
    }

    $scope.show_params = true;
    $scope.toggleShowParams = function () {
        $scope.show_params = $('#toggle-params').prop('checked');
    }

    $scope.hideParams = function () {
        $scope.show_params = false;
        $('#toggle-params').prop('checked', false);
    }

    $scope.temphierarchy = {};

    $scope.locationToSet = function (facilityId, facilityName, setTemp) {
        $scope.selectedFacilityName = facilityName;
        $scope.mainLocationIdToSet = facilityId;
        if (setTemp)
            $scope.TempLocationIdToSet = facilityId;
    }

    $scope.checkStateChanged = function () {
        if ($scope.showall) {
            $scope.showItemsPerPage = $scope.searchedFacilitySize;
            $scope.entriesToShow = $scope.searchedFacilitySize;
        }
        else {
            $scope.showItemsPerPage = 500;
            $scope.entriesToShow = 500;
        }
    }

    $scope.setEthiopianYear = function () {
        if ($scope.FiscalYear != undefined) {
            if ($scope.MonthPeriod) {
                if ($scope.StartPeriod != undefined) {
                    if (($scope.StartPeriod == "11") || ($scope.StartPeriod == "12")) {
                        var fiscalYearMinus1 = $scope.FiscalYear - 1;
                        $scope.EthYear.startMonth = "E.C. Year: " + fiscalYearMinus1;
                    }
                    else {
                        $scope.EthYear.startMonth = "E.C. Year: " + $scope.FiscalYear;
                    }
                }

                if ($scope.EndPeriod != undefined) {
                    if (($scope.EndPeriod == "11") || ($scope.EndPeriod == "12")) {
                        var fiscalYearMinus1 = $scope.FiscalYear - 1;
                        $scope.EthYear.endMonth = "E.C. Year: " + fiscalYearMinus1;
                    }
                    else {
                        $scope.EthYear.endMonth = "E.C. Year: " + $scope.FiscalYear;
                    }
                }
            }
        }
    }

    $scope.getSearchedFacilities = function (id) {
        $scope.searchedFacilityColumns = {
        };
        $scope.searchedFacilitiesResult = {
        };
        $scope.showFacilityTable = false;
        $scope.showItemsPerPage = $scope.entriesToShow;

        hierarchyFactory.getSearchedFacilitiesService(id)
        .then(function (data) {
            ////console.log(data);
            $scope.searchedFacilityColumns = data[0];
            $scope.searchedFacilitiesResult = data[1];
            $scope.searchedFacilitySize = $scope.searchedFacilitiesResult.length;
        });

        var setShowFacility = function () {
            $scope.showFacilityTable = true;
        }

        //setShowReports();
        $timeout(setShowFacility, 0);
    }

    $scope.SetPeriod = function () {
        $scope.StartPeriod = undefined;
        $scope.EndPeriod = undefined;
        $scope.showCache = true;

        if ($scope.Period == undefined) {
            $scope.QuarterPeriod = false;
            $scope.MonthPeriod = false;
        }
        else if ($scope.Period == "Monthly") {
            $scope.QuarterPeriod = false;
            $scope.MonthPeriod = true;
        }
        else if ($scope.Period == "Quarterly") {
            $scope.QuarterPeriod = true;
            $scope.MonthPeriod = false;
        }
        else if ($scope.Period = "Yearly") {
            $scope.QuarterPeriod = false;
            $scope.MonthPeriod = false;
            $scope.isCacheEnabled = false;
            $scope.showCache = false;
        }
    }

    $scope.SetReportType = function () {
        $scope.customReportColumns = {
        };
        $scope.customReportData = {
        };
        $scope.customReportColumns = null;
        $scope.customReportData = null;

        if ($scope.ReportType == "Indicators") {
            $scope.ViewMoreIndicatorOptions = true;
            $scope.isCacheEnabled = false;
            $scope.showCache = false;
        }
        else {
            $scope.showCache = true;
            $scope.ViewMoreIndicatorOptions = false;
        }
    }

    $scope.getCustomReport = function (parameters) {
        $scope.customReportColumns = {
        };
        $scope.customReportData = {
        };
        $scope.customReportColumns = null;
        $scope.customReportData = null;
        customReportFactory.getCustomReportService(parameters)
        .then(function (data) {
            ////console.log(data);
            $scope.customReportColumns = data[0];
            $scope.customReportColumnsLength = $scope.customReportColumns.length;
            $scope.customReportData = data[1];
            var colName = $scope.customReportColumns[0];
            var rowData = $scope.customReportData[0];
            $scope.testData = $scope.customReportData[0][colName];
        });
    }

    /*Joe: contrasting with use of datatables for direct rendering of tables which are meant for read-only/reporting purposes...*/
    $scope.getCustomReport_alt = function (parameters) {
        customReportFactory.getCustomReportService(parameters)
        .then(function (data) {

            ////console.log(data);
            var reportColumns = data[0].map(function (c) { return { title: c, data: c, visible: c != "ReadOnly" } });
            var reportDataSet = data[1];
            $('#reportContainer').empty().append('<table id="reportTable" width:"100%" style="padding:0px" class = "table table-hover table-responsive"></table>')

            $('#reportTable').DataTable({

                /* all we need to do to specify which columns and then the data source, that's all! */
                columns: reportColumns,
                data: reportDataSet,

                /* if we want to make some modification per row, based on the object corresponding to the row?
                like higlighting or hiding certain rows based on some condition? see below
                */
                rowCallback: function (row, data, index) {
                    if (data["ReadOnly"] == "True") {// NOTE: there is a field on the objects callede 'ReadOnly'
                        //$(row).css('background-color:gray'); // u can directly add in-line styles for this row
                        // or better, use a class
                        $(row).addClass('readOnlyRow');
                    }
                },

                /* below can be left as is... */
                dom: 'Brt',
                "bSort": false,
                paging: false,
                buttons: [
                    'copyHtml5', // copy table content to clipboard
                    'excelHtml5', // export table to excel
                    'csvHtml5', // export to csv
                    'pdfHtml5' // export to pdf
                ]
            });

            $('.progress').hide(); // we are done loading the data, plus rendering plugins...

        });
    }

    $scope.validateData = function (year, month, value, facilityTypeId, zone, region, woreda) {
        ///var monthIdex = getMonthIndex(month);
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

        //eval("document.getElementById('" + changedValueObj.LabelID + "_labelWarning').innerText= '';");
        //eval("document.getElementsByClassName('label-warning').hidden= 'true';");
        //eval("document.getElementsByClassName('label-danger').hidden= 'true';");

        $scope.customReportData.forEach(function (currentValue, index, arr) {
            //eval("document.getElementById('" + currentValue.LabelID + "_labelWarning').innerText= '';");
            //eval("document.getElementById('" + currentValue.LabelID + "_labelError').innerText= '';");
            var changedValueObj = {
                "LabelID": currentValue.LabelID,
                "DataEleClass": 6,
                "FederalID": 0,
                "RegionID": region,
                "ZoneID": zone,
                "WoredaID": woreda,
                "LocationID": temphierarchy[0].HMISCode,
                "Week": 0,
                "Month": month,
                "Quarter": 0,
                "Year": year,
                "Value": currentValue.value,
                "Level": 0,
                "FACILITTYPE": facilityTypeId,
                "DateEntered": today,
                "Editable": true
            };

            var validateMessage = {
            };
            ValueService.validate(changedValueObj, function (response) {


                var fName = "";
                //if (facilityTypeId == 2 || facilityTypeId == 1) {
                //    fName = "HC";
                //}
                //else if (facilityTypeId == 3) {
                //    fName = "HP";
                //}
                //else {
                //    fName = "HP"
                //}
                fName = "HC";
                var validateMessages = getValidationByLabelID(response.data, changedValueObj.LabelID, 'labelId', fName);

                for (var j = 0; j < validateMessages.length; j++) {

                    var strTest = validateMessages[j]["sumRule"];
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

                    if (!eval(validateMessages[j]["sumRule"]) && (!isNaN(eval(left)) && !isNaN(eval(right)))) {

                        if (validateMessages[j]["RuleType"] == "Warning") {
                            eval("document.getElementById('" + changedValueObj.LabelID + "_labelWarning').innerText= '" + validateMessages[j]["message"] + "';");
                        }
                        else if (validateMessages[j]["RuleType"] == "NotWarning") {
                            eval("document.getElementById('" + changedValueObj.LabelID + "_labelError').innerText= '" + validateMessages[j]["message"] + "';");
                        }
                    }
                }


            });
        });

        for (var i = 0; i < $scope.customReportData.length; i++) {


        }
    }

    var getValidationByLabelID = function arrayObjectIndexOf(myArray, searchTerm, property, fName) {
        var validations = [];
        if (searchTerm != null) {
            for (var i = 0, len = myArray.length; i < len; i++) {
                if (myArray[i][property] === searchTerm.toString() && myArray[i][fName] === 1 && myArray[i]["dataEleClass"] === 6)
                    validations.push(myArray[i]);
            }
            return validations;
        }
        return -1;
    }

    $scope.customReportRequested = function () {

        //console.log($scope.Period);
        //console.log($scope.ReportType);
        //console.log($scope.FiscalYear);           

        if ($scope.Period == undefined) {
            alert($scope.siteSetting['pleaseSpecifyThePeriod']);
        }
        else if ($scope.ReportType == undefined) {
            alert($scope.siteSetting['pleaseSpecifyTheReportType']);
        }
        else if ($scope.FiscalYear == undefined) {
            alert($scope.siteSetting['pleaseSelectTheFiscalYear']);
        }
        else if (($scope.Period != "Yearly") && ($scope.StartPeriod == undefined)) {
            alert($scope.siteSetting['pleaseSelectTheStartPeriod']);
        }
        else if (($scope.Period != "Yearly") && ($scope.EndPeriod == undefined)) {
            alert($scope.siteSetting['pleaseSelectTheEndPeriod']);
        }
            //else if ($scope.checkedFacilities.length == undefined) {
            //    alert("Please select at least one facility!");
            //}
        else if (Object.keys($scope.checkedFacilities).length === 0) {
            alert($scope.siteSetting['pleaseSelectAtleastOneFacility']);
        }
        else {

            var reportParameters = {
                "Period": $scope.Period, "ReportType": $scope.ReportType,
                "FiscalYear": $scope.FiscalYear, "StartPeriod": $scope.StartPeriod, "EndPeriod": $scope.EndPeriod,
                "Location": $scope.checkedFacilities, "showOnlyQDE": $scope.showOnlyQDE, "isCacheEnabled": $scope.isCacheEnabled,
                "showNumDenom": $scope.showNumDenom, "showTarget": $scope.showTarget
            };

            //var allCustomReportParameters = [];
            //allCustomReportParameters.push(reportParameters);
            //allCustomReportParameters.push($scope.checkedFacilities);

            $scope.showReport = false;
            $('.progress').show();
            $scope.getCustomReport(reportParameters);
            $scope.hideParams();

            var setShowReport = function () {
                $scope.showReport = true;
            }

            $timeout(setShowReport, 0);
        }
    }

    /*Joe: contrasting with use of datatables for direct rendering of tables...*/
    $scope.customReportRequested_alt = function () {

        //console.log($scope.Period);
        //console.log($scope.ReportType);
        //console.log($scope.FiscalYear);

        if ($scope.Period == undefined) {
            alert("Please Specify the period!");
        }
        else if ($scope.ReportType == undefined) {
            alert("Please specify the ReportType!");
        }
        else if ($scope.FiscalYear == undefined) {
            alert("Please select the Fiscal Year!");
        }
        else if ($scope.StartPeriod == undefined) {
            alert("Please select the start month!");
        }
        else if ($scope.EndPeriod == undefined) {
            alert("Please select the end month!");
        }
            //else if ($scope.checkedFacilities.length == undefined) {
            //    alert("Please select at least one facility!");
            //}
        else if (Object.keys($scope.checkedFacilities).length === 0) {
            alert("Please select at least one facility!");
        }
        else {
            // Construct the JSON parameters
            // var car = {type:"Fiat", model:"500", color:"white"};
            var reportParameters = {
                "Period": $scope.Period, "ReportType": $scope.ReportType,
                "FiscalYear": $scope.FiscalYear, "StartPeriod": $scope.StartPeriod, "EndPeriod": $scope.EndPeriod,
                "Location": $scope.checkedFacilities
            };

            //var allCustomReportParameters = [];
            //allCustomReportParameters.push(reportParameters);
            //allCustomReportParameters.push($scope.checkedFacilities);

            $scope.showReport = true;
            $('.progress').show();
            $scope.getCustomReport_alt(reportParameters);
        }
    }

    $scope.checkedStateChanged = function (id) {
        if ($scope.checkedState[id]) {
            $scope.checkedFacilities[id] = 1;
        }
        else {
            //delete myObject.keyname;
            //// or,
            //delete myObject["keyname"];
            if ($scope.checkedFacilities[id] == 1) {
                delete $scope.checkedFacilities[id];
            }
        }
    }

    $scope.getSiteSetting = function (id) {
        siteSettingsFactory.getSiteSettingService(id)
		.then(function (data) {
		    $scope.setLocation = data[0];
		    //alert("getSiteSetting called!! locationId is: " + $scope.setLocation.LocationId);
		    //console.log("$scope.setLocation=" + $scope.setLocation.LocationId);
		    $scope.LocationId = $scope.setLocation.LocationId;

		    $scope.getHierarchy = function (id) {
		        hierarchyFactory.getHierarchyService(id)
                .then(function (data) {
                    commonHierarchyService.setCommonHierarchy(data);
                    //commonHierarchyService.setTempHierarchy(data);
                    //$scope.hierarchy = data;
                    $scope.hierarchy = commonHierarchyService.getCommonHierarchy();
                    $scope.temphierarchy = commonHierarchyService.getTempHierarchy();
                    //console.log("$scope.hierarchy=" + $scope.hierarchy);
                    if (($scope.temphierarchy != undefined) && ($scope.temphierarchy.length > 0)) {
                        $scope.tempLocationId = $scope.temphierarchy[0].HMISCode;
                        localStorage.setItem('tempLocationId', $scope.tempLocationId);
                    }                    
                });
		    }
		    //console.log("$scope.LocationId=" + $scope.LocationId);
		    // use the temporary locationId...
		    $scope.$watch($scope.LocationId, function (v) {
		        if (v != undefined) {
		            $scope.getHierarchy($scope.LocationId);
		        }
		    });

            
		    $scope.$watch('LocationId', function () {
		        if ($scope.LocationId == undefined) {
		            console.log("$scope.LocationId: undefined, yet trying to be used...")
		        } else {
		            // ok to proceed (but, does this need to be invoked once or everytime  $scope.LocationId changes?
		            $scope.getHierarchy($scope.LocationId) 
		        }
		    });
		   

		    //$scope.temphierarchy = commonHierarchyService.getTempHierarchy();
		    //$scope.tempLocationId = $scope.temphierarchy[0].HMISCode;

		    $scope.getLevel0Custom = function () {
		        //childrenFactory.getChildrenService($scope.LocationId)
		        childrenFactory.getChildrenService($scope.tempLocationId)
                .then(function (data) {
                    $scope.children0Custom = data;
                    //console.log("$scope.children0=" + $scope.children0);
                });
		    }

		    $scope.getLevel0 = function () {
		        //childrenFactory.getChildrenService($scope.LocationId)
		        childrenFactory.getChildrenService($scope.LocationId)
                .then(function (data) {
                    $scope.children0 = data;
                    //console.log("$scope.children0=" + $scope.children0);
                });
		    }

		    
		    //var isInvoked = false;
		    $scope.$watch('LocationId', function () {
		        //if (isInvoked)
		        //    return;
		        if ($scope.LocationId == undefined) {
		            console.log("$scope.LocationId: undefined, yet trying to be used...")
		        } else {
		            $scope.getLevel0(); // ok to proceed
		            //isInvoked = true;
		        }
		    });

		    
		    //var isInvoked2 = false;
		    $scope.$watch('tempLocationId', function () {
		        //if (isInvoked2)
		        //    return;
		        if ($scope.tempLocationId == undefined) {
		            console.log("$scope.tempLocationId: undefined, yet trying to be used...")
		        } else {
		            $scope.getLevel0Custom(); // ok to proceed
		            //isInvoked2 = true;
		        }
		    });
		});
    }

    $scope.home = true;
    $scope.getSiteSetting(0);

    $scope.setHome = function () {
        $scope.home = true;
    }

    $scope.setNotHome = function () {
        $scope.home = false;
    }

    $scope.saveMainLocationId = function (id) {
        if (id == undefined) {
            alert($scope.siteSetting['noFacilitySelectedPleaseSelectAFacility']);
        }
        else if (id == -1) {
            alert($scope.siteSetting['noFacilitySelectedPleaseSelectAFacility']);
        }
        else {
            mainLocationSaveFactory.saveMainLocationIdService(id)
            .then(function (data) {
                commonHierarchyService.setCommonHierarchy(data);
                commonHierarchyService.setTempHierarchy(data);
                //$scope.hierarchy = data;
                $scope.hierarchy = commonHierarchyService.getCommonHierarchy();
                $scope.temphierarchy = commonHierarchyService.getTempHierarchy();

                //$scope.hierarchy = data;
                //$scope.Temphierarchy = data;

                $scope.LocationId = $scope.hierarchy[0].HMISCode;
                $scope.tempLocationId = $scope.temphierarchy[0].HMISCode;
                localStorage.setItem('tempLocationId', $scope.tempLocationId);

                alert($scope.siteSetting['siteSetSuccessfullyTo'] + "  " + $scope.hierarchy[0].FacilityName)
                //location.reload();
                //$scope.getSiteSetting(0);	
            });
        }
    }

    $scope.saveTempLocationId = function (id) {
        if (id == undefined) {
            alert($scope.siteSetting['noFacilitySelectedPleaseSelectAFacility']);                
        }
        else if (id == -1) {
            alert($scope.siteSetting['noFacilitySelectedPleaseSelectAFacility']);
        }
        else {
            hierarchyFactory.getHierarchyService(id)
                    .then(function (data) {
                        //$scope.Temphierarchy = data;
                        commonHierarchyService.setTempHierarchy(data);
                        $scope.temphierarchy = commonHierarchyService.getTempHierarchy();
                        if (($scope.temphierarchy != undefined) && ($scope.temphierarchy.length > 0)) {
                            $scope.tempLocationId = $scope.temphierarchy[0].HMISCode;
                            localStorage.setItem('tempLocationId', $scope.tempLocationId);
                            alert($scope.siteSetting['workingSiteSetSuccessfullyTo'] + "  " + $scope.temphierarchy[0].FacilityName)
                            //location.reload();
                        }
                    });
        }
    }

    $scope.hasChildren = function (id, FacilityTypeId, level, facilityName) {
        childrenFactory.getChildrenService(id)
        .then(function (data) {
            if (data.length == 0) {
                return false;
            }
            else {
                return true;
            }
        });
    }

    $scope.getChildren = function (id, FacilityTypeId, level, facilityName, parent) {
        childrenFactory.getChildrenService(id)
		.then(function (data) {

		    $scope.selectedFacilityName = facilityName;
		    if (parent == 0) {
                debugger
		        $scope.TempLocationIdToSet = id;
		    }
		    else {
		        $scope.mainLocationIdToSet = id;
		    }

		    if (FacilityTypeId != 11) {
		        //console.log("Id=" + id + " FacilityType=" + FacilityTypeId + "  Level=" + level);

		        $scope.children[id] = data;
		        //console.log("$scope.children[id] " + $scope.children[id] + "\n");
		    }

		    if ((FacilityTypeId == 10) || (level == 0))// Region Level or other Top Level
		    {
		        ////console.log("$scope.level0Expand " + $scope.level0Expand  + "\n");
		        //if ($scope.level0Expand == true)
		        //{
		        //    $scope.level0Expand = false;
		        //    $scope.children[id] = null;
		        //}
		        //else
		        //{
		        //	$scope.level0Expand = true;
		        //}

		        if ($scope.level0ExpandChildren[id] == true) {
		            $scope.level0ExpandChildren[id] = false;
		            $scope.children[id] = null;
		        }
		        else {
		            $scope.level0ExpandChildren[id] = true;
		        }

		        //console.log("$scope.level0Expand " + $scope.level0Expand + "\n");
		        //console.log("$scope.level0ExpandChildren[id] " + $scope.level0ExpandChildren[id] + "\n");

		        $scope.children1 = data;
		        $scope.clickedId1 = id;
		    }
		    else if (level == 1) {
		        //console.log("$scope.level0Expand " + $scope.level1Expand + "\n");

		        if (FacilityTypeId == 9) // Zone Level
		        {
		            //console.log("$scope.level0Expand " + $scope.level1Expand + "\n");
		            //if ($scope.level1Expand == true)
		            //{
		            //    $scope.level1Expand = false;
		            //    $scope.children[id] = null;
		            //}
		            //else
		            //{
		            //	$scope.level1Expand = true;
		            //}

		            if ($scope.level1ExpandChildren[id] == true) {
		                $scope.level1ExpandChildren[id] = false;
		                $scope.children[id] = null;
		            }
		            else {
		                $scope.level1ExpandChildren[id] = true;
		            }


		            $scope.children2 = data;
		            $scope.clickedId2 = id;
		        }
		        else if (FacilityTypeId == 8) //Woreda Level
		        {
		            //console.log("$scope.level0Expand " + $scope.level1Expand + "\n");
		            //if ($scope.level1Expand == true)
		            //{
		            //    $scope.level1Expand = false;
		            //    $scope.children[id] = null;
		            //}
		            //else
		            //{
		            //	$scope.level1Expand = true;
		            //}

		            if ($scope.level1ExpandChildren[id] == true) {
		                $scope.level1ExpandChildren[id] = false;
		                $scope.children[id] = null;
		            }
		            else {
		                $scope.level1ExpandChildren[id] = true;
		            }

		            $scope.children2 = data;
		            $scope.clickedId2 = id;
		        }
		        else if (FacilityTypeId == 2) //HC Level
		        {
		            //console.log("$scope.level1Expand " + $scope.level1Expand + "\n");
		            //if ($scope.level1Expand == true)
		            //{
		            //    $scope.level1Expand = false;
		            //    $scope.children[id] = null;
		            //}
		            //else
		            //{
		            //    $scope.level1Expand = true;
		            //}


		            if ($scope.level1ExpandChildren[id] == true) {
		                $scope.level1ExpandChildren[id] = false;
		                $scope.children[id] = null;
		            }
		            else {
		                $scope.level1ExpandChildren[id] = true;
		            }

		            $scope.children2 = data;
		            $scope.clickedId2 = id;
		        }
		        else {
		            $scope.level1Expand = false;
		            $scope.children[id] = null;
		            //console.log("$scope.level1Expand " + $scope.level1Expand + "\n");

		        }
		    }
		    else if (level == 2) {
		        //console.log("Id=" + id + " FacilityType=" + FacilityTypeId + "  Level=" + level);
		        if (FacilityTypeId == 8) //Woreda Level
		        {
		            $scope.children3 = data;
		            $scope.clickedId3 = id;

		            //console.log("$scope.children3=" + $scope.children3 + "\n");
		            //console.log("$scope.clickedId3=" + $scope.clickedId3 + "\n");

		            //if ($scope.level2Expand == true)
		            //{
		            //    $scope.level2Expand = false;
		            //    $scope.children[id] = null;
		            //}
		            //else {
		            //    $scope.level2Expand = true;
		            //}


		            if ($scope.level2ExpandChildren[id] == true) {
		                $scope.level2ExpandChildren[id] = false;
		                $scope.children[id] = null;
		            }
		            else {
		                $scope.level2ExpandChildren[id] = true;
		            }

		        }
		        else if (FacilityTypeId == 2) //Health Center Level
		        {
		            $scope.children3 = data;
		            $scope.clickedId3 = id;

		            //if ($scope.level2Expand == true)
		            //{
		            //    $scope.level2Expand = false;
		            //    $scope.children[id] = null;
		            //}
		            //else
		            //{
		            //    $scope.level2Expand = true;
		            //}

		            if ($scope.level2ExpandChildren[id] == true) {
		                $scope.level2ExpandChildren[id] = false;
		                $scope.children[id] = null;
		            }
		            else {
		                $scope.level2ExpandChildren[id] = true;
		            }
		        }
		        else {
		            //$scope.level2Expand = false;
		            $scope.level2ExpandChildren[id] = false;
		        }
		    }
		    else if (level == 3) {
		        if (FacilityTypeId == 2) // Health Center Level
		        {
		            $scope.children4 = data;
		            $scope.clickedId4 = id;

		            $scope.children3 = data;
		            $scope.clickedId3 = id;

		            //if ($scope.level3Expand == true)
		            //{
		            //    $scope.level3Expand = false;
		            //    $scope.children[id] = null;
		            //}
		            //else
		            //{
		            //    $scope.level3Expand = true;
		            //}

		            if ($scope.level3ExpandChildren[id] == true) {
		                $scope.level3ExpandChildren[id] = false;
		                $scope.children[id] = null;
		            }
		            else {
		                $scope.level3ExpandChildren[id] = true;
		            }
		        }

		        else {
		            // $scope.level3Expand = false;
		            $scope.level3ExpandChildren[id] = false;
		        }
		    }
		});
    }

    $scope.getNoParentFacility = function () {
        NoParentFacilityFactory.getNoParentFacilityService()
        .then(function (data) {
            //console.log("Values Data" + data);
            $scope.values = data;
            $scope.NoParentFacility = {
            };
            for (var i = 0; i < $scope.values.length; i++) {
                $scope.NoParentFacility[$scope.values[i].hmiscode] = 1;
            }
        });
    }

    $scope.getNoParentFacility();
});

app.controller('serviceDataEntryCtrl', function ($scope, $http) {

    var serverConfig = HostConfigFactory.getHostConfigServer();
    var clientConfig = HostConfigFactory.getHostConfigClient();

    $http.get(serverConfig + "api/EhmisValues/1")
   .then(function (response) { $scope.names = response.data; });

    $scope.myFunc = function (labelid, value) {
        //alert(labelid + "  " + value);
    };

    $scope.isTrue = false;
});

app.controller('ipdDataEntryCtrl', function ($scope, ipdDataEntryFactory, valuesFactory, siteSettingsFactory) {

    //alert("We are in IPD Controller");			

    $scope.getValues = function (id, locationId, year, month, reportType) {
        valuesFactory.getValuesService(id, locationId, year, month, reportType)
        .then(function (data) {
            //console.log("Values Data" + data);
            $scope.values = data;

            var employees = {};
            $scope.labelidvalues = {};
            for (var i = 0; i < $scope.values.length; i++) {
                if ($scope.values[i].dataEleClass == 2) {
                    $scope.labelidvalues[$scope.values[i].labelId + 'M'] = $scope.values[i].value;
                }
                else {
                    $scope.labelidvalues[$scope.values[i].labelId + 'MM'] = $scope.values[i].value;
                }
            }

            //console.log("labeidvalues = " + $scope.labelidvalues['869M']);
            //console.log("labeidvalues = " + $scope.labelidvalues['869MM']);

        });

    }

    $scope.getIpdDictionary = function () {
        ipdDataEntryFactory.getIPDDictionaryService()
        .then(function (data) {
            $scope.ipdDictionarydata = data;
        });
    }

    $scope.getLocationId = function () {
        siteSettingsFactory.getSiteSettingService(0)
        .then(function (data) {
            $scope.setLocation = data[0];
            $scope.LocationId = $scope.setLocation.LocationId;
        });
    }


    $scope.getLocationId();
    $scope.getValues(0, $scope.LocationId, 2008, 1, 'IPD');
    $scope.getIpdDictionary();
});

app.controller('reportCtrl', function ($scope, ipdReportFactory, siteSettingsFactory) {
    $scope.getIpdReport = function () {
        ipdReportFactory.getIPDReportService()
        .then(function (data) {
            //console.log(data);
            $scope.ipdReportdata = data;

        });
    }

    $scope.getLocationId = function () {
        siteSettingsFactory.getSiteSettingService(0)
        .then(function (data) {
            $scope.setLocation = data[0];
            $scope.LocationId = $scope.setLocation.LocationId;
        });
    }

    $scope.getIpdReport();
});



//app.filter('removeString', function () {
//    return function (text) {
//        var str = text.replace("q`ly total", "");
//        return str;
//    };
//});

app.directive('endOfProgressDirective', function () {
    return function (scope, element, attrs) {
        if (scope.$last) {
            $('.progress').hide();
        }
    };
});

/*
This directive helps us do things at the very end of when an ng-repeat has finished rendering its content..
This might for example help when we need to init the datatables plugin only when all the table rendering is complete
** Joe
*/
app.directive('endOfRepeatDirective', function () {
    return function (scope, element, attrs) {
        if (scope.$last) {
            // note: we further delay the plugin init, as observations indicate angular doesn't immediately have all the markup in place
            // despite us being at the end of the loop :-)
            // ** Joe
            scope.showFacilityTable = true;
            setTimeout(function () {
                $('.progress').hide(); // we are done loading the data, plus rendering plugins...  
                // $("#reportTable").DataTable().api().destroy()
                var table = $('#reportTable').DataTable({
                    destroy: false,
                    dom: 'Brt',
                    "bSort": false,
                    paging: false,
                    "bRetrieve": true,
                    searching: true,
                    buttons: [
                        'copyHtml5', // copy table content to clipboard
                        'excelHtml5', // export table to excel
                        'csvHtml5', // export to csv
                        'pdfHtml5' // export to pdf
                    ]
                });

                //table.ajax.reload();

            }, 10);
        }
    };
});
