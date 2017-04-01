app.controller('SiteSettingCtrl', function ($scope, headFacilityFactory, customReportFactory, childrenFactory,
mainLocationSaveFactory, siteSettingsFactory, hierarchyFactory, NoParentFacilityFactory) {
    headFacilityFactory.getlist()
      .then(function (data) {
          $scope.regionLevel = data;
      });
});

app.controller('locationCtrl', function ($scope, headFacilityFactory, customReportFactory, childrenFactory, mainLocationSaveFactory, siteSettingsFactory, hierarchyFactory, NoParentFacilityFactory) {
		headFacilityFactory.getlist()
		  .then(function(data){
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

		$scope.getCustomReport = function (parameters) {
		    $scope.customReportColumns = {};
		    $scope.customReportData = {};
		    $scope.customReportColumns = null;
		    $scope.customReportData = null;
		    customReportFactory.getCustomReportService(parameters)
            .then(function (data) {
                console.log(data);
                $scope.customReportColumns = data[0];
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

                console.log(data);
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

		$scope.customReportRequested = function () {
		    
		    console.log($scope.Period);
		    console.log($scope.ReportType);
		    console.log($scope.FiscalYear);           

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
		    else if (Object.keys($scope.checkedFacilities).length === 0)
		    {
		        alert("Please select at least one facility!");
		    }
		    else
		    {
		        // Construct the JSON parameters
		        // var car = {type:"Fiat", model:"500", color:"white"};
		        var reportParameters = {"Period": $scope.Period, "ReportType": $scope.ReportType, 
		            "FiscalYear": $scope.FiscalYear, "StartPeriod": $scope.StartPeriod, "EndPeriod": $scope.EndPeriod,
                    "Location": $scope.checkedFacilities
		        };

		        //var allCustomReportParameters = [];
		        //allCustomReportParameters.push(reportParameters);
		        //allCustomReportParameters.push($scope.checkedFacilities);

		        $scope.showReport = true;
		        $('.progress').show();
		        $scope.getCustomReport(reportParameters);		                        		        
		    }
		}

    /*Joe: contrasting with use of datatables for direct rendering of tables...*/
		$scope.customReportRequested_alt = function () {

		    console.log($scope.Period);
		    console.log($scope.ReportType);
		    console.log($scope.FiscalYear);

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
            if ($scope.checkedFacilities[id] == 1)
            {
                delete $scope.checkedFacilities[id];
            }           
        }
    }

    $scope.getSiteSetting = function (id) {
        siteSettingsFactory.getSiteSettingService(id)
		.then(function (data) {
		    $scope.setLocation = data[0];
		    //alert("getSiteSetting called!! locationId is: " + $scope.setLocation.LocationId);
		    console.log("$scope.setLocation=" + $scope.setLocation.LocationId);
		    $scope.LocationId = $scope.setLocation.LocationId;

		    $scope.getHierarchy = function (id) {
		        hierarchyFactory.getHierarchyService(id)
                .then(function (data) {
                    $scope.hierarchy = data;
                    console.log("$scope.hierarchy=" + $scope.hierarchy);
                });
		    }
		    console.log("$scope.LocationId=" + $scope.LocationId);
		    $scope.getHierarchy($scope.LocationId);

		    $scope.getLevel0 = function () {
		        childrenFactory.getChildrenService($scope.LocationId)
                .then(function (data) {
                    $scope.children0 = data;
                    console.log("$scope.children0=" + $scope.children0);
                });
		    }

		    $scope.getLevel0();
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
            alert("No Facility Selected! Please select a facility!");            
        }
        mainLocationSaveFactory.saveMainLocationIdService(id)
		.then(function (data) {
		    $scope.hierarchy = data;
		    alert("Site Set Successfully To: " + $scope.hierarchy[0].FacilityName)
		    location.reload();
		    //$scope.getSiteSetting(0);	
		});
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

    $scope.getChildren = function (id, FacilityTypeId, level, facilityName) {
        childrenFactory.getChildrenService(id)
		.then(function (data) {

		    $scope.selectedFacilityName = facilityName;
		    $scope.mainLocationIdToSet = id;

		    if (FacilityTypeId != 11) {
		        console.log("Id=" + id + " FacilityType=" + FacilityTypeId + "  Level=" + level);

		        $scope.children[id] = data;
		        console.log("$scope.children[id] " + $scope.children[id] + "\n");
		    }

		    if ((FacilityTypeId == 10) || (level == 0))// Region Level or other Top Level
		    {
		        //console.log("$scope.level0Expand " + $scope.level0Expand  + "\n");
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

		        console.log("$scope.level0Expand " + $scope.level0Expand + "\n");
		        console.log("$scope.level0ExpandChildren[id] " + $scope.level0ExpandChildren[id] + "\n");

		        $scope.children1 = data;
		        $scope.clickedId1 = id;
		    }
		    else if (level == 1) {
		        console.log("$scope.level0Expand " + $scope.level1Expand + "\n");

		        if (FacilityTypeId == 9) // Zone Level
		        {
		            console.log("$scope.level0Expand " + $scope.level1Expand + "\n");
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
		            console.log("$scope.level0Expand " + $scope.level1Expand + "\n");
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
		            console.log("$scope.level1Expand " + $scope.level1Expand + "\n");
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
		            console.log("$scope.level1Expand " + $scope.level1Expand + "\n");

		        }
		    }
		    else if (level == 2) {
		        console.log("Id=" + id + " FacilityType=" + FacilityTypeId + "  Level=" + level);
		        if (FacilityTypeId == 8) //Woreda Level
		        {
		            $scope.children3 = data;
		            $scope.clickedId3 = id;

		            console.log("$scope.children3=" + $scope.children3 + "\n");
		            console.log("$scope.clickedId3=" + $scope.clickedId3 + "\n");

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
            console.log("Values Data" + data);
            $scope.values = data;
            $scope.NoParentFacility = {};
            for (var i = 0; i < $scope.values.length; i++) {
                $scope.NoParentFacility[$scope.values[i].hmiscode] = 1;
            }
        });
    }

    $scope.getNoParentFacility();
});

app.controller('serviceDataEntryCtrl', function ($scope, $http) {
    $http.get("http://localhost:4636/api/EhmisValues/1")
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
            console.log("Values Data" + data);
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

            console.log("labeidvalues = " + $scope.labelidvalues['869M']);
            console.log("labeidvalues = " + $scope.labelidvalues['869MM']);

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
            console.log(data);
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



app.filter('removeString', function () {
    return function (text) {
        var str = text.replace("q`ly total", "");
        return str;
    };
});

/*
This directive helps us do things at the very end of when an ng-repeat has finished rendering its content..
This might for example help when we need to init the datatables plugin only when all the table rendering is complete
** Joe
*/
app.directive('endOfRepeatDirective', function () {
    return function(scope, element, attrs) {        
        if (scope.$last) {
            // note: we further delay the plugin init, as observations indicate angular doesn't immediately have all the markup in place
            // despite us being at the end of the loop :-)
            // ** Joe
            setTimeout(function () {
                $('#reportTable').DataTable({
                    destroy: true,
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
            }, 3000);
        }
    };
})
