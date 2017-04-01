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

app.controller('addFacilityCtrl', function ($scope, myService, siteSettingsFactory, LanguageFactory) {
    $scope.ReportingLevel = "";

    var className = "manageFacilities";
    var lang = $scope.languageSet;

    $scope.manageFacilities = {};

    $scope.getLanguageLabel = function (lang, className) {
        LanguageFactory.getLanguageLabelService(lang, className)
		.then(function (data) {
		    $scope.values = data;

		    for (var i = 0; i < $scope.values.length; i++) {
		        $scope.manageFacilities[$scope.values[i].indexName] = $scope.values[i].LanguageName;
		    }

		    $scope.ReportingLevel = $scope.manageFacilities['reportingLevel']; 
		})
    }

    lang = localStorage.getItem('languageSet', 'english');

    $scope.getLanguageLabel(lang, className);

    $scope.zoneNames = [];
    $scope.regionNames = [];
    $scope.woredaNames = [];
    $scope.institutionTypes = [];
    $scope.facilityOwners = []
    $scope.reportingLevels = [];
    $scope.contentTypes = [];
    $scope.CopyReportingLevel = [];    
    $scope.showHealthTypeOption = false;
    $scope.selectedFacility = temphierarchy[0];
    if($scope.selectedFacility != undefined)
    $scope.$watch($scope.selectedFacility.HMISCode, function (v) {
        if (v != undefined) {
            $scope.Populate($scope.selectedFacility.HMISCode)
        }
    });
    $scope.Populate = function(locationId)
    {
        myService.getSpecificFacilities(1, temphierarchy[0].HMISCode)
    .then(function (data) {
        var length = data.length;
        var facility = data[0];
        var valueobj;
        if (facility == "Federal") // Federal LEvel
        {
            $scope.regions = data[1];
            for (var i = 0; i < $scope.regions.length ; i++) {
                var valueobj = { name: $scope.regions[i].FacilityName, code: $scope.regions[i].HMISCode };
                $scope.regionNames.push(valueobj);
            }
            $scope.selectedRegion = $scope.regionNames[0];
            if (length == 6) {
                $scope.zones = data[2];
                for (var i = 0; i < $scope.zones.length ; i++) {
                    var valueobj = { name: $scope.zones[i].FacilityName, code: $scope.zones[i].HMISCode };
                    $scope.zoneNames.push(valueobj);
                }
                $scope.institutionType = data[5];
                for (var i = 0; i < $scope.institutionType.length ; i++) {
                    valueobj = { name: $scope.institutionType[i].FacilityTypeName, code: $scope.institutionType[i].FacilityTypeId };
                    $scope.institutionTypes.push(valueobj);
                }

                $scope.facilityOwner = data[4];
                for (var i = 0; i < $scope.facilityOwner.length ; i++) {
                    valueobj = { name: $scope.facilityOwner[i].FacilityOwnerName, code: $scope.facilityOwner[i].FacilityOwnerId };
                    $scope.facilityOwners.push(valueobj);
                }
                $scope.reporting = data[3];
                for (var i = 0; i < $scope.reporting.length ; i++) {
                    valueobj = { name: $scope.reporting[i], code: i };
                    $scope.reportingLevels.push(valueobj);
                }
            }
            else {
                $scope.woreda = data[2];
                for (var i = 0; i < $scope.woreda.length ; i++) {
                    var valueobj = { name: $scope.woreda[i].FacilityName, code: $scope.woreda[i].HMISCode };
                    $scope.woredaNames.push(valueobj);
                }
                var valueobj = { name: data[3], code: 0 };
                $scope.zoneNames.push(valueobj);
                $scope.selectedZone = $scope.zoneNames[0];
                $scope.institutionType = data[6];
                for (var i = 0; i < $scope.institutionType.length ; i++) {
                    valueobj = { name: $scope.institutionType[i].FacilityTypeName, code: $scope.institutionType[i].FacilityTypeId };
                    $scope.institutionTypes.push(valueobj);
                }

                $scope.facilityOwner = data[5];
                for (var i = 0; i < $scope.facilityOwner.length ; i++) {
                    valueobj = { name: $scope.facilityOwner[i].FacilityOwnerName, code: $scope.facilityOwner[i].FacilityOwnerId };
                    $scope.facilityOwners.push(valueobj);
                }
                $scope.reporting = data[4];
                for (var i = 0; i < $scope.reporting.length ; i++) {
                    var j = i;
                    if (i = 2)
                    {
                        j = 3;
                    }
                    valueobj = { name: $scope.reporting[i], code: j };
                    $scope.reportingLevels.push(valueobj);
                }
            }
            $scope.CopyReportingLevel = $scope.reportingLevels;
        }
        else if (facility == "Region") // Regional Level
        {
            var length = data.length;
            if (length == 6) // Regional Level
            {
                //region
                $scope.region = data[2];
                var valueobj = { name: $scope.region[0], code: $scope.region[1] };
                $scope.regionNames.push(valueobj);
                $scope.selectedRegion = $scope.regionNames[0];
                //Zone
                $scope.zones = data[3];
                for (var i = 0; i < $scope.zones.length ; i++) {
                    var valueobj = { name: $scope.zones[i].FacilityName, code: $scope.zones[i].HMISCode };
                    $scope.zoneNames.push(valueobj);
                }
                $scope.reporting = data[1];
                for (var i = 0; i < $scope.reporting.length ; i++) {
                    var j = i + 1;
                    var valueobj = { name: $scope.reporting[i], code: j };
                    $scope.reportingLevels.push(valueobj);
                }
                $scope.institutionType = data[5];
                for (var i = 0; i < $scope.institutionType.length ; i++) {
                    valueobj = { name: $scope.institutionType[i].FacilityTypeName, code: $scope.institutionType[i].FacilityTypeId };
                    $scope.institutionTypes.push(valueobj);
                }

                $scope.facilityOwner = data[4];
                for (var i = 0; i < $scope.facilityOwner.length ; i++) {
                    valueobj = { name: $scope.facilityOwner[i].FacilityOwnerName, code: $scope.facilityOwner[i].FacilityOwnerId };
                    $scope.facilityOwners.push(valueobj);
                }
            }
            else if (length == 7) // No Zones
            {
                //region
                $scope.region = data[3];
                var valueobj = { name: $scope.region[0], code: $scope.region[1] };
                $scope.regionNames.push(valueobj);
                $scope.selectedRegion = $scope.regionNames[0];

                $scope.noZone = data[1];
                var valueobj = { name: $scope.noZone, code: 0 };
                $scope.zoneNames.push(valueobj);
                $scope.selectedZone = $scope.zoneNames[0];

                $scope.woreda = data[4];
                for (var i = 0; i < $scope.woreda.length; i++) {
                    valueobj = { name: $scope.woreda[i].FacilityName, code: $scope.woreda[i].HMISCode }
                    $scope.woredaNames.push(valueobj);
                }

                $scope.reporting = data[2];
                for (var i = 0; i < $scope.reporting.length ; i++) {
                    var j = i + 1;
                    if (i = 1)
                    {
                        j = 3;
                    }
                    var valueobj = { name: $scope.reporting[i], code: j };
                    $scope.reportingLevels.push(valueobj);
                }
                $scope.institutionType = data[6];
                for (var i = 0; i < $scope.institutionType.length ; i++) {
                    valueobj = { name: $scope.institutionType[i].FacilityTypeName, code: $scope.institutionType[i].FacilityTypeId };
                    $scope.institutionTypes.push(valueobj);
                }

                $scope.facilityOwner = data[5];
                for (var i = 0; i < $scope.facilityOwner.length ; i++) {
                    valueobj = { name: $scope.facilityOwner[i].FacilityOwnerName, code: $scope.facilityOwner[i].FacilityOwnerId };
                    $scope.facilityOwners.push(valueobj);
                }

            }
            $scope.CopyReportingLevel = $scope.reportingLevels;
        }
        else if (facility == "Woreda") // Woreda Level, Health Center 
        {
            //Region
            $scope.region = data[1];
            valueobj = { name: $scope.region[0].ReportingRegionName, code: $scope.region[0].RegionId };
            $scope.regionNames.push(valueobj);
            $scope.selectedRegion = $scope.regionNames[0];
            //Zone
            valueobj = { name: $scope.region[0].ZoneName, code: $scope.region[0].ZoneId };
            $scope.zoneNames.push(valueobj);
            $scope.selectedZone = $scope.zoneNames[0];
            //Woreda
            valueobj = { name: $scope.region[0].WoredaName, code: $scope.region[0].HMISCode };
            $scope.woredaNames.push(valueobj);
            $scope.selectedWoreda = $scope.woredaNames[0];

            $scope.institutionType = data[2];
            for (var i = 0; i < $scope.institutionType.length ; i++) {
                valueobj = { name: $scope.institutionType[i].FacilityTypeName, code: $scope.institutionType[i].FacilityTypeId };
                $scope.institutionTypes.push(valueobj);
            }

            $scope.facilityOwner = data[3];
            for (var i = 0; i < $scope.facilityOwner.length ; i++) {
                valueobj = { name: $scope.facilityOwner[i].FacilityOwnerName, code: $scope.facilityOwner[i].FacilityOwnerId };
                $scope.facilityOwners.push(valueobj);
            }

            $scope.reporting = data[4];
            for (var i = 0; i < $scope.reporting.length ; i++) {
                var j = i + 3;
                var valueobj = { name: $scope.reporting[i], code : j };
                $scope.reportingLevels.push(valueobj);
            }

            $scope.CopyReportingLevel = $scope.reportingLevels;
        }
        else if (facility == "HealthCenter") {
            $scope.region = data[1];
            valueobj = { name: $scope.region[0].ReportingRegionName, code: $scope.region[0].RegionId };
            $scope.regionNames.push(valueobj);
            $scope.selectedRegion = $scope.regionNames[0];

            valueobj = { name: $scope.region[0].ZoneName, code: $scope.region[0].ZoneId };
            $scope.zoneNames.push(valueobj);
            $scope.selectedZone = $scope.zoneNames[0];

            valueobj = { name: $scope.region[0].WoredaName, code: $scope.region[0].WoredaId };
            $scope.woredaNames.push(valueobj);
            $scope.selectedWoreda = $scope.woredaNames[0];

            valueobj = { name: $scope.region[0].FacilityName, code: $scope.region[0].HMISCode };
            $scope.reportingLevels.push(valueobj);

            valueobj = { name: data[2], code: 3 };
            $scope.institutionTypes.push(valueobj);
            $scope.selectedInstitutionType = $scope.institutionTypes[0];

            $scope.contents = data[3];
            $scope.contentTypes = [];
            for (var i = 0; i < $scope.contents.length ; i++) {
                valueobj = { name: $scope.contents[i].HealthPostTypeName, code: $scope.contents[i].HealthPostTypeId };
                $scope.contentTypes.push(valueobj);
            }

            $scope.facilityOwner = data[4];
            $scope.facilityOwners = [];
            for (var i = 0; i < $scope.facilityOwner.length ; i++) {
                valueobj = { name: $scope.facilityOwner[i].FacilityOwnerName, code: $scope.facilityOwner[i].FacilityOwnerId };
                $scope.facilityOwners.push(valueobj);
            }
            $scope.ReportingLevel = data[5];
            $scope.healthType = "Health Post Type";
            $scope.showHealthTypeOption = true;
            $scope.healthPostChosen = true;

        }
        else if (facility == "Zone")// if zone is clicked and zoneid is changed.
        {
            $scope.region = data[1];
            valueobj = { name: $scope.region[0].ReportingRegionName, code: $scope.region[0].RegionId };
            $scope.regionNames.push(valueobj);
            $scope.selectedRegion = $scope.regionNames[0];

            valueobj = { name: $scope.region[0].ZoneName, code: $scope.region[0].ZoneId };
            $scope.zoneNames.push(valueobj);
            $scope.selectedZone = $scope.zoneNames[0];

            $scope.woredas = data[2];
            $scope.woredaNames = [];
            for (var i = 0; i < $scope.woredas.length ; i++) {
                valueobj = { name: $scope.woredas[i].FacilityName, code: $scope.woredas[i].HMISCode };
                $scope.woredaNames.push(valueobj);
            }
            $scope.institutionType = data[4];
            for (var i = 0; i < $scope.institutionType.length ; i++) {
                valueobj = { name: $scope.institutionType[i].FacilityTypeName, code: $scope.institutionType[i].FacilityTypeId };
                $scope.institutionTypes.push(valueobj);
            }
            $scope.facilityOwner = data[3];
            for (var i = 0; i < $scope.facilityOwner.length ; i++) {
                valueobj = { name: $scope.facilityOwner[i].FacilityOwnerName, code: $scope.facilityOwner[i].FacilityOwnerId };
                $scope.facilityOwners.push(valueobj);
            }
            $scope.reporting = data[5];
            for (var i = 0; i < $scope.reporting.length ; i++) {
                var j = i + 2;
                var valueobj = {
                    name: $scope.reporting[i], code: j
                };
                $scope.reportingLevels.push(valueobj);
            }
            $scope.CopyReportingLevel = $scope.reportingLevels;
        }
    });
    }
   
   
    $scope.SelectNextLevel = function (selectedNextLevel, selectedPreviousLevel)
    {
        $scope.ReportingLevel = $scope.manageFacilities['reportingLevel'];

        $scope.showHealthTypeOption = false;
        if (selectedNextLevel.code == 1 || selectedNextLevel.code == 2 || selectedNextLevel.code == 3 || selectedNextLevel.code == 5 || selectedNextLevel.code == 7) {
            myService.getSpecificFacilities(4, selectedNextLevel.code, selectedPreviousLevel.code)
                .then(function (data) {

                    $scope.showHealthTypeOption = true;
                    $scope.healthType = data[0];
                    $scope.contents = data[1];

                    if ($scope.healthType == "Hospital") {
                        $scope.contentTypes = [];
                        for (var i = 0; i < $scope.contents.length ; i++) {
                            valueobj = { name: $scope.contents[i].HospitalTypeName, code: $scope.contents[i].HospitalTypeId };
                            $scope.contentTypes.push(valueobj);
                        }
                        $scope.hospitalChosen = true;
                        $scope.healthCenterChosen = false;
                        $scope.healthPostChosen = false;

                    }
                    else if ($scope.healthType == "Health Center Type") {
                        $scope.contentTypes = [];
                        for (var i = 0; i < $scope.contents.length ; i++) {
                            valueobj = { name: $scope.contents[i].HealthCentreTypeName, code: $scope.contents[i].HealthCentreTypeId };
                            $scope.contentTypes.push(valueobj);
                        }
                        $scope.healthCenterChosen = true;
                        $scope.healthPostChosen = false;
                        $scope.hospitalChosen = false;
                    }
                    else if ($scope.healthType == "Health Post Type") {
                        $scope.contentTypes = [];
                        for (var i = 0; i < $scope.contents.length ; i++) {
                            valueobj = { name: $scope.contents[i].HealthPostTypeName, code: $scope.contents[i].HealthPostTypeId };
                            $scope.contentTypes.push(valueobj);
                        }
                        $scope.ReportingLevel = data[2];
                        $scope.reportingHealthCenter = data[3];
                        $scope.reportingLevels = [];
                        for (var i = 0; i < $scope.reportingHealthCenter.length ; i++) {
                            valueobj = { name: $scope.reportingHealthCenter[i].FacilityName, code: $scope.reportingHealthCenter[i].HMISCode };
                            $scope.reportingLevels.push(valueobj);
                        }
                        $scope.healthPostChosen = true;
                        $scope.healthCenterChosen = false;
                        $scope.hospitalChosen = false;
                    }
                });
        }
        else {

            $scope.reportingLevels = [];
            $scope.reportingLevels = $scope.CopyReportingLevel;
            $scope.healthPostChosen = false;
            $scope.healthCenterChosen = false;
            $scope.hospitalChosen = false;

        }
       
    }
    $scope.SelectCorrspondingZone = function (regionID)
    {
        if (regionID != undefined)
        {
        $scope.zoneNames = [];
        $scope.woredaNames = [];
        $scope.reportingLevels = [];
        //$scope.reportingLevels = [];
        myService.getSpecificFacilities(1, $scope.selectedFacility.HMISCode, regionID.code)
        .then(function (data) {

            var length = data.length;
            if (length == 5) // Regional Level
            {
                //Zone
                $scope.zones = data[1];
                for (var i = 0; i < $scope.zones.length ; i++) {
                    var valueobj = { name: $scope.zones[i].FacilityName, code: $scope.zones[i].HMISCode };
                    $scope.zoneNames.push(valueobj);
                }
                $scope.reporting = data[2];
                for (var i = 0; i < $scope.reporting.length ; i++) {
                    var valueobj = { name: $scope.reporting[i], code : i };
                    $scope.reportingLevels.push(valueobj);
                }
            }
            else if (length == 6) // No Zones
            {
                //region
                $scope.noZone = data[2];
                var valueobj = { name: $scope.noZone, code: 0 };
                $scope.zoneNames.push(valueobj);
                $scope.selectedZone = $scope.zoneNames[0];

                $scope.woreda = data[1];
                for (var i = 0; i < $scope.woreda.length; i++) {
                    valueobj = { name: $scope.woreda[i].FacilityName, code: $scope.woreda[i].HMISCode }
                    $scope.woredaNames.push(valueobj);
                }
                $scope.reporting = data[3];
                for (var i = 0; i < $scope.reporting.length ; i++) {
                    var j = i;
                    if (i = 2)
                    {
                        j = 3;
                    }
                    var valueobj = { name: $scope.reporting[i], code: j };
                    $scope.reportingLevels.push(valueobj);
                }

            }
        });
        }
    }

    $scope.SelectCorrspondingWoreda = function (zoneID)
    {
        if (zoneID != undefined)
        {
            myService.getSpecificFacilities(1, zoneID.code, undefined)
            .then(function (data) {
                $scope.woredas = data[2];
                $scope.woredaNames = [];
                for (var i = 0; i < $scope.woredas.length ; i++) {
                    valueobj = { name: $scope.woredas[i].FacilityName, code: $scope.woredas[i].HMISCode };
                    $scope.woredaNames.push(valueobj);
                }
                $scope.institutionTypes = [];
                $scope.institutionType = data[4];
                for (var i = 0; i < $scope.institutionType.length ; i++) {
                    valueobj = { name: $scope.institutionType[i].FacilityTypeName, code: $scope.institutionType[i].FacilityTypeId };
                    $scope.institutionTypes.push(valueobj);
                }
                $scope.facilityOwner = data[3];
                $scope.facilityOwners = [];
                for (var i = 0; i < $scope.facilityOwner.length ; i++) {
                    valueobj = { name: $scope.facilityOwner[i].FacilityOwnerName, code: $scope.facilityOwner[i].FacilityOwnerId };
                    $scope.facilityOwners.push(valueobj);
                }
                //  $scope.ReportingLevel = data[4];
            });
        }
    }
    $scope.insertNewInstitution = function (institutionName, region, zone, woreda, institutionType, facilityOwner, reportingLevel, healthType)
    {
        if(institutionName == undefined || institutionName == "")
        {
            alert($scope.manageFacilities['pleaseEnterAFacilityName']);
        }
        else if (region == undefined || region == "")
        {
            alert($scope.manageFacilities['pleaseEnterARegion']);
        }
        else if (zone == undefined || zone == "")
        {
            alert($scope.manageFacilities['pleaseEnterAZone']);
        }
        else if (woreda == undefined || woreda == "")
        {
            alert($scope.manageFacilities['pleaseEnterAWoreda']);
        }
        else if (institutionType == undefined || institutionType == "")
        {
            alert($scope.manageFacilities['pleaseEnterAFacilityType']);
        }
        else if (facilityOwner == undefined || facilityOwner == "")
        {
            alert($scope.manageFacilities['pleaseEnterAFacilityOwner']);
        }
        else if (reportingLevel == undefined || reportingLevel == "")
        {
            if ($scope.healthPostChosen)
            {
                alert($scope.manageFacilities['pleaseChooseAReportingHealthCenter']);
            }
           else
            {
                alert($scope.manageFacilities['pleaseChooseAReportingLevel']);
            }
           
        }
       else if (healthType == undefined || healthType == "")
       {
           if ($scope.healthPostChosen)
           {
               alert($scope.manageFacilities['pleaseChooseAHealthPostType']);
           }
           if ($scope.healthCenterChosen)
           {
               alert($scope.manageFacilities['pleaseChooseAHealthCenterType']); 
           }
           if ($scope.hospitalChosen)
           {
               alert($scope.manageFacilities['pleaseChooseAHospitalType']);
           }
       }
       
          if (healthType == undefined)
           {
               healthType = 0;
           }
           var value = {
               "InstitutionName": institutionName, "Region": region.code, "Zone": zone.code, "Woreda": woreda.code,
               "InstitutionType": institutionType.code, "FacilityOwner": facilityOwner.code, "ReportingLevel": reportingLevel.code,
               "HealthType": healthType.code, "HospitalChosen": $scope.hospitalChosen, "HCChosen": $scope.healthCenterChosen,
               "HPChosen": $scope.healthPostChosen
           };
           myService.PostNewInstitution(value)
           .then(function (response) {
               if (response.data == true) {
                   alert($scope.manageFacilities['youHaveSuccessfullyAddedFacility'] +  ":  " + institutionName);
               }
               else {
                   alert($scope.manageFacilities['facilityAddingCannotHappen']);
               }
           });
       
      
    }
});