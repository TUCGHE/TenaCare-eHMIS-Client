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

app.controller('analyticsCtrl', function ($scope, $timeout, AnalyticsFactory, AnalyticsFilterFactory,
    childrenFactory, NoParentFacilityFactory, siteSettingsFactory,
    hierarchyFactory, commonHierarchyService, LanguageFactory) {

    var className = "analytics";
    var lang = $scope.languageSet;

    $scope.analytics = {};

    $scope.getLanguageLabel = function (lang, className) {
        LanguageFactory.getLanguageLabelService(lang, className)
		.then(function (data) {
		    $scope.values = data;

		    for (var i = 0; i < $scope.values.length; i++) {
		        $scope.analytics[$scope.values[i].indexName] = $scope.values[i].LanguageName;
		    }
		})
    }

    lang = localStorage.getItem('languageSet', 'english');

    $scope.getLanguageLabel(lang, className);

    //from LocationCtrl
    $scope.level0Expand = false;
    $scope.level1Expand = false;
    $scope.level2Expand = false;
    $scope.level3Expand = false;
    $scope.children = {};
    $scope.level0ExpandChildren = {};
    $scope.level1ExpandChildren = {};
    $scope.level2ExpandChildren = {};
    $scope.level3ExpandChildren = {};
    var tmp = localStorage.getItem('tempLocationId', undefined);
    if (tmp != undefined) {
        $scope.tempLocationId = tmp;
    }

    $scope.getSiteSetting = function (id) {
        siteSettingsFactory.getSiteSettingService(id)
		.then(function (data) {
		    $scope.setLocation = data[0];
		   
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
    $scope.getSiteSetting(0);
    //end

    $scope.serviceClicked = false;
    $scope.diseaseClicked = false;
    $scope.indicatorClicked = false;
    $scope.level1ExpandChildren = [];
    $scope.level1ExpandIndicator = [];
    $scope.category1 = [];
    $scope.category2 = [];
    $scope.category3 = [];
    $scope.category4 = [];
    $scope.indicatorCategory1 = [];
    $scope.indicatorCategory2 = [];
    $scope.indicatorCategory3 = [];
    $scope.indicatorCategory4 = [];
    $scope.checkedState = {};
    $scope.checkedStateDataElements = {};
    $scope.checkedIndicatorState = {};
    $scope.parentServiceChecked = true;
    $scope.parentIndicatorChecked = true;
    $scope.reportVisible = false;
    $scope.interfaceVisibility = "showParameters";
    $scope.finishDrillDown = true;
    $scope.levelData = {};
    $scope.searchTextData = { "data": "" };

    $scope.showItemsPerPage = 1000;
    $scope.entriesToShow = 1000;
    $scope.searchedReportSize = 1000;
    $scope.limitedData = 1000;
    $scope.sortKey = null;
    $scope.reverse = false;
    $scope.diseaseDataElementsArray = [];
    //$scope.filteredDiseaseDataElementsArray = [];
    $scope.dataElementsArray = [];
    //$scope.filteredDataElementsArray = [];
    $scope.indicatorsArray = [];
    //$scope.filteredIndicatorsArray = [];
    //$scope.filteredData = {};
    $scope.diseaseOptions = {};
    $scope.checkedFacTypes = {};
    $scope.checkReportingFacTypes = {};
    $scope.facType = [];
    $scope.clickedFileName = "1fmoh.png";
    $scope.chartData = [];
    $scope.chartData2 = [];
    $scope.drillDownReportData = [];
    $scope.chartName = { "Name": "" };
    $scope.hierarchicalData = [];
    $scope.showall = false;

    $scope.progress = { "reportProgress": false };

    $scope.PeriodSelect = {
        "StartFiscalYear": undefined,
        "EndFiscalYear": undefined,
        "StartMonth": undefined,
        "EndMonth": undefined,
        "StartQuarter": undefined,
        "EndQuarter": undefined,
        "aggregate": false,
        "aggregateAll": false
    }

    $scope.institutionAggrOptions = {
        "aggrType": undefined,
        "hmiscode": {},
        "facilityTypeId": {},
        "reportingFacilityTypeId": {}
    };

    $scope.facilityTypeOptions = {};
    $scope.PeriodRange = {
        "range": ""
    };

    $scope.pivotType = {
        "type": "row"
    }

    $scope.indicatorPivotType = {
        "type": "indicator"
    }

    $scope.serviceElements = {
        "type": "new"
    }

    $scope.currentClicked =
                         {
                             "service": {},
                             "disease": {},
                             "indicator": {}
                         };

    $scope.currentClicked.service = false;
    $scope.currentClicked.disease = false;
    $scope.currentClicked.indicator = false;

    $scope.filteredData =
                        {
                            "filteredCustomReportData": [],
                            "filteredDiseaseDataElementsArray": [],
                            "filteredDataElementsArray": [],
                            "filteredIndicatorsArray": []
                        };

    $scope.selectedAxis =
                       {
                           "xAxis": "",
                           "yAxis": "",
                           "AggregationType": "",
                           "ChartType": "",
                           "GroupBy": ""
                       };

    $scope.selectedPreviousAxis =
                      {
                          "xAxis": "",
                          "yAxis": ""
                      };

    $scope.getFacilityType = function () {
        AnalyticsFactory.getFacilityTypeService()
          .then(function (data) {
              $scope.FacilityTypeData = data;
          });
    }

    $scope.getFacilityType();

    $scope.checkFacilityTypes = function (facilityType) {
        if (!$scope.checkedFacTypes[facilityType]) {
            delete $scope.checkedFacTypes[facilityType];
        }
    }

    $scope.checkReportingFacilityTypes = function (facilityType) {
        if (!$scope.checkReportingFacTypes[facilityType]) {
            delete $scope.checkReportingFacTypes[facilityType];
        }
    }

    $scope.aggregateSet = function () {
        if ($scope.PeriodSelect.aggregate) {
            if ($scope.PeriodSelect.aggregateAll) {
                $scope.PeriodSelect.aggregateAll = false;
            }
        }
    }

    $scope.aggregateAllSet = function () {
        if ($scope.PeriodSelect.aggregateAll) {
            if ($scope.PeriodSelect.aggregate) {
                $scope.PeriodSelect.aggregate = false;
            }
        }
    }

    $scope.exportFile = function () {
        var analyticsParameters = {
            "dataElements": $scope.elementArray, "dataElementsPivot": $scope.pivotType.type, "reportType": $scope.reportType,
            "DiseaseOptions": $scope.diseaseOptions, "InstitutionAggrOptions": $scope.institutionAggrOptions,
            "PeriodSelect": $scope.PeriodSelect, "FacilityTypes": $scope.checkedFacTypes, "PeriodRange": $scope.PeriodRange.range,
            "UserId": JSON.parse(Cookies.get('logged-in')).UserId, "serviceElementType": $scope.serviceElements.type,
            "LocationIDs": $scope.SelectedLocationId,
            "FilterFacilityType": $scope.SelectedLocationFacilityType,
        };

        var showProgress = function () {
            $scope.progress.reportProgress = true;
            $('.progress').show();
        }

        $timeout(showProgress, 0);

        AnalyticsFactory.getExportFileService(analyticsParameters)
        .then(function (response) {
            var headers = response.headers();
            var type = headers['content-type'] || "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
            var filename = headers['X-Filename'] || "download.xlsx";
            var data = response.data;

            var blob = new Blob([data], { type: type });
            saveAs(blob, filename);

            var hideProgress = function () {
                $scope.progress.reportProgress = false;
                $('.progress').hide();
            }

            $timeout(hideProgress, 1000);

           
        });
    }


    var setLevelData = function () {
        $scope.levelData = {
            "data": [],
            "columns":[],
            "xAxis": "",
            "yAxis": "",
            "aggrType": "",
            "facilityTypeId": -1,
            "hmiscode": "",
            "reportingFacilityTypeId": -1
        }
    }  
  
    $scope.setFilteredData = function () {
        //console.log("Passed Filtered Object Length: " + filteredObject.length);
        //console.log("Global Filtered Object Length: " + $scope.filteredData.filteredCustomReportData.length);
        //AnalyticsFilterFactory.setfilteredCustomData($scope.filteredData.filteredCustomReportData);
        window.cachedTableData = $scope.filteredData.filteredCustomReportData;
        //console.log("Windows Cached Table Data: " + window.cachedTableData.length);
        //return 
    }

    $scope.sort = function (keyname) {
        //$scope.sortKey = keyname;   //set the sortKey to the param passed
        
        //$scope.reverse = ($scope.sortKey === keyname) ? !$scope.reverse : false;
               
        for (var i = 0; i < $scope.customReportColumnsLanguage.length; i++) {
            if ($scope.customReportColumnsLanguage[i] == keyname)
            {
                $scope.sortKey = $scope.customReportColumns[i];
                $scope.reverse = ($scope.sortKey === $scope.customReportColumns[i]) ? !$scope.reverse : false;
                break;
            }
        }
    }

    $scope.refreshPage = function (entriesToShow) {
        //$scope.showItemsPerPage = entriesToShow;
        $scope.limitedData = entriesToShow;
    }

    $scope.checkShowAll = function (showAll) {
        //if (showAll) {
        //$scope.showItemsPerPage = $scope.searchedReportSize;
        //$scope.entriesToShow = $scope.searchedReportSize;
        $scope.limitedData = $scope.searchedReportSize;
        $scope.entriesToShow = $scope.searchedReportSize;
        //}
        //else {
        //    $scope.showItemsPerPage = 500;
        //    $scope.entriesToShow = 500;
        //}
    }

    $scope.showAllPages = function () {
        $scope.limitedData = $scope.searchedReportSize;
        $scope.entriesToShow = $scope.searchedReportSize;
        $scope.showItemsPerPage = 10000;
        $scope.showall = true;
    }

    

    $scope.saveFilteredData = function () {
        $scope.customReportData = $scope.filteredData.filteredCustomReportData;
    }


    $scope.setGroupName = function (groupName) {
        if ((groupName == "") || (groupName == undefined)) {
            alert($scope.analytics['pleaseEnterTheGroupName']); 
        }
        else {
            var selection = false;
            $scope.elementArray = [];
            if ($scope.currentClicked.service) {
                $scope.elementArray = $scope.dataElementsArray;
            }
            else if ($scope.currentClicked.disease) {
                $scope.elementArray = $scope.diseaseDataElementsArray;
            }
            else if ($scope.currentClicked.indicator) {
                $scope.elementArray = $scope.indicatorsArray;
            }

            for (var i = 0; i < $scope.elementArray.length; i++) {
                if ($scope.elementArray[i].Checked) {
                    $scope.elementArray[i].groupName = groupName;
                    selection = true;
                }
            }

            if (selection == false) {
                alert($scope.analytics['pleaseSelectDataElementsBeforeGrouping']);
            }

        }
    }

    //$scope.chartTitle = $scope.selectedAxis.xAxis + " vs. " + $scope.selectedAxis.yAxis;

    $scope.chartOptionsMultiBarHorizontal = {
        chart: {
            type: 'multiBarHorizontalChart',
            height: 450,
            x: function (d) { return d[$scope.selectedAxis.xAxis]; },
            y: function (d) { return d[$scope.selectedAxis.yAxis]; },
            showControls: true,
            showValues: true,
            showLabels: true,
            duration: 500,
            xAxis: {
                showMaxMin: false,
                rotateLabels: 20
            },
            yAxis: {
                axisLabel: 'Values',
                tickFormat: function (d) {
                    return d3.format(',.0f')(d);
                }
            }
        }
    };


    $scope.chartOptionsMultiBar = {
        chart: {
            type: 'multiBarChart',
            height: 450,
            x: function (d) { return d[$scope.selectedAxis.xAxis]; },
            y: function (d) { return d[$scope.selectedAxis.yAxis]; },
            showControls: true,
            showValues: true,
            showLabels: true,
            duration: 500,
            xAxis: {
                showMaxMin: false,
                rotateLabels: 20
            },
            yAxis: {
                axisLabel: 'Values',
                tickFormat: function(d){
                    return d3.format(',.0f')(d);
                }
            },
            multibar: {
                dispatch: {
                    //chartClick: function(e) {console.log("! chart Click !")},
                    elementClick: function (e) {
                        //alert("ElementClicked! Name: " + e.data.Name + " Value: " + e.data.IndicatorValue); console.log("! element Click !");
                        $scope.hierarchicalDataNodes.push(e.data);
                        $scope.setNewData2(e);
                    }
                }
            }
        }
    };

    $scope.chartOptionsDonut = {
        chart: {
            type: 'pieChart',
            height: 450,
            donut: true,
            x: function (d) { return d[$scope.selectedAxis.xAxis]; },
            y: function (d) { return d[$scope.selectedAxis.yAxis]; },
            showLabels: true,

            pie: {
                startAngle: function (d) { return d.startAngle - Math.PI },
                endAngle: function (d) { return d.endAngle - Math.PI },               
                dispatch: {
                    //chartClick: function(e) {console.log("! chart Click !")},
                    elementClick: function (e) {
                        //alert("ElementClicked! Name: " + e.data.Name + " Value: " + e.data.IndicatorValue); console.log("! element Click !");
                        $scope.hierarchicalDataNodes.push(e.data);
                        $scope.setNewData2(e);
                    },
                }               
            },
            duration: 500,
            legend: {
                margin: {
                    top: 5,
                    right: 70,
                    bottom: 5,
                    left: 0
                }
            }
        }
    };


    $scope.chartOptionsLine = {
        chart: {
            type: 'lineChart',
            height: 450,
            margin: {
                top: 20,
                right: 20,
                bottom: 70,
                left: 40
            },
            x: function (d) { return d[$scope.selectedAxis.xAxis]; },
            y: function (d) { return d[$scope.selectedAxis.yAxis]; },
            useInteractiveGuideline: true,
        }
    }

    $scope.chartOptionsPie = {
        chart: {
            type: 'pieChart',
            height: 500,
            x: function (d) { return d[$scope.selectedAxis.xAxis]; },
            y: function (d) { return d[$scope.selectedAxis.yAxis]; },
            showLabels: true,
            duration: 500,
            labelThreshold: 0.01,
            labelSunbeamLayout: true,
            pie: {
                dispatch: {
                    //chartClick: function(e) {console.log("! chart Click !")},
                    elementClick: function (e) {
                        //alert("ElementClicked! Name: " + e.data.Name + " Value: " + e.data.IndicatorValue); console.log("! element Click !");
                        $scope.hierarchicalDataNodes.push(e.data);
                        $scope.setNewData2(e);
                    },
                }
            },
            legend: {
                margin: {
                    top: 5,
                    right: 35,
                    bottom: 5,
                    left: 0
                }
            }
        }
    };


    $scope.chartOptions2 = {
        chart: {
            type: 'discreteBarChart',
            height: 450,
            x: function (d) {
                return d[$scope.selectedAxis.xAxis];
            },
            y: function (d) {
                return d[$scope.selectedAxis.yAxis];
            },
            xAxis: {
                axisLabel: 'X Axis',
                rotateLabels: 20,
                showMaxMin: false
            },
            yAxis: {
                axisLabel: 'Y Axis',
                axisLabelDistance: -10,
            },
            zoom: {
                enabled: true,
                scaleExtent: [1, 10],
                useFixedDomain: false,
                useNiceScale: false,
                horizontalOff: false,
                verticalOff: true,
                unzoomEventType: 'dblclick.zoom'
            },
            showValues: true,
            showLegend: true,
            useInteractiveGuideline: true,
            valueFormat: function (d) {
                return d3.format(',.0f')(d);
            },
            dispatch: {
                tooltipShow: function (e) {
                    console.log('! tooltip SHOW !')
                },
                tooltipHide: function (e) {
                    console.log('! tooltip HIDE !')
                },
                beforeUpdate: function (e) {
                    console.log('! before UPDATE !')
                }
            },
            discretebar: {
                dispatch: {
                    //chartClick: function(e) {console.log("! chart Click !")},
                    elementClick: function (e) {
                        //alert("ElementClicked! Name: " + e.data.Name + " Value: " + e.data.IndicatorValue); console.log("! element Click !");
                        $scope.hierarchicalDataNodes.push(e.data);
                        $scope.setNewData2(e);
                    },
                    elementDblClick: function (e) {
                        console.log("! element Double Click !")
                    },
                    elementMouseout: function (e) {
                        console.log("! element Mouseout !")
                    },
                    elementMouseover: function (e) {
                        console.log("! element Mouseover !")
                    }
                }
            },
            callback: function (e) {
                console.log('! callback !')
            }
        },
        // title options
        title: {
            enable: true,
            text: $scope.chartTitle
        },
    };

    $scope.chartOptionsBar = {
        chart: {
            type: 'discreteBarChart',
            height: 450,
            x: function (d) {
                return d[$scope.selectedAxis.xAxis];
            },
            y: function (d) {
                return d[$scope.selectedAxis.yAxis];
            },
            xAxis: {
                axisLabel: 'X Axis',
                rotateLabels: 20,
                showMaxMin: false
            },
            yAxis: {
                axisLabel: 'Y Axis',
                axisLabelDistance: -10,
            },
            zoom: {
                enabled: true,
                scaleExtent: [1, 10],
                useFixedDomain: false,
                useNiceScale: false,
                horizontalOff: false,
                verticalOff: true,
                unzoomEventType: 'dblclick.zoom'
            },
            showValues: true,
            showLegend: true,
            useInteractiveGuideline: true,
            valueFormat: function (d) {
                return d3.format(',.0f')(d);
            },
            dispatch: {
                tooltipShow: function (e) {
                    console.log('! tooltip SHOW !')
                },
                tooltipHide: function (e) {
                    console.log('! tooltip HIDE !')
                },
                beforeUpdate: function (e) {
                    console.log('! before UPDATE !')
                }
            },
            discretebar: {
                dispatch: {
                    //chartClick: function(e) {console.log("! chart Click !")},
                    elementClick: function (e) {
                        //alert("ElementClicked! Name: " + e.data.Name + " Value: " + e.data.IndicatorValue); console.log("! element Click !");
                        $scope.hierarchicalDataNodes.push(e.data);
                        $scope.setNewData2(e);
                    },
                    elementDblClick: function (e) {
                        console.log("! element Double Click !")
                    },
                    elementMouseout: function (e) {
                        console.log("! element Mouseout !")
                    },
                    elementMouseover: function (e) {
                        console.log("! element Mouseover !")
                    }
                }
            },
            callback: function (e) {
                console.log('! callback !')
            }
        },
        // title options
        title: {
            enable: true,
            text: $scope.chartTitle
        },
    };
   
    $scope.saveToDashBoard = function()
    {

        if ($scope.chartName.Name == "")
        {
            alert($scope.analytics['pleaseEnterChartName']);
            return;
        }
        //JSON.stringify(name)
        //var option = JSON.stringify($scope.chartOptions2);
        var data = JSON.stringify($scope.chartData2);

        //var json = type("application/json", function (xhr) {
        //    return JSON.parse(xhr.responseText);
        //});
        
        if ($scope.selectedAxis.ChartType == "")
        {
            $scope.selectedAxis.ChartType = "Bar_Chart";
        }

        var dashBoardParameters = {
            "UserId": "ROOT", "DashBoardName": $scope.chartName.Name, "ChartName": $scope.chartName.Name,
            "SelectedXAxis": $scope.selectedAxis.xAxis, "SelectedYAxis": $scope.selectedAxis.yAxis,
            "GroupBy": $scope.selectedAxis.groupBy, "AggregationType": $scope.selectedAxis.AggregationType,
            "ChartType": $scope.selectedAxis.ChartType, "ChartData": data                      
            
        };

        AnalyticsFactory.saveDashBoardService(dashBoardParameters);

    }

    $scope.exportAsImage = function () {
        // get the chart container
        var nvd3 = $('#nvd3_container');
        var svg = nvd3.find('svg:first');
        var svgSource = svg[0].outerHTML;
        var canvas = $('#svg_to_canvas').css({ 'display': 'block' });
        // the canvg call that takes the svg xml and converts it to a canvas
        canvg(canvas[0], svgSource);
        // wait a little, then export canvas to image
        setTimeout(function () {
            canvas[0].toBlob(function (blob) {
                saveAs(blob, "chart-" + (new Date()).toISOString() + ".png");
                canvas.css({ 'display': 'none' });// hide it once more.
            });
        }, 1000);
    }

    $scope.DrillUp = function (drillType, index) {
        debugger;
        if ($scope.hierarchicalData.length != 0) {
            $scope.levelData = index != undefined ? $scope.hierarchicalData[index] : $scope.hierarchicalData.pop();
            if (index != undefined) {
                // let's do what pop() would have done...
                $scope.hierarchicalData.splice(index, $scope.hierarchicalData.length - index);
                $scope.hierarchicalDataNodes.splice(index, $scope.hierarchicalDataNodes.length - index);
            } else {
                $scope.hierarchicalDataNodes.pop();
            }

            $scope.buildDrillNav($scope.hierarchicalData, $scope.hierarchicalDataNodes);

            $scope.drillDownReportData = $scope.levelData.data;           
            $scope.drillDownReportColumns = $scope.levelData.columns;
            //$scope.filteredData.filteredCustomReportData = $scope.levelData.data;
            $scope.selectedAxis.xAxis = $scope.levelData.xAxis;
            $scope.selectedAxis.yAxis = $scope.levelData.yAxis;
            $scope.institutionAggrOptions.aggrType = $scope.levelData.aggrType;
            $scope.institutionAggrOptions.facilityTypeId = $scope.levelData.facilityTypeId;
            $scope.institutionAggrOptions.hmiscode = $scope.levelData.hmiscode;
            $scope.institutionAggrOptions.reportingFacilityTypeId = $scope.levelData.reportingFacilityTypeId;
           
            var updateDrillUpData = function () {
                $scope.filteredData.filteredCustomReportData = $scope.levelData.data;
                $scope.customReportData = $scope.levelData.data;
                $scope.customReportColumns = $scope.levelData.columns;
                if (($scope.selectedAxis.ChartType == "Pie_Chart")) {
                    $scope.chartOptions2 = $scope.chartOptionsPie;
                    $scope.chartData2 = $scope.drillDownReportData;
                }
                else if (($scope.selectedAxis.ChartType == "Donut_Chart")) {
                    $scope.chartOptions2 = $scope.chartOptionsDonut;
                    $scope.chartData2 = $scope.drillDownReportData;
                }
                else if (($scope.selectedAxis.ChartType == "Line_Chart")) {
                    $scope.chartOptions2 = $scope.chartOptionsLine;
                    $scope.chartData2 = [
                                      {
                                          key: "LineChart",
                                          //"color": "#d62728",
                                          //values: window.cachedTableData
                                          values: $scope.drillDownReportData
                                      }
                    ];
                }
                else if (($scope.selectedAxis.ChartType == "Bar_Chart")) {
                    $scope.chartOptions2 = $scope.chartOptionsBar;
                    $scope.chartData2 = [
                                      {
                                          key: "BarChart",
                                          //"color": "#d62728",
                                          //values: window.cachedTableData
                                          values: $scope.drillDownReportData
                                      }
                    ];
                }
                else if (($scope.selectedAxis.ChartType == "MultiBar_Chart")) {
                    $scope.chartOptions2 = $scope.chartOptionsMultiBar;
                    $scope.chartData2 = [
                                      {
                                          key: "MultiBarChart",
                                          "color": "#d62728",
                                          //values: window.cachedTableData
                                          values: $scope.drillDownReportData
                                      }
                    ];
                }
                else // default to Bar Chart
                {
                    $scope.chartOptions2 = $scope.chartOptionsBar;
                    $scope.chartData2 = [
                                      {
                                          key: "BarChart",
                                          //"color": "#d62728",
                                          //values: window.cachedTableData
                                          values: $scope.drillDownReportData
                                      }
                    ];
                }
            }
            $timeout(updateDrillUpData, 0);
        }
    }

    $scope.getDrillTitle = function (el, node, index) {
        var title = "Level: ";

        if (el.aggrType) {
            var aggType = el.aggrType.toUpperCase();
            var nodeName = null;
            switch (aggType) {
                case 'FEDERAL': {
                    // what do we use here?
                    break;
                }
                case 'REGION': {
                    nodeName = node.RegionName;
                    break;
                }
                case 'ZONE': {
                    nodeName = node.ZoneName;
                    break;
                }
                case 'DISTRICT': {
                    nodeName = node.DistrictName;
                    break;
                }
                case 'FACILITY': {
                    nodeName = node.FacilityName;
                    break;
                }
            }

            title += aggType + (nodeName != null? ": " + nodeName : "");
        } else
            title += (index + 1);

        return title;
    }

    $scope.hierarchicalDataNodes = []; //initially...
    $scope.buildDrillNav = function (hierachy, hierachy_data) {
        var nav = $('#drill-nav');
        nav.empty();
        var prevUL = $('<ul/>', {'class': 'drill-nav-el'});
        nav.append(prevUL);
        for (i = 0; i < hierachy.length; i++) {
            var el = hierachy[i];
            var node = hierachy_data[i];
            var title = $scope.getDrillTitle(el, node, 1);
            var li = $('<li/>', { 'class': 'drill-nav-el' })
                .css({ 'cursor': 'pointer', 'color': 'green' }).append(
                $('<div/>').text(title)
                );

            (function (_i) {
                li.click(function () {
                    $scope.DrillUp('chart', _i);
                });
            })(i);

            prevUL.append(li);
            var newUL = $('<ul/>', { 'class': 'drill-nav-el' }); // new level...
            li.append(newUL);
            prevUL = newUL;
        }
    }

    $scope.setNewData2 = function (dataToDrillDown) {

        setLevelData();
        if ($scope.hierarchicalData.length == 0) // This is the first level push the data up...
        {
            $scope.levelData.data = $scope.filteredData.filteredCustomReportData;
            $scope.levelData.columns = $scope.customReportColumns;                            
            $scope.levelData.xAxis = $scope.selectedAxis.xAxis;
            $scope.levelData.yAxis = $scope.selectedAxis.yAxis;
            $scope.levelData.aggrType = $scope.institutionAggrOptions.aggrType;
            $scope.levelData.facilityTypeId = $scope.institutionAggrOptions.facilityTypeId;
            $scope.levelData.hmiscode = $scope.institutionAggrOptions.hmiscode;
            $scope.levelData.reportingFacilityTypeId = $scope.institutionAggrOptions.reportingFacilityTypeId;

            var temp = {};
            angular.merge(temp, $scope.levelData);

            $scope.hierarchicalData.push(temp);
            $scope.buildDrillNav($scope.hierarchicalData, $scope.hierarchicalDataNodes);
        }
        else {
            $scope.levelData.data = $scope.drillDownReportData;
            $scope.levelData.columns = $scope.drillDownReportColumns;
            $scope.levelData.xAxis = $scope.selectedAxis.xAxis;
            $scope.levelData.yAxis = $scope.selectedAxis.yAxis;
            $scope.levelData.aggrType = $scope.institutionAggrOptions.aggrType;
            $scope.levelData.facilityTypeId = $scope.institutionAggrOptions.facilityTypeId;
            $scope.levelData.hmiscode = $scope.institutionAggrOptions.hmiscode;
            $scope.levelData.reportingFacilityTypeId = $scope.institutionAggrOptions.reportingFacilityTypeId;

            var temp = {};
            angular.merge(temp, $scope.levelData);

            $scope.hierarchicalData.push(temp);
            $scope.buildDrillNav($scope.hierarchicalData, $scope.hierarchicalDataNodes);
        }
        $scope.selectedPreviousAxis.yAxis = $scope.selectedAxis.yAxis;
        $scope.drillDownReportData = [];
        $scope.drillDown(dataToDrillDown.data, "chart", false);
        $scope.finishDrillDown = false;

        var updateChartData = function () {
            if ($scope.institutionAggrOptions.aggrType == "region") {
                $scope.selectedAxis.xAxis = "RegionName";
            }
            else if ($scope.institutionAggrOptions.aggrType == "zone") {
                $scope.selectedAxis.xAxis = "ZoneName";
            }
            else if ($scope.institutionAggrOptions.aggrType == "district") {
                $scope.selectedAxis.xAxis = "DistrictName";
            }
            else if ($scope.institutionAggrOptions.aggrType == "facility") {
                $scope.selectedAxis.xAxis = "FacilityName";
            }

            $scope.selectedAxis.yAxis = $scope.selectedPreviousAxis.yAxis;
            if ($scope.drillDownReportData.length != 0) {
                $scope.finishDrillDown = true;

                if (($scope.selectedAxis.ChartType == "Pie_Chart")) {
                    $scope.chartOptions2 = $scope.chartOptionsPie;
                    $scope.chartData2 = $scope.drillDownReportData;
                }
                else if (($scope.selectedAxis.ChartType == "Donut_Chart")) {
                    $scope.chartOptions2 = $scope.chartOptionsDonut;
                    $scope.chartData2 = $scope.drillDownReportData;
                }
                else if (($scope.selectedAxis.ChartType == "Line_Chart")) {
                    $scope.chartOptions2 = $scope.chartOptionsLine;
                    $scope.chartData2 = [
                                      {
                                          key: "LineChart",
                                          //"color": "#d62728",
                                          //values: window.cachedTableData
                                          values: $scope.drillDownReportData
                                      }
                    ];
                }
                else if (($scope.selectedAxis.ChartType == "Bar_Chart")) {
                    $scope.chartOptions2 = $scope.chartOptionsBar;
                    $scope.chartData2 = [
                                      {
                                          key: dataToDrillDown.data[$scope.selectedAxis.xAxis],
                                          //"color": "#d62728",
                                          //values: window.cachedTableData
                                          values: $scope.drillDownReportData
                                      }
                    ];
                }
                else if (($scope.selectedAxis.ChartType == "MultiBar_Chart")) {
                    $scope.chartOptions2 = $scope.chartOptionsMultiBar;
                    $scope.chartData2 = [
                                      {
                                          key: "MultiBarChart",
                                          "color": "#d62728",
                                          //values: window.cachedTableData
                                          values: $scope.drillDownReportData
                                      }
                    ];
                }
                else // default to Bar Chart
                {
                    $scope.chartOptions2 = $scope.chartOptionsBar;
                    $scope.chartData2 = [
                                      {
                                          key: dataToDrillDown.data[$scope.selectedAxis.xAxis],
                                          //"color": "#d62728",
                                          //values: window.cachedTableData
                                          values: $scope.drillDownReportData
                                      }
                    ];
                }
            }

        }

        $scope.$watch('drillDownReportData', function (newValue, oldValue) {
            $timeout(updateChartData, 0);
        });

    }

    $scope.groupByMultiChart = function (dashboard) {

        if ($scope.selectedAxis.groupBy == undefined)
        {
            return;
        }

        var updateChartData = function () {
            var tempDataToShow = [];
            if ($scope.drillDownReportData.length == 0) // This is the first level push the data up...
            {
                //$scope.dataToShow = $scope.filteredData.filteredCustomReportData;
                angular.merge(tempDataToShow, $scope.filteredData.filteredCustomReportData);

            }
            else {
                //$scope.dataToShow = $scope.drillDownReportData;
                angular.merge(tempDataToShow, $scope.drillDownReportData);
            }

            if (($scope.selectedAxis.groupBy == $scope.selectedAxis.xAxis) || ($scope.selectedAxis.groupBy == $scope.selectedAxis.yAxis)) {
                alert($scope.analytics['chooseAnotherColumn']);
                return;
            }


            var filteredGroupBy = [];
            var groupByList = [];
            for (var i = 0; i < tempDataToShow.length; i++) {
                var groupByName = $scope.selectedAxis.groupBy;
                var groupByValue = tempDataToShow[i][groupByName];

                if (filteredGroupBy[groupByValue] == undefined) // first encounter
                {
                    filteredGroupBy[groupByValue] = [tempDataToShow[i]];
                    groupByList.push(groupByValue);
                }
                else {
                    filteredGroupBy[groupByValue].push(tempDataToShow[i]);
                    //filteredGroupBy.push({ groupByValue: $scope.dataToShow[i] });
                }
            }

            var summedValues = [];
            var totalSumValues = [];
            var prevAxis = [];
            var id = "";

            //Don't do any summation...no need
            for (var j = 0; j < groupByList.length; j++) {

                var theList = filteredGroupBy[groupByList[j]];

                for (var i = 0; i < theList.length; i++) {
                    var xAxisName = $scope.selectedAxis.xAxis;
                    var xAxisValue = theList[i][$scope.selectedAxis.xAxis];
                    var dataElementIndicatorName = $scope.selectedAxis.yAxis;
                    var dataElementIndicatorValue = theList[i][$scope.selectedAxis.yAxis];

                    if (summedValues[xAxisValue] == undefined) {
                        summedValues[xAxisValue] = dataElementIndicatorValue;
                    }
                    else {
                        var summedValue = summedValues[xAxisValue] + dataElementIndicatorValue;
                        summedValues[xAxisValue] = summedValue;
                        //{ 'RegionName': xAxisValue, 'RegionId': id, dataElementIndicatorName: summedValue }                            
                    }
                }
                var temp = [];
                angular.merge(temp, summedValues);
                totalSumValues[groupByList[j]] = temp;
                //totalSumValues[groupByList[j]].push(temp);
                summedValues = [];
            }

            for (var j = 0; j < groupByList.length; j++) {

                var theList = filteredGroupBy[groupByList[j]];
                var firstEncounter = [];
                var filteredSummedValues = [];

                for (var i = 0; i < filteredGroupBy[groupByList[j]].length; i++) {
                    var xAxisName = $scope.selectedAxis.xAxis;
                    var xAxisValue = filteredGroupBy[groupByList[j]][i][$scope.selectedAxis.xAxis];
                    var dataElementIndicatorName = $scope.selectedAxis.yAxis;
                    var dataElementIndicatorValue = filteredGroupBy[groupByList[j]][i][$scope.selectedAxis.yAxis];

                    if (firstEncounter[xAxisValue] == undefined) {
                        filteredGroupBy[groupByList[j]][i][$scope.selectedAxis.yAxis] = totalSumValues[groupByList[j]][xAxisValue];
                        //filteredSummedValues[i] = theList[i];
                        firstEncounter[xAxisValue] = 1;
                    }
                    else {
                        filteredGroupBy[groupByList[j]].splice(i, 1);
                        i--;
                        //remove the element
                    }
                }
            }


            // Finished, assign to chart object the options and the data

            if ($scope.selectedAxis.ChartType == "MultiBar_Chart") {
                $scope.chartOptions2 = $scope.chartOptionsMultiBar;
            }
            else if ($scope.selectedAxis.ChartType == "MultiBarHorizontal_Chart") {
                $scope.chartOptions2 = $scope.chartOptionsMultiBarHorizontal;
            }

            var filteredData = [];

            for (var i = 0; i < groupByList.length; i++) {
                var obj = { key: groupByList[i], color: getColor(i), values: filteredGroupBy[groupByList[i]] };
                filteredData.push(obj);
            }

            $scope.chartData2 = filteredData;         
        }

        $timeout(updateChartData, 0);

    }

    var getColor = function (i) {
        var color;
        if (i == 0) {
            color = "#ff7f0e";
            //color = "steelblue";
        }
        else if (i == 1) {
            color = "#7777ff";
        }
        else if (i == 2) {
            color = "lightgreen";
        }
        else if (i == 3) {
            color = "#8A2BE2";
        }
        else if (i == 4) {
            color = "#A52A2A";
        }
        else if (i == 5) {
            color = "#DEB887";
        }
        else if (i == 6) {
            color = "#5F9EA0";
        }
        else if (i == 7) {
            color = "#7FFF00";
        }
        else if (i == 8) {
            color = "#FF7F50";
        }
        else if (i == 9) {
            color = "#D2691E";
        }
        else if (i == 10) {
            color = "#6495ED";
        }
        else if (i == 11) {
            color = "#00008B";
        }
        else if (i == 12) {
            color = "#00FFFF";
        }
        else if (i == 13) {
            color = "#DC143C";
        }
        else if (i == 14) {
            color = "#A9A9A9";
        }
        else if (i == 15) {
            color = "#008B8B";
        }
        else {
            color = "#00FFFF" + i;
        }

        return color;
    }

    $scope.setChartType = function (groupBy) {

        var updateChartData = function () {
            $scope.dataToShow = [];
            if ($scope.drillDownReportData.length == 0) // This is the first level push the data up...
            {
                $scope.dataToShow = $scope.filteredData.filteredCustomReportData;
            }
            else {
                $scope.dataToShow = $scope.drillDownReportData;
            }

            if (($scope.selectedAxis.ChartType == "Pie_Chart")) {
                $scope.chartOptions2 = $scope.chartOptionsPie;
                $scope.chartData2 = $scope.dataToShow;
            }
            else if ($scope.selectedAxis.ChartType == "Donut_Chart") {
                $scope.chartOptions2 = $scope.chartOptionsDonut;
                $scope.chartData2 = $scope.dataToShow;
            }
            else if (($scope.selectedAxis.ChartType == "Line_Chart")) {
                $scope.chartOptions2 = $scope.chartOptionsLine;
                $scope.chartData2 = [
                                  {
                                      key: "LineChart",
                                      //"color": "#d62728",
                                      //values: window.cachedTableData
                                      values: $scope.dataToShow
                                  }
                ];
            }
            else if ($scope.selectedAxis.ChartType == "Bar_Chart") {
                $scope.chartOptions2 = $scope.chartOptionsBar;
                $scope.chartData2 = [
                  {
                      key: "Bar Chart",
                      //"color": "#d62728",
                      //values: window.cachedTableData
                      values: $scope.dataToShow
                  }
                ];
            }
            else if ($scope.selectedAxis.ChartType == "MultiBar_Chart") {
                $scope.groupByMultiChart(false);
            }
            else if ($scope.selectedAxis.ChartType == "MultiBarHorizontal_Chart") {
                $scope.groupByMultiChart(false);
            }
            else {
                $scope.chartOptions2 = $scope.chartOptionsBar;
                $scope.chartData2 = [
                  {
                      key: "BarChart",
                      //"color": "#d62728",
                      //values: window.cachedTableData
                      values: $scope.dataToShow
                  }
                ];
            }
        }

       // if (($scope.selectedAxis.ChartType != "MultiBar_Chart") && ($scope.selectedAxis.ChartType != "MultiBarHorizontal_Chart")){
            $timeout(updateChartData, 0);
       // }
    }

    $scope.setChartData = function (Name) {

        $scope.finishDrillDown = true;

        var updateChartData = function () {
            $scope.removeChartData();

            if ($scope.selectedAxis.AggregationType == "sum") {
                var newObj = {};
                var summedValues = [];
                var prevAxis = [];
                var id = "";
                // if (($scope.institutionAggrOptions.aggrType == "region")
                //     && ($scope.selectedAxis.xAxis == "RegionName"))// No Aggregation
                // {
                //     //Don't do any summation...no need
                // }
                // else if (($scope.institutionAggrOptions.aggrType == "zone")
                //     && ($scope.selectedAxis.xAxis == "ZoneName"))// No Aggregation
                // {
                //     //Don't do any summation...no need
                // }
                // else if (($scope.institutionAggrOptions.aggrType == "woreda")
                //&& ($scope.selectedAxis.xAxis == "WoredaName"))//No Aggregation
                // {

                // }
                // else if (($scope.institutionAggrOptions.aggrType == "facility")
                //&& ($scope.selectedAxis.xAxis == "FacilityName"))// No Aggregation
                // {

                // }

                //Don't do any summation...no need

                for (var i = 0; i < $scope.filteredData.filteredCustomReportData.length; i++) {
                    var xAxisName = $scope.selectedAxis.xAxis;
                    var xAxisValue = $scope.filteredData.filteredCustomReportData[i][$scope.selectedAxis.xAxis];
                    var dataElementIndicatorName = $scope.selectedAxis.yAxis;
                    var dataElementIndicatorValue = $scope.filteredData.filteredCustomReportData[i][$scope.selectedAxis.yAxis];

                    if (summedValues[xAxisValue] == undefined) {
                        summedValues[xAxisValue] = dataElementIndicatorValue;
                    }
                    else {
                        var summedValue = summedValues[xAxisValue] + dataElementIndicatorValue;
                        summedValues[xAxisValue] = summedValue;
                        //{ 'RegionName': xAxisValue, 'RegionId': id, dataElementIndicatorName: summedValue }                            
                    }
                }

                var firstEncounter = [];
                var filteredSummedValues = [];
                for (var i = 0; i < $scope.filteredData.filteredCustomReportData.length; i++) {
                    var xAxisName = $scope.selectedAxis.xAxis;
                    var xAxisValue = $scope.filteredData.filteredCustomReportData[i][$scope.selectedAxis.xAxis];
                    var dataElementIndicatorName = $scope.selectedAxis.yAxis;
                    var dataElementIndicatorValue = $scope.filteredData.filteredCustomReportData[i][$scope.selectedAxis.yAxis];

                    if (firstEncounter[xAxisValue] == undefined) {
                        $scope.filteredData.filteredCustomReportData[i][$scope.selectedAxis.yAxis] = summedValues[xAxisValue];
                        filteredSummedValues[i] = $scope.filteredData.filteredCustomReportData[i];
                        firstEncounter[xAxisValue] = 1;
                    }
                    else {
                        $scope.filteredData.filteredCustomReportData.splice(i, 1);
                        i--;
                        //remove the element
                    }
                }

                $scope.customReportData = $scope.filteredData.filteredCustomReportData;

                if ($scope.selectedAxis.xAxis == "RegionName") {
                    $scope.institutionAggrOptions.aggrType = "region";
                    for (var i = 0; i < $scope.drillDownReportColumns.length; i++) {
                        //if (($scope.drillDownReportColumns[i] == "ZoneName") || ($scope.drillDownReportColumns[i] == "ZoneId")
                        //    || ($scope.drillDownReportColumns[i] == "WoredaName") || ($scope.drillDownReportColumns[i] == "WoredaId")
                        //    || ($scope.drillDownReportColumns[i] == "FacilityName") || ($scope.drillDownReportColumns[i] == "FacilityTypeName")) {
                        //    $scope.drillDownReportColumns.splice(i, 1);
                        //    i--;
                        //}
                        if (($scope.drillDownReportColumns[i] == "RegionName") || ($scope.drillDownReportColumns[i] == "RegionID")
                        || ($scope.drillDownReportColumns[i] == $scope.selectedAxis.xAxis) || ($scope.drillDownReportColumns[i] == $scope.selectedAxis.yAxis)) {
                            // do not remove
                        }
                        else {
                            $scope.drillDownReportColumns.splice(i, 1);
                            i--;
                        }
                    }

                    for (var i = 0; i < $scope.customReportColumns.length; i++) {
                        //if (($scope.customReportColumns[i] == "ZoneName") || ($scope.customReportColumns[i] == "ZoneId")
                        //    || ($scope.customReportColumns[i] == "WoredaName") || ($scope.customReportColumns[i] == "WoredaId")
                        //    || ($scope.customReportColumns[i] == "FacilityName") || ($scope.customReportColumns[i] == "FacilityTypeName")) {
                        //    $scope.customReportColumns.splice(i, 1);
                        //    i--;
                        //}

                        if (($scope.customReportColumns[i] == "RegionName") || ($scope.customReportColumns[i] == "RegionID")
                        || ($scope.customReportColumns[i] == $scope.selectedAxis.xAxis) || ($scope.customReportColumns[i] == $scope.selectedAxis.yAxis)) {
                            // do not remove
                        }
                        else {
                            $scope.customReportColumns.splice(i, 1);
                            i--;
                        }
                    }
                }
                else if ($scope.selectedAxis.xAxis == "ZoneName") {
                    $scope.institutionAggrOptions.aggrType == "zone";
                    for (var i = 0; i < $scope.drillDownReportColumns.length; i++) {
                        //if (($scope.drillDownReportColumns[i] == "WoredaName") || ($scope.drillDownReportColumns[i] == "WoredaId")
                        //    || ($scope.drillDownReportColumns[i] == "FacilityName") || ($scope.drillDownReportColumns[i] == "FacilityTypeName")) {
                        //    $scope.drillDownReportColumns.splice(i, 1);
                        //    i--;
                        //}
                        if (($scope.drillDownReportColumns[i] == "RegionName") || ($scope.drillDownReportColumns[i] == "RegionID")
                           || ($scope.drillDownReportColumns[i] == $scope.selectedAxis.xAxis) || ($scope.drillDownReportColumns[i] == $scope.selectedAxis.yAxis)) {
                            // do not remove
                        }
                        else {
                            $scope.drillDownReportColumns.splice(i, 1);
                            i--;
                        }
                    }

                    for (var i = 0; i < $scope.customReportColumns.length; i++) {
                        //if (($scope.customReportColumns[i] == "WoredaName") || ($scope.customReportColumns[i] == "WoredaId")
                        //    || ($scope.customReportColumns[i] == "FacilityName") || ($scope.customReportColumnss[i] == "FacilityTypeName")) {
                        //    $scope.customReportColumns.splice(i, 1);
                        //    i--;
                        //}
                        if (($scope.customReportColumns[i] == "RegionName") || ($scope.customReportColumns[i] == "RegionID")
                        || ($scope.customReportColumns[i] == $scope.selectedAxis.xAxis) || ($scope.customReportColumns[i] == $scope.selectedAxis.yAxis)) {
                            // do not remove
                        }
                        else {
                            $scope.customReportColumns.splice(i, 1);
                            i--;
                        }
                    }
                }
                else if ($scope.selectedAxis.xAxis == "DistrictName") {
                    $scope.institutionAggrOptions.aggrType = "district";

                    for (var i = 0; i < $scope.drillDownReportColumns.length; i++) {
                        //if (($scope.drillDownReportColumns[i] == "FacilityName") || ($scope.drillDownReportColumns[i] == "FacilityTypeName")) {
                        //    $scope.drillDownReportColumns.splice(i, 1);
                        //    i--;
                        //}
                        if (($scope.drillDownReportColumns[i] == "RegionName") || ($scope.drillDownReportColumns[i] == "RegionID")
                      || ($scope.drillDownReportColumns[i] == "ZoneName") || ($scope.drillDownReportColumns[i] == "ZoneID")
                      || ($scope.drillDownReportColumns[i] == $scope.selectedAxis.xAxis) || ($scope.drillDownReportColumns[i] == $scope.selectedAxis.yAxis)) {
                            // do not remove
                        }
                        else {
                            $scope.drillDownReportColumns.splice(i, 1);
                            i--;
                        }
                    }


                    for (var i = 0; i < $scope.customReportColumns.length; i++) {
                        //if (($scope.customReportColumns[i] == "FacilityName") || ($scope.customReportColumnss[i] == "FacilityTypeName")) {
                        //    $scope.customReportColumns.splice(i, 1);
                        //    i--;
                        //}
                        if (($scope.customReportColumns[i] == "RegionName") || ($scope.customReportColumns[i] == "RegionID")
                     || ($scope.customReportColumns[i] == "ZoneName") || ($scope.customReportColumns[i] == "ZoneID")
                     || ($scope.customReportColumns[i] == $scope.selectedAxis.xAxis) || ($scope.customReportColumns[i] == $scope.selectedAxis.yAxis)) {
                            // do not remove
                        }
                        else {
                            $scope.customReportColumns.splice(i, 1);
                            i--;
                        }
                    }
                }
                else if ($scope.selectedAxis.xAxis == "FacilityName") {
                    $scope.institutionAggrOptions.aggrType = "facility";

                    for (var i = 0; i < $scope.drillDownReportColumns.length; i++) {
                        if (($scope.drillDownReportColumns[i] == "RegionName") || ($scope.drillDownReportColumns[i] == "ZoneName")
                      || ($scope.drillDownReportColumns[i] == "DistrictName") || ($scope.drillDownReportColumns[i] == "FacilityTypeName")
                       || ($scope.drillDownReportColumns[i] == $scope.selectedAxis.xAxis) || ($scope.drillDownReportColumns[i] == $scope.selectedAxis.yAxis)) {
                            // do not remove
                        }
                        else {
                            $scope.drillDownReportColumns.splice(i, 1);
                            i--;
                        }
                    }


                    for (var i = 0; i < $scope.customReportColumns.length; i++) {
                        if (($scope.customReportColumns[i] == "RegionName") || ($scope.customReportColumns[i] == "ZoneName")
                     || ($scope.customReportColumns[i] == "DistrictName") || ($scope.customReportColumns[i] == "FacilityTypeName")
                     || ($scope.customReportColumns[i] == $scope.selectedAxis.xAxis) || ($scope.customReportColumns[i] == $scope.selectedAxis.yAxis)) {
                            // do not remove
                        }
                        else {
                            $scope.customReportColumns.splice(i, 1);
                            i--;
                        }
                    }
                }
                else {
                    $scope.institutionAggrOptions.aggrType = "federal";

                    for (var i = 0; i < $scope.drillDownReportColumns.length; i++) {
                        //if (($scope.drillDownReportColumns[i] == "FacilityName") || ($scope.drillDownReportColumns[i] == "FacilityTypeName")) {
                        //    $scope.drillDownReportColumns.splice(i, 1);
                        //    i--;
                        //}
                        if (($scope.drillDownReportColumns[i] == $scope.selectedAxis.xAxis) || ($scope.drillDownReportColumns[i] == $scope.selectedAxis.yAxis)) {
                            // do not remove
                        }
                        else {
                            $scope.drillDownReportColumns.splice(i, 1);
                            i--;
                        }
                    }

                    for (var i = 0; i < $scope.customReportColumns.length; i++) {
                        //if (($scope.customReportColumns[i] == "FacilityName") || ($scope.customReportColumnss[i] == "FacilityTypeName")) {
                        //    $scope.customReportColumns.splice(i, 1);
                        //    i--;
                        //}
                        if (($scope.customReportColumns[i] == $scope.selectedAxis.xAxis) || ($scope.customReportColumns[i] == $scope.selectedAxis.yAxis)) {
                            // do not remove
                        }
                        else {
                            $scope.customReportColumns.splice(i, 1);
                            i--;
                        }
                    }
                }
            }

            if (($scope.selectedAxis.ChartType == "Pie_Chart")) {
                $scope.chartOptions2 = $scope.chartOptionsPie;
                $scope.chartData2 = $scope.filteredData.filteredCustomReportData;
            }
            else if ($scope.selectedAxis.ChartType == "Donut_Chart") {
                $scope.chartOptions2 = $scope.chartOptionsDonut;
                $scope.chartData2 = $scope.filteredData.filteredCustomReportData;
            }
            else if (($scope.selectedAxis.ChartType == "Line_Chart")) {
                $scope.chartOptions2 = $scope.chartOptionsLine;
                $scope.chartData2 = [
                                  {
                                      key: "LineChart",
                                      //"color": "#d62728",
                                      //values: window.cachedTableData
                                      values: $scope.filteredData.filteredCustomReportData
                                  }
                ];
            }
            else if ($scope.selectedAxis.ChartType == "Bar_Chart") {
                $scope.chartOptions2 = $scope.chartOptionsBar;
                $scope.chartData2 = [
                  {
                      key: "Bar Chart",
                      //"color": "#d62728",
                      //values: window.cachedTableData
                      values: $scope.filteredData.filteredCustomReportData
                  }
                ];
            }
            else if ($scope.selectedAxis.ChartType == "MultiBar_Chart") {
                $scope.groupByMultiChart(false);
            }
            else if ($scope.selectedAxis.ChartType == "MultiBarHorizontal_Chart") {
                $scope.groupByMultiChart(false);
            }
            else {
                $scope.chartOptions2 = $scope.chartOptionsBar;
                $scope.chartData2 = [
                  {
                      key: "Bar Chart",
                      //"color": "#d62728",
                      //values: window.cachedTableData
                      values: $scope.filteredData.filteredCustomReportData
                  }
                ];
            }
        }

        $timeout(updateChartData, 0);
    }

    $scope.removeChartData = function (Name) {
        $scope.chartData = [];
        $scope.chartData2 = [];
    }

    $scope.TestData = [
        { "Name": "Bole", "IndicatorValue": 30 },
        { "Name": "Kolfe", "IndicatorValue": 20 },
        { "Name": "Yeka", "IndicatorValue": 15 },
        { "Name": "Akaki", "IndicatorValue": 42 },
    ];

    $scope.TestData2 = [
        { "Name": "Adama Special Zone", "IndicatorValue": 12 },
        { "Name": "Bishoftu Special Zone", "IndicatorValue": 44 },
        { "Name": "Arsi Zonal Health Dept.", "IndicatorValue": 67 },
        { "Name": "Bale Zonal Health Dept.", "IndicatorValue": 15 },
    ];

    $scope.setUpdatedData = function (newName) {
        $scope.TestData3 = [
                   { "Name": newName + "1", "IndicatorValue": 12 },
                   { "Name": newName + "2", "IndicatorValue": 44 },
                   { "Name": newName + "3", "IndicatorValue": 67 },
                   { "Name": newName + "4", "IndicatorValue": 15 },
                   { "RegionName": newName + "1", "IndicatorValue": 12 },
                   { "RegionName": newName + "2", "IndicatorValue": 44 },
                   { "RegionName": newName + "3", "IndicatorValue": 67 },
                   { "RegionName": newName + "4", "IndicatorValue": 15 },
        ];

        return $scope.TestData3;
    }


    //$scope.chartData = $scope.filteredData.filteredCustomReportData;

    //$scope.$apply(); // update both chart

    $scope.chartOptionsTemp = {
        chart: {
            type: 'discreteBarChart',
            height: 330,
            x: function (d) {
                return d.label;
            },
            y: function (d) {
                return d.value;
            },
            showValues: true,
            valueFormat: function (d) {
                return d3.format(',.4f')(d);
            },
            dispatch: {
                tooltipShow: function (e) {
                    console.log('! tooltip SHOW !')
                },
                tooltipHide: function (e) {
                    console.log('! tooltip HIDE !')
                },
                beforeUpdate: function (e) {
                    console.log('! before UPDATE !')
                }
            },
            discretebar: {
                dispatch: {
                    //chartClick: function(e) {console.log("! chart Click !")},
                    elementClick: function (e) {
                        alert($scope.analytics['elementClicked']); console.log("! element Click !")
                    },
                    elementDblClick: function (e) {
                        console.log("! element Double Click !")
                    },
                    elementMouseout: function (e) {
                        console.log("! element Mouseout !")
                    },
                    elementMouseover: function (e) {
                        console.log("! element Mouseover !")
                    }
                }
            },
            callback: function (e) {
                console.log('! callback !')
            }
        }
    };
  
    $scope.toggleReportVisibility = function () {
        if ($scope.reportVisibleRadio) {
            $scope.reportVisible = true;
        }
        else if ($scope.reportNotVisibleRadio) {
            $scope.reportVisible = false;
        }
    }

    $scope.clearDataElements = function () {
        if ($scope.currentClicked.service) {
            for (var i = 0; i < $scope.dataElementsArray.length; i++) {
                $scope.dataElementsArray[i].Checked = false;
            }
        }
        else if ($scope.currentClicked.disease) {
            for (var i = 0; i < $scope.diseaseDataElementsArray.length; i++) {
                $scope.diseaseDataElementsArray[i].Checked = false;
            }
        }
        else if ($scope.currentClicked.indicator) {
            for (var i = 0; i < $scope.indicatorsArray.length; i++) {
                $scope.indicatorsArray[i].Checked = false;
            }
        }
    }

    $scope.selectAllShownDataElements = function () {
        if ($scope.currentClicked.service) {
            for (var i = 0; i < $scope.filteredData.filteredDataElementsArray.length; i++) {
                $scope.filteredData.filteredDataElementsArray[i].Checked = true;
            }
        }
        else if ($scope.currentClicked.disease) {
            for (var i = 0; i < $scope.filteredData.filteredDiseaseDataElementsArray.length; i++) {
                $scope.filteredData.filteredDiseaseDataElementsArray[i].Checked = true;
            }
        }
        else if ($scope.currentClicked.indicator) {
            for (var i = 0; i < $scope.filteredData.filteredIndicatorsArray.length; i++) {
                $scope.filteredData.filteredIndicatorsArray[i].Checked = true;
            }
        }


    }


    $scope.clearDiseaseDataElements = function () {
        for (var i = 0; i < $scope.diseaseDataElementsArray.length; i++) {
            $scope.diseaseDataElementsArray[i].Checked = false;
        }
    }

    //from LocationCtrl
    $scope.getLevel0Custom = function () {
        childrenFactory.getChildrenService($scope.tempLocationId)
        .then(function (data) {
            $scope.children0Custom = data;
        });
    }

    var isInvoked = false;
    $scope.$watch('tempLocationId', function () {
        if (isInvoked)
            return;
        if ($scope.tempLocationId == undefined) {
            console.log("$scope.tempLocationId: undefined, yet trying to be used...")
        } else {
            $scope.getLevel0Custom(); // ok to proceed
            isInvoked = true;
        }
    });

    $scope.getChildren = function (id, FacilityTypeId, level, facilityName, parent) {
        childrenFactory.getChildrenService(id)
		.then(function (data) {

		    $scope.selectedFacilityName = facilityName;
		    if (parent == 0) {
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
    //end

    $scope.clearCategoryService = function () {
        $scope.checkedState = {};
        $scope.checkedIndicatorState = {};

        var categoryParameters = {
            "categoryList": $scope.checkedState, "serviceElementType": $scope.serviceElements.type
        };


        $scope.getServiceDataElementsPost(categoryParameters);
        $scope.diseaseDataElementsArray = [];
        $scope.diseaseOptions = {};
        $scope.indicatorsArray = [];
    }

    $scope.SelectedLocationId = []; // will be updated as locs are checked and updated below...
    $scope.SelectedLocationFacilityType = null;
    //checkstate...

    $scope.checkedStateChangedInstitution = function()
    {
        debugger
        var minFacilityType = 9e6; // would've used this, but breaks back-end int expectation. Use this till it breaks? Number.MAX_SAFE_INTEGER;
        var locs = $('input[data-hmiscode]:checked').map(function (i) {
            var fType = $(this).data('facilitytype');
            fType = fType < 8? 0 :  fType >= 50 ? 0 : fType; // so all <8 or >=  50 are same... --> 0
            minFacilityType = Math.min(fType, minFacilityType);

            return {
                hmiscode: $(this).data('hmiscode'),
                facilityType: fType
            };

        });

        var whitelistLocs = [];
        for (i = 0; i < locs.length; i++) {
            var loc = locs[i];
            if (loc.facilityType == minFacilityType) {
                whitelistLocs.push(loc.hmiscode);
            }
        }

        $scope.SelectedLocationId = whitelistLocs;
        $scope.SelectedLocationFacilityType = minFacilityType;

        ////from LocationCtrl
        //if ($scope.checkedState[id]) {
        //    $scope.checkedFacilities[id] = 1;
        //}
        //else {
        //    //delete myObject.keyname;
        //    //// or,
        //    //delete myObject["keyname"];
        //    if ($scope.checkedFacilities[id] == 1) {
        //        delete $scope.checkedFacilities[id];
        //    }
        //}
        
    }

    $scope.checkedStateChanged = function (reportType, childId, parentId, childIdState, children, level) {       

        if (reportType == 1) {
            $scope.currentClicked.service = true;
            $scope.currentClicked.indicator = false;
            $scope.currentClicked.disease = false;

            var test = $scope.parentServiceChecked;

            if (parentId != null) {
                if (!childIdState) {
                    $scope.checkedState[parentId] = false;
                    // All the children below it need to be checked in
                }
            }

            if (children != undefined) {
                if (Object.keys(children).length != 0) {
                    if (childIdState) {
                        if (level == 0) {
                            for (var i = 0; i < children.length; i++) {

                                $scope.checkedState[children[i].category1] = true;
                            }
                        }
                        else {
                            for (var i = 0; i < children.length; i++) {
                                if (level == 1) {
                                    $scope.checkedState[children[i].category2] = true;
                                }
                                else if (level == 2) {
                                    $scope.checkedState[children[i].category3] = true;
                                }
                            }
                        }
                    }
                    else {
                        if (level == 0) {
                            for (var i = 0; i < children.length; i++) {

                                $scope.checkedState[children[i].category1] = false;
                            }
                        }
                        else {
                            for (var i = 0; i < children.length; i++) {
                                if (level == 1) {
                                    $scope.checkedState[children[i].category2] = false;
                                }
                                else if (level == 2) {
                                    $scope.checkedState[children[i].category3] = false;
                                }
                            }
                        }
                    }
                }
            }

            var reportTypeCategory = "service";
            var categoryParameters = {
                "reportType": reportTypeCategory, "categoryList": $scope.checkedState, "serviceElementType": $scope.serviceElements.type
            };

            $scope.getServiceDataElementsPost(categoryParameters);
        }
        else if (reportType == 2) {
            // Disease          
            $scope.currentClicked.service = false;
            $scope.currentClicked.indicator = false;
            $scope.currentClicked.disease = true;

            if (childIdState) {
                $scope.getDiseaseList();
            }
            else {
                $scope.diseaseDataElementsArray = [];
            }
        }
        else if (reportType == 3) {
            $scope.currentClicked.service = false;
            $scope.currentClicked.disease = false;
            $scope.currentClicked.indicator = true;

            var test = $scope.parentIndicatorChecked;

            if (parentId != null) {
                if (!childIdState) {
                    $scope.checkedIndicatorState[parentId] = false;
                    // All the children below it need to be checked in
                }
            }

            if (children != undefined) {
                if (Object.keys(children).length != 0) {
                    if (childIdState) {
                        if (level == 0) {
                            for (var i = 0; i < children.length; i++) {

                                $scope.checkedIndicatorState[children[i].category1] = true;
                            }
                        }
                        else {
                            for (var i = 0; i < children.length; i++) {
                                if (level == 1) {
                                    $scope.checkedIndicatorState[children[i].category2] = true;
                                }
                                else if (level == 2) {
                                    $scope.checkedIndicatorState[children[i].category3] = true;
                                }
                            }
                        }
                    }
                    else {
                        if (level == 0) {
                            for (var i = 0; i < children.length; i++) {

                                $scope.checkedIndicatorState[children[i].category1] = false;
                            }
                        }
                        else {
                            for (var i = 0; i < children.length; i++) {
                                if (level == 1) {
                                    $scope.checkedIndicatorState[children[i].category2] = false;
                                }
                                else if (level == 2) {
                                    $scope.checkedIndicatorState[children[i].category3] = false;
                                }
                            }
                        }
                    }
                }
            }

            var reportTypeCategory = "indicator";
            var categoryParameters = {
                "reportType": reportTypeCategory, "categoryList": $scope.checkedIndicatorState, "serviceElementType": $scope.serviceElements.type
            };

            $scope.getIndicatorsPost(categoryParameters);
        }
    }

    $scope.showRow = function (rowData) {
        //alert(rowData);
        setLevelData();      
        if ($scope.hierarchicalData.length == 0) // This is the first level push the data up...
        {
            $scope.levelData.data = $scope.filteredData.filteredCustomReportData;
            $scope.levelData.columns = $scope.customReportColumns;
            $scope.levelData.xAxis = $scope.selectedAxis.xAxis;
            $scope.levelData.yAxis = $scope.selectedAxis.yAxis;
            $scope.levelData.aggrType = $scope.institutionAggrOptions.aggrType;
            $scope.levelData.facilityTypeId = $scope.institutionAggrOptions.facilityTypeId;
            $scope.levelData.hmiscode = $scope.institutionAggrOptions.hmiscode;
            $scope.levelData.reportingFacilityTypeId = $scope.institutionAggrOptions.reportingFacilityTypeId;

            var temp = {};
            angular.merge(temp, $scope.levelData);

            $scope.hierarchicalData.push(temp);
        }
        else {
            $scope.levelData.data = $scope.drillDownReportData;
            $scope.levelData.columns = $scope.drillDownReportColumns;
            $scope.levelData.xAxis = $scope.selectedAxis.xAxis;
            $scope.levelData.yAxis = $scope.selectedAxis.yAxis;
            $scope.levelData.aggrType = $scope.institutionAggrOptions.aggrType;
            $scope.levelData.facilityTypeId = $scope.institutionAggrOptions.facilityTypeId;
            $scope.levelData.hmiscode = $scope.institutionAggrOptions.hmiscode;
            $scope.levelData.reportingFacilityTypeId = $scope.institutionAggrOptions.reportingFacilityTypeId;

            var temp = {};
            angular.merge(temp, $scope.levelData);

            $scope.hierarchicalData.push(temp);
        }
        $scope.drillDown(rowData, "table", false);
    }

    $scope.showReports = function () {
        // clear first any previously loaded selections

        $scope.hierarchicalData = [];
        $scope.customReportColumns = [];
        $scope.customReportColumnsLanguage = [];
        $scope.customReportData = [];

        $scope.drillDownReportColumns = [];

        //$scope.progress.reportProgress = true;
        //$scope.drillDownReportData = [];

        //var table = $('#reportTable').DataTable();
        //table.destroy();
        // $('#reportTable').empty(); // empty in case the columns change             

        $scope.interfaceVisibility = "showParameters";

        if ($scope.pivotType.type == "row") {
            $scope.dataElementsPivot = false;
        }
        else {
            $scope.dataElementsPivot = true;
        }

        $scope.elementArray = [];
        $scope.reportType = "";

        if ($scope.currentClicked.service) {
            $scope.elementArray = $scope.dataElementsArray;
            $scope.reportType = "service";
        }
        else if ($scope.currentClicked.disease) {
            $scope.elementArray = $scope.diseaseDataElementsArray;
            $scope.reportType = "disease";
        }
        else if ($scope.currentClicked.indicator) {
            $scope.elementArray = $scope.indicatorsArray;
            $scope.reportType = "indicator";
        }

        for (var i = 0; i < $scope.elementArray.length; i++) {
            if (($scope.elementArray[i].Checked == false) && (($scope.elementArray[i].groupName == "") ||
                ($scope.elementArray[i].groupName == undefined))) {
                $scope.elementArray.splice(i, 1);
                i--;
            }
        }

        //var facTypes = $scope.checkedFacTypes[0];

        //for (var i = 0; i < facTypes.length; i++) {
        //    if (facTypes[i].Checked == false) {
        //        facTypes.splice(i, 1);
        //        i--;
        //    }
        //}

        var facilityAggregationOption = $scope.institutionAggrOptions;
        $scope.institutionAggrOptions.hmiscode = $scope.temphierarchy[0].HMISCode;
        $scope.institutionAggrOptions.facilityTypeId = $scope.temphierarchy[0].FacilityTypeId;

        var facilityOptions = $scope.facilityTypeOptions;

        var analyticsParameters = {
            "dataElements": $scope.elementArray, "dataElementsPivot": $scope.pivotType.type, "reportType": $scope.reportType,
            "DiseaseOptions": $scope.diseaseOptions, "InstitutionAggrOptions": $scope.institutionAggrOptions,
            "PeriodSelect": $scope.PeriodSelect, "FacilityTypes": $scope.checkedFacTypes, "PeriodRange": $scope.PeriodRange.range,
            "UserId": JSON.parse(Cookies.get('logged-in')).UserId,
            "LocationIDs": $scope.SelectedLocationId,
            "FilterFacilityType": $scope.SelectedLocationFacilityType,
            "serviceElementType": $scope.serviceElements.type
        };

        var validated = true;

        if ($scope.currentClicked.disease) {
            if ($scope.diseaseOptions.caseDeath == undefined) {
                validated = false;
                alert($scope.analytics['pleaseEnterEitherMorbidityOrMortality']);
                $scope.interfaceVisibility = "showParameters";
                $scope.configType = "ReportType";
                $scope.progress.reportProgress = false;
                return;
            }

            if ($scope.diseaseOptions.per1000Population) {
                if (($scope.diseaseOptions.populationMultiplier == undefined) || ($scope.diseaseOptions.populationMultiplier == "")) {
                    alert($scope.analytics['pleaseEnterValueForNumberOfDiseasesPerPopulation']);
                    validated = false;
                }
            }
            //else if (elementArray.length == 0) {
            //    validated = false;
            //    alert("Please selected atleast 1 data element");
            //    $scope.interfaceVisibility = "showParameters";
            //}
        }
        else if ($scope.currentClicked.service) {
            if ($scope.elementArray.length == 0) {
                validated = false;
                alert($scope.analytics['pleaseSelectAtleastOneDataElement']);
                $scope.interfaceVisibility = "showParameters";
                $scope.configType = "ReportType";
                $scope.progress.reportProgress = false;
                return;
            }
        }

        if ($scope.institutionAggrOptions.aggrType == undefined) {
            validated = false;
            alert($scope.analytics['pleaseSelectAnAggregationType']);
            $scope.interfaceVisibility = "showParameters";
            $scope.configType = "Institutions";
            $scope.progress.reportProgress = false;
            return;
        }  

        if (($scope.PeriodSelect.StartFiscalYear == undefined) || ($scope.PeriodSelect.StartFiscalYear == 0)) {
            validated = false;
            alert($scope.analytics['pleaseSelectAStartYear']);
            $scope.interfaceVisibility = "showParameters";
            $scope.configType = "Period";
            $scope.progress.reportProgress = false;
            return;
        }

        if (validated) {
            $scope.progress.reportProgress = true;

            AnalyticsFactory.getReportServicePost(analyticsParameters)
           .then(function (data) {
               $scope.ReportsDisplay = data;

               $scope.drillDownReportColumns = data[0];
               //$scope.drillDownReportData = data[1];

               $scope.customReportColumns = data[0];
               $scope.customReportColumnsLength = $scope.customReportColumns.length;
               $scope.drillDownReportColumns = data[0];
               $scope.customReportData = data[1];
               $scope.searchedReportSize = $scope.customReportData.length;
               $scope.limitedData = $scope.searchedReportSize;          

               // save the used/generated query for later reuse... (in saved dashboards)
               $scope.generatedSQLQuery = data[2];
               $scope.dataBeforeAdvancedFiltering = $scope.customReportData;

               $scope.customReportColumnsLanguage = data[3];
               $scope.customReportColumnsLanguageLength = $scope.customReportColumnsLanguage.length;
           });
        //$scope.interfaceVisibility = "showReports";

            var setShowReports = function () {
                $scope.interfaceVisibility = "showReports";
            }

            //setShowReports();
            $timeout(setShowReports, 0);
        }

    }


    /* Advanced Filtering... */
    function buildAdvancedFilterModal() {
        var alertId = "filterModal_" + (new Date()).getTime();

        var modalTemplate = $('#modalTemplate').html();

        //build the filtering widgets...
        /*
        | col | op | val |
        +-----+----+-----+
        | menu|menu|text |
        +----------------+
        | [apply]        |
        +----------------+
        U lv ths, rt? ;-)
        */
        var wrapper = $('<div/>', {'class': 'filtering-panel'});
        var table = $('<table/>', { 'class': 'table table-responsive' });
        var fieldSelectorID = alertId + '-field';
        var fieldSelector = $('<select/>', { 'class': 'form-control', 'id': fieldSelectorID });
        $.each($scope.customReportColumns, function (i, fi) {
            fieldSelector.append('<option>' + fi + '</option>');
        })

        var operationSelectorID = alertId + '-op';
        var operationSelector = $('<select/>', { 'class': 'form-control', 'id': operationSelectorID });
        var operations = ["=", "!=", ">=", "<=", ">", "<", "LIKE", "REGEX"]
        $.each(operations, function (i, op) {
            operationSelector.append('<option>' + op + '</option>');
        })

        var parameterValueID = alertId + '-param';
        var parameterValue = $('<input/>', { 'class': 'form-control', 'type': 'text', 'id': parameterValueID });
        table.prepend(
            $('<thead/>').append('<tr><th>FIELD</th><th>OPERATION</th><th>PARAMETER</th>'),
            $('<tbody/>').append(
                    $('<tr/>').append(
                         $('<td/>').append(fieldSelector),
                         $('<td/>').append(operationSelector),
                         $('<td/>').append(parameterValue)
                    )
                )
            );

        var applyButtonID = alertId + '-apply';
        var applyButton = $('<button/>', { 'class': 'btn btn-danger', 'type': 'button', 'id': applyButtonID }).text('APPLY THIS FILTER');
        /*wire in events....*/
        $(document).on("click", "#" + applyButtonID, function (event) {

            var field = $('#' + fieldSelectorID).val();
            var op = $('#' + operationSelectorID).val();
            var param = $('#' + parameterValueID).val();
            console.log('Advanced Filtering:: field: ' + field + ' | op: ' + op + ' | param:' + param);

            debugger

            var originalData = $scope.customReportData;
            var ourFilteredData = [];

            for (d = 0; d < originalData.length; d++) {
                var entry = originalData[d];
                switch (op) {
                    case "=": {
                        if (entry[field] == param) {
                            ourFilteredData.push(entry);
                        }
                        break;
                    }
                    case "!=": {
                        if (entry[field] != param) {
                            ourFilteredData.push(entry);
                        }
                        break;
                    }
                    case ">=": {
                        if (entry[field] >= Number(param)) {
                            ourFilteredData.push(entry);
                        }
                        break;
                    }
                    case "<=": {
                        if (entry[field] <= Number(param)) {
                            ourFilteredData.push(entry);
                        }
                        break;
                    }
                    case ">": {
                        if (entry[field] > Number(param)) {
                            ourFilteredData.push(entry);
                        }
                        break;
                    }
                    case "<": {
                        if (entry[field] > Number(param)) {
                            ourFilteredData.push(entry);
                        }
                        break;
                    }
                    case "LIKE": {
                        if (entry[field].toString().toLowerCase().indexOf(param.toLowerCase()) >= 0) {
                            ourFilteredData.push(entry);
                        }
                        break;
                    }
                    case "REGEX": {
                        if (entry[field].toString().match(new RegExp(param)) != null) {
                            ourFilteredData.push(entry);
                        }
                        break;
                    }
                }
            }            

            $timeout(function () {
                $scope.dataBeforeAdvancedFiltering = $scope.dataBeforeAdvancedFiltering == null ? $scope.customReportData : $scope.dataBeforeAdvancedFiltering;
                $scope.customReportData = ourFilteredData
            }, 20);
        })

        wrapper.append(table, applyButton);
        /* building done. now bootstrapping... */

        modalTemplate = modalTemplate.replace("{message}", wrapper[0].outerHTML);
        modalTemplate = modalTemplate.replace("{title}","ADVANCED Filtering");
        
        modalTemplate = modalTemplate.replace("{id}", alertId);

        var modalEl = $('#modalContainer').append($(modalTemplate));

        $('#' + alertId).modal({ show: false })
        $('#' + alertId).modal('show');

        $('#' + alertId).on('hidden.bs.modal', function () {           
            $('#' + alertId).remove();
        })     

    }

    // will be set later...
    $scope.dataBeforeAdvancedFiltering = null;
    $scope.triggerAdvancedFilters = function () {
        buildAdvancedFilterModal();
    }
    $scope.resetAdvancedFilters = function () {
        if ($scope.dataBeforeAdvancedFiltering != null)
            $scope.customReportData = $scope.dataBeforeAdvancedFiltering;
    }
    /* End Advanced Filtering... */

    $scope.getDiseaseList = function (parameters) {
        AnalyticsFactory.getDiseaseListService(parameters)
       .then(function (data) {
           $scope.diseaseDataElementsArray = data;

           for (var i = 0; i < $scope.diseaseDataElementsArray.length; i++) {
               $scope.diseaseDataElementsArray[i].Checked = false;
           }
       });
    }  

    $scope.getServiceDataElementsPost = function (parameters) {
        AnalyticsFactory.getDataElementsService(parameters)
		.then(function (data) {
		    $scope.dataElementsArray = data;

		    for (var i = 0; i < $scope.dataElementsArray.length; i++) {
		        $scope.dataElementsArray[i].Checked = false;
		    }
		});
    }

    $scope.getIndicatorsPost = function (parameters) {
        AnalyticsFactory.getDataElementsService(parameters)
		.then(function (data) {
		    $scope.indicatorsArray = data;

		    for (var i = 0; i < $scope.indicatorsArray.length; i++) {
		        $scope.indicatorsArray[i].Checked = false;
		    }
		});
    }

    $scope.getCategory = function (id1, id2, category) {
        AnalyticsFactory.getCategoryService(id1, id2, category, $scope.serviceElements.type)
		.then(function (data) {

		    // Service
		    if (id1 == 1)  // Category1 just after service or level1
		    {
		        $scope.currentClicked.service = true;
		        $scope.currentClicked.disease = false;
		        $scope.currentClicked.indicator = false;

		        if (id2 == 1) {
		            $scope.category1[category] = data;
		            if ($scope.serviceClicked == true) {
		                $scope.serviceClicked = false;
		            }
		            else {
		                $scope.serviceClicked = true;
		            }

		            // Here I check if service is clicked and then click all the children....
		            if ($scope.checkedState[category]) {
		                // Iterate through all the children
		                for (var i = 0; i < $scope.category1[category].length; i++) {
		                    $scope.checkedState[$scope.category1[category][i].category1] = true;
		                }
		            }

		            // check if service is checked and if it is, then iterate and check all the category that are opened up....
		            // Also save the 
		        }
		        else if (id2 == 2) // Category2 after category 1
		        {
		            $scope.category2[category] = data;
		            if ($scope.level1ExpandChildren[category] == true) {
		                $scope.level1ExpandChildren[category] = false;
		            }
		            else {
		                $scope.level1ExpandChildren[category] = true;
		            }

		            if ($scope.checkedState[category]) {
		                // Iterate through all the children
		                for (var j = 0; j < $scope.category2[category].length; j++) {
		                    $scope.checkedState[$scope.category2[category][j].category2] = true;
		                }
		            }
		        }
		        else if (id2 == 3) // Category2 after category 1
		        {
		            $scope.category3 = data;
		        }
		    }
		    else if (id1 == 2)  // Category1 just after disease or level1
		    {
		        $scope.currentClicked.service = false;
		        $scope.currentClicked.indicator = false;
		        $scope.currentClicked.disease = true;

		        if (id2 == 1) {
		            $scope.category1[category] = data;
		            if ($scope.diseaseClicked == true) {
		                $scope.diseaseClicked = false;
		            }
		            else {
		                $scope.diseaseClicked = true;
		            }
		        }
		    }
		    else if (id1 == 3)  // Category1 just after disease or level1
		    {
		        $scope.currentClicked.service = false;
		        $scope.currentClicked.disease = false;
		        $scope.currentClicked.indicator = true;

		        if (id2 == 1) {
		            $scope.indicatorCategory1[category] = data;
		            if ($scope.indicatorClicked == true) {
		                $scope.indicatorClicked = false;
		            }
		            else {
		                $scope.indicatorClicked = true;
		            }

		            // Here I check if service is clicked and then click all the children....
		            if ($scope.checkedIndicatorState[category]) {
		                // Iterate through all the children
		                for (var i = 0; i < $scope.indicatorCategory1[category].length; i++) {
		                    $scope.checkedIndicatorState[$scope.indicatorCategory1[category][i].category1] = true;
		                }
		            }
		            // check if service is checked and if it is, then iterate and check all the category that are opened up....
		            // Also save the 
		        }
		        else if (id2 == 2) // Category2 after category 1
		        {
		            $scope.indicatorCategory2[category] = data;
		            if ($scope.level1ExpandIndicator[category] == true) {
		                $scope.level1ExpandIndicator[category] = false;
		            }
		            else {
		                $scope.level1ExpandIndicator[category] = true;
		            }

		            if ($scope.checkedIndicatorState[category]) {
		                // Iterate through all the children
		                for (var j = 0; j < $scope.indicatorCategory2[category].length; j++) {
		                    $scope.checkedState[$scope.indicatorCategory2[category][j].category2] = true;
		                }
		            }
		        }
		        else if (id2 == 3) // Category2 after category 1
		        {
		            $scope.category3 = data;
		        }
		    }
		});
    }



    $scope.drillAllDown = function (drillType) {
        $scope.dataToShow = [];
        if ($scope.drillDownReportData.length == 0) // This is the first level push the data up...
        {
            $scope.dataToShow = $scope.filteredData.filteredCustomReportData;
        }
        else {
            $scope.dataToShow = $scope.drillDownReportData;
        }

        $scope.drillDown($scope.dataToShow, drillType, true)
    }

    $scope.setServiceElementType = function()
    {
        $scope.dataElementsArray = [];
        $scope.serviceClicked = true;
        //$scope.checkedState['service'] = false;
        //$scope.checkedState['service'] = true;              
       
        var reportTypeCategory = "service";
        var categoryParameters = {
            "reportType": reportTypeCategory, "categoryList": $scope.checkedState, "serviceElementType": $scope.serviceElements.type
        };

        $scope.getServiceDataElementsPost(categoryParameters);

        $scope.getCategory(1, 1, 'service');

        //$scope.checkedStateChanged(1, 'service', null, checkedState['service'], category1['service'], 0);
    }


    $scope.drillDown = function (dataToDrillDown, drillType, drillAll)
    {
        // clear first any previously loaded selections             
        // drill down for that year to the lowest admin site and set the Year range properly
        // Another option is to drill down to months for that year, for now just admin site breakdown for that year
        if (drillType == "chart") {
            if (($scope.selectedAxis.xAxis) == "FiscalYear") {
                $scope.PeriodSelect.StartFiscalYear = dataToDrillDown.FiscalYear;
                $scope.PeriodSelect.EndFiscalYear = dataToDrillDown.FiscalYear;
                $scope.PeriodRange.range = "PeriodRangeYearly";
            }
        }
        if ($scope.institutionAggrOptions.aggrType == "federal") {
            $scope.institutionAggrOptions.hmiscode = 20;
            $scope.institutionAggrOptions.facilityTypeId = 11;
            $scope.institutionAggrOptions.aggrType = "region";
        }
        else if ($scope.institutionAggrOptions.aggrType == "region") {
            $scope.institutionAggrOptions.hmiscode = dataToDrillDown.RegionId;
            $scope.institutionAggrOptions.facilityTypeId = 10;

            $scope.institutionAggrOptions.aggrType = "zone";
        }
        else if ($scope.institutionAggrOptions.aggrType == "zone") {

            if (dataToDrillDown.ZoneId == 0) {
                //No Zone_Woreda_Arada Kifle Ketema
                var str = dataToDrillDown.ZoneName;
                var regionalHospitals = str.includes("NoZone_Province");
                var noZoneWoredas = str.includes("NoZone_District");

                if (regionalHospitals) // These are regional Hospitals 
                {
                    $scope.institutionAggrOptions.aggrType = "facility";

                    $scope.institutionAggrOptions.facilityTypeId = 10;
                    $scope.institutionAggrOptions.hmiscode = dataToDrillDown.RegionId;

                    $scope.institutionAggrOptions.reportingFacilityTypeId = 10;
                }
                else if (noZoneWoredas) // Woredas with no Zone
                {
                    $scope.institutionAggrOptions.aggrType = "district";
                    $scope.institutionAggrOptions.facilityTypeId = 10;
                    $scope.institutionAggrOptions.hmiscode = dataToDrillDown.RegionId;

                }
            }
            else { // Normal zones

                $scope.institutionAggrOptions.hmiscode = dataToDrillDown.ZoneId
                $scope.institutionAggrOptions.facilityTypeId = 9;
                $scope.institutionAggrOptions.aggrType = "district";
            }
        }
        else if ($scope.institutionAggrOptions.aggrType == "district") {
            $scope.institutionAggrOptions.aggrType = "facility";
            var str = dataToDrillDown.DistrictName;
            var zonalFacilities = str.includes("NoDistrict_Zone");

            if (zonalFacilities) // Zonal facilities
            {
                $scope.institutionAggrOptions.facilityTypeId = 9;
                $scope.institutionAggrOptions.hmiscode = dataToDrillDown.ZoneId;
                $scope.institutionAggrOptions.reportingFacilityTypeId = 9;
            }
            else {
                $scope.institutionAggrOptions.hmiscode = dataToDrillDown.DistrictId
                $scope.institutionAggrOptions.facilityTypeId = 8;
                $scope.institutionAggrOptions.aggrType = "facility";
            }

        }
        else {
            alert($scope.analytics['drillDownCompleted']);
            return;
        }

        $scope.elementArray = [];
        $scope.reportType = "";

        if ($scope.currentClicked.service) {
            $scope.elementArray = $scope.dataElementsArray;
            $scope.reportType = "service";
        }
        else if ($scope.currentClicked.disease) {
            $scope.elementArray = $scope.diseaseDataElementsArray;
            $scope.reportType = "disease";

            for (var i = 0; i < $scope.elementArray.length; i++) {
                if ($scope.elementArray[i].Disease != undefined) {
                    if ($scope.elementArray[i].groupName != "") {
                        if ($scope.elementArray[i].groupName != dataToDrillDown.Disease) {
                            $scope.elementArray.splice(i, 1);
                            i--;
                        }
                    }
                    else {
                        if ($scope.elementArray[i].Disease != dataToDrillDown.Disease) {
                            $scope.elementArray.splice(i, 1);
                            i--;
                        }
                    }
                }
            }
        }
        else if ($scope.currentClicked.indicator) {
            $scope.elementArray = $scope.indicatorsArray;
            $scope.reportType = "indicator";
        }

        for (var i = 0; i < $scope.elementArray.length; i++) {
            if (($scope.elementArray[i].Checked == false) && (($scope.elementArray[i].groupName == "") || ($scope.elementArray[i].groupName == undefined))) {
                $scope.elementArray.splice(i, 1);
                i--;
            }
        }

        var analyticsParameters = {
            "dataElements": $scope.elementArray, "dataElementsPivot": $scope.pivotType.type, "reportType": $scope.reportType,
            "DiseaseOptions": $scope.diseaseOptions, "InstitutionAggrOptions": $scope.institutionAggrOptions,
            "PeriodSelect": $scope.PeriodSelect, "FacilityTypes": $scope.checkedFacTypes, "PeriodRange": $scope.PeriodRange.range,
            "UserId": JSON.parse(Cookies.get('logged-in')).UserId, "serviceElementType": $scope.serviceElements.type,
            "LocationIDs": $scope.SelectedLocationId,
            "FilterFacilityType": $scope.SelectedLocationFacilityType,
        };

        if (drillType == "table") {
            $('.progress').show();
        }

        var resetVariables = function () {
            if (drillType == "table") {
                
                $scope.drillDownReportColumns = [];
                //$scope.drillDownReportData = data[1];

                $scope.customReportColumns = [];
                $scope.customReportColumnsLength = 0;
                $scope.customReportColumnsLanguage = [];
                $scope.customReportColumnsLanguageLength = 0;
                $scope.customReportData = [];
                $scope.searchedReportSize = 0;
                $scope.limitedData = 0;
            }
            else if (drillType == "chart") {
                $scope.drillDownReportColumns = [];
                $scope.drillDownReportData = [];
            }
        }

        AnalyticsFactory.getReportServicePost(analyticsParameters)
       .then(function (data) {
           // Reset first
           resetVariables();
           $scope.ReportsDisplay = data;

           if (drillType == "table") {
               $scope.drillDownReportColumns = data[0];
               //$scope.drillDownReportData = data[1];
               $scope.drillDownReportColumnsLength = $scope.drillDownReportColumns.length;
               $scope.customReportColumns = data[0];
               $scope.customReportColumnsLength = $scope.customReportColumns.length;
               $scope.drillDownReportColumns = data[0];
               $scope.customReportData = data[1];
               $scope.drillDownReportData = data[1];
               $scope.searchedReportSize = $scope.customReportData.length;
               $scope.limitedData = $scope.searchedReportSize;

               $scope.customReportColumnsLanguage = data[3];
               $scope.customReportColumnsLanguageLength = $scope.customReportColumnsLanguage.length;
           }
           else if (drillType == "chart") {
               //$scope.drillDownReportColumns = data[0];
               //$scope.drillDownReportColumnsLength = $scope.drillDownReportColumns.length;
               //$scope.drillDownReportData = data[1];
               // $scope.searchedReportSize = $scope.drillDownReportData.length;
               //$scope.limitedData = $scope.searchedReportSize;
               $scope.drillDownReportColumns = data[0];
               //$scope.drillDownReportData = data[1];

               $scope.drillDownReportColumnsLength = $scope.drillDownReportColumns.length;
               $scope.customReportColumns = data[0];
               $scope.customReportColumnsLength = $scope.customReportColumns.length;
               $scope.drillDownReportColumns = data[0];
               $scope.customReportData = data[1];
               $scope.drillDownReportData = data[1];
               $scope.searchedReportSize = $scope.customReportData.length;
               $scope.limitedData = $scope.searchedReportSize;

               $scope.customReportColumnsLanguage = data[0];
               $scope.customReportColumnsLanguageLength = $scope.customReportColumnsLanguage.length;
           }

       });
    }

    $scope.aggregateData = function()
    {

    }

    // New DashBoard.....................................................................................
    // New DashBoard.....................................................................................

    $scope.currentDashBoardName = [];

    $scope.getDashBoardItems = function()
    {
        $scope.getFileNames();
        $scope.getDashBoards();
    }

    $scope.getFileNames = function () {
        AnalyticsFactory.getFileNamesService()
       .then(function (data) {
           $scope.fileNames = data;

           for (var i = 0; i < $scope.fileNames.length; i++) {

           }
       });
    }

    $scope.getDashBoards = function () {
        AnalyticsFactory.getDashBoardsService()
       .then(function (data) {
           $scope.dashBoardLists = data;

           for (var i = 0; i < $scope.dashBoardLists.length; i++) {

           }
       });
    }

    $scope.setDashBoardImage = function (fileName) {
        $scope.clickedFileName = fileName;
    }
    
    $scope.chartDataDashBoard = function (dashBoard, id) {
      
        //$scope.selectedAxis.SelectedXAxis = dashBoard.SelectedXAxis;
        //$scope.selectedAxis.SelectedYAxis = dashBoard.SelectedYAxis;
        //$scope.selectedAxis.ChartType = dashBoard.ChartType;
       
        ////$scope.setDashBoardChartType(dashBoard.ChartData);

        //$scope.dataToShow = dashBoard.ChartData;

        //if (($scope.selectedAxis.ChartType == "Pie_Chart")) {           
        //    $scope.chartData = $scope.dataToShow;
        //}
        //else if ($scope.selectedAxis.ChartType == "Donut_Chart") {           
        //    $scope.chartData = $scope.dataToShow;
        //}
        //else if (($scope.selectedAxis.ChartType == "Line_Chart")) {           
        //    $scope.chartData = [
        //                      {
        //                          key: "LineChart",
        //                          //"color": "#d62728",
        //                          //values: window.cachedTableData
        //                          values: $scope.dataToShow
        //                      }
        //    ];
        //}
        //else if ($scope.selectedAxis.ChartType == "Bar_Chart") {            
        //    $scope.chartData = [
        //      {
        //          key: "Bar Chart",
        //          //"color": "#d62728",
        //          //values: window.cachedTableData
        //          values: $scope.dataToShow
        //      }
        //    ];
        //}
        //    //else if ($scope.selectedAxis.ChartType == "MultiBar_Chart") {
        //    //    $scope.groupByMultiChart();
        //    //}
        //    //else if ($scope.selectedAxis.ChartType == "MultiBarHorizontal_Chart") {
        //    //    $scope.groupByMultiChart();
        //    //}
        //else {           
        //    $scope.chartData = [
        //      {
        //          key: "BarChart",
        //          //"color": "#d62728",
        //          //values: window.cachedTableData
        //          values: $scope.dataToShow
        //      }
        //    ];
        //}


        //return $scope.chartData;

        var str = "";
        str = name;
        var pieChart = str.includes("Blood");
        var anotherPieChart = str.includes("chartHIV");
        if (id == 1) {
            //$scope.chartOptions = $scope.chartOptionsPieDashBoard;
            $scope.chartData = $scope.chartDataTempPIE;
        }
            //else if (anotherPieChart) {
            //    //$scope.chartOptions = $scope.chartOptionsPieDashBoard;
            //    $scope.chartData = $scope.chartDataTempPIE;
            //}
        else {
            //$scope.chartOptions = $scope.chartOptionsTemp;
            $scope.chartData = $scope.chartDataTempBar;
        }
        return $scope.chartData;
    }
    
    $scope.chartOptionsDashBoard = function (dashBoard, id)
    {
        //$scope.selectedAxis.SelectedXAxis = dashBoard.SelectedXAxis;
        //$scope.selectedAxis.SelectedYAxis = dashBoard.SelectedYAxis;
        //$scope.selectedAxis.ChartType = dashBoard.ChartType;       

        ////$scope.dataToShow = data;

        //if (($scope.selectedAxis.ChartType == "Pie_Chart")) {
        //    $scope.chartOptions = $scope.chartOptionsPieDashBoard;           
        //}
        //else if ($scope.selectedAxis.ChartType == "Donut_Chart") {
        //    $scope.chartOptions = $scope.chartOptionsDonutDashBoard;           
        //}
        //else if (($scope.selectedAxis.ChartType == "Line_Chart")) {
        //    $scope.chartOptions = $scope.chartOptionsLineDashBoard;         
        //}
        //else if ($scope.selectedAxis.ChartType == "Bar_Chart") {
        //    $scope.chartOptions = $scope.chartOptionsBarDashBoard;           
        //}
        //    //else if ($scope.selectedAxis.ChartType == "MultiBar_Chart") {
        //    //    $scope.groupByMultiChart();
        //    //}
        //    //else if ($scope.selectedAxis.ChartType == "MultiBarHorizontal_Chart") {
        //    //    $scope.groupByMultiChart();
        //    //}
        //else {
        //    $scope.chartOptions = $scope.chartOptionsBarDashBoard;          
        //}


        //return $scope.chartOptions;

        var str = "";
        str = name;
        var pieChart = str.includes("Blood");
        var anotherPieChart = str.includes("chartHIV");
        $scope.myLabel = "label";
        $scope.myValue = "value";

        if (id == 1) {
            $scope.chartOptions = $scope.chartOptionsPieDashBoard;
            //$scope.chartData = $scope.chartDataTempPIE;
        }
            //else if (anotherPieChart) {
            //    $scope.chartOptions = $scope.chartOptionsPieDashBoard;
            //    //$scope.chartData = $scope.chartDataTempPIE;
            //}
        else {
            $scope.chartOptions = $scope.chartOptionsTemp;
            //$scope.chartData = $scope.chartDataTempBar;
        }
        return $scope.chartOptions;
    }


    $scope.chartOptionsTest = function (name,id) {
        var str = "";
        str = name;
        var pieChart = str.includes("Blood");
        var anotherPieChart = str.includes("chartHIV");
        if (id==1) {
            $scope.chartOptions = $scope.chartOptionsPieDashBoard;
            //$scope.chartData = $scope.chartDataTempPIE;
        }
        //else if (anotherPieChart) {
        //    $scope.chartOptions = $scope.chartOptionsPieDashBoard;
        //    //$scope.chartData = $scope.chartDataTempPIE;
        //}
        else {
            $scope.chartOptions = $scope.chartOptionsTemp;
            //$scope.chartData = $scope.chartDataTempBar;
        }
        return $scope.chartOptions;
    }

    $scope.chartDataTest = function (name,id) {
        var str = "";
        str = name;
        var pieChart = str.includes("Blood");
        var anotherPieChart = str.includes("chartHIV");
        if (id == 1) {
            //$scope.chartOptions = $scope.chartOptionsPieDashBoard;
            $scope.chartData = $scope.chartDataTempPIE;
        }
        //else if (anotherPieChart) {
        //    //$scope.chartOptions = $scope.chartOptionsPieDashBoard;
        //    $scope.chartData = $scope.chartDataTempPIE;
        //}
        else {
            //$scope.chartOptions = $scope.chartOptionsTemp;
            $scope.chartData = $scope.chartDataTempBar;
        }
        return $scope.chartData;
    }   

   
    $scope.chartDataTempBar = [
                {
                    key: "RegionalData",                    
                    values: $scope.chartDataTempPIE
                }
    ];

    $scope.chartDataTempPIE = [
                   {
                       "label": "A",
                       "value": 29.76
                   },
                   {
                       "label": "B",
                       "value": 4
                   },
                   {
                       "label": "C",
                       "value": 32.80
                   },
                   {
                       "label": "D",
                       "value": 196.45
                   },
                   {
                       "label": "E",
                       "value": 2.19
                   },
                   {
                       "label": "F",
                       "value": 98.07
                   },
                   {
                       "label": "G",
                       "value": 13.92
                   },
                   {
                       "label": "H",
                       "value": 5.13
                   }
    ];

    $scope.chartOptionsTemp = {
        chart: {
            type: 'discreteBarChart',
            height: 330,
            x: function (d) {
                return d[$scope.myLabel];
            },
            y: function (d) {
                return d[$scope.myValue];
            },
            showValues: true,
            valueFormat: function (d) {
                return d3.format(',.4f')(d);
            },
            dispatch: {
                tooltipShow: function (e) {
                    console.log('! tooltip SHOW !')
                },
                tooltipHide: function (e) {
                    console.log('! tooltip HIDE !')
                },
                beforeUpdate: function (e) {
                    console.log('! before UPDATE !')
                }
            },
            discretebar: {
                dispatch: {
                    //chartClick: function(e) {console.log("! chart Click !")},
                    elementClick: function (e) {
                        alert($scope.analytics['elementClicked']); console.log("! element Click !")
                    },
                    elementDblClick: function (e) {
                        console.log("! element Double Click !")
                    },
                    elementMouseout: function (e) {
                        console.log("! element Mouseout !")
                    },
                    elementMouseover: function (e) {
                        console.log("! element Mouseover !")
                    }
                }
            },
            callback: function (e) {
                console.log('! callback !')
            }
        }
    };


    $scope.chartOptionsBarDashBoard = {
        chart: {
            type: 'discreteBarChart',
            height: 330,
            x: function (d) {
                return d[$scope.selectedAxis.xAxis];
            },
            y: function (d) {
                return d[$scope.selectedAxis.yAxis];
            },
            xAxis: {
                axisLabel: 'X Axis',
                rotateLabels: 20,
                showMaxMin: false
            },
            yAxis: {
                axisLabel: 'Y Axis',
                axisLabelDistance: -10,
            },
            zoom: {
                enabled: true,
                scaleExtent: [1, 10],
                useFixedDomain: false,
                useNiceScale: false,
                horizontalOff: false,
                verticalOff: true,
                unzoomEventType: 'dblclick.zoom'
            },
            showValues: true,
            showLegend: true,
            useInteractiveGuideline: true,
            valueFormat: function (d) {
                return d3.format(',.0f')(d);
            },
            dispatch: {
                tooltipShow: function (e) {
                    console.log('! tooltip SHOW !')
                },
                tooltipHide: function (e) {
                    console.log('! tooltip HIDE !')
                },
                beforeUpdate: function (e) {
                    console.log('! before UPDATE !')
                }
            },
            discretebar: {
                dispatch: {
                    //chartClick: function(e) {console.log("! chart Click !")},
                    elementClick: function (e) {
                        //alert("ElementClicked! Name: " + e.data.Name + " Value: " + e.data.IndicatorValue); console.log("! element Click !");
                        $scope.hierarchicalDataNodes.push(e.data);
                        $scope.setNewData2(e);
                    },
                    elementDblClick: function (e) {
                        console.log("! element Double Click !")
                    },
                    elementMouseout: function (e) {
                        console.log("! element Mouseout !")
                    },
                    elementMouseover: function (e) {
                        console.log("! element Mouseover !")
                    }
                }
            },
            callback: function (e) {
                console.log('! callback !')
            }
        },
        // title options
        title: {
            enable: true,
            text: $scope.chartTitle
        },
    };

    $scope.chartOptionsLineDashBoard = {
        chart: {
            type: 'lineChart',
            height: 330,
            margin: {
                top: 20,
                right: 20,
                bottom: 70,
                left: 40
            },
            x: function (d) { return d[$scope.selectedAxis.xAxis]; },
            y: function (d) { return d[$scope.selectedAxis.yAxis]; },
            useInteractiveGuideline: true,
        }
    }

    $scope.chartOptionsPieDashBoard = {
        chart: {
            type: 'pieChart',
            height: 330,
            //x: function (d) { return d[$scope.selectedAxis.xAxis]; },
            //y: function (d) { return d[$scope.selectedAxis.yAxis]; },
            x: function (d) {
                return d[$scope.myLabel];
            },
            y: function (d) {
                return d[$scope.myValue];
            },
            showLabels: true,
            duration: 500,
            labelThreshold: 0.01,
            labelSunbeamLayout: true,
            pie: {
                dispatch: {
                    //chartClick: function(e) {console.log("! chart Click !")},
                    elementClick: function (e) {
                        //alert("ElementClicked! Name: " + e.data.Name + " Value: " + e.data.IndicatorValue); console.log("! element Click !");
                        $scope.hierarchicalDataNodes.push(e.data);
                        $scope.setNewData2(e);
                    },
                }
            },
            legend: {
                margin: {
                    top: 5,
                    right: 35,
                    bottom: 5,
                    left: 0
                }
            }
        }
    };

    $scope.chartOptionsMultiBarHorizontalDashBoard = {
        chart: {
            type: 'multiBarHorizontalChart',
            height: 330,
            x: function (d) { return d[$scope.selectedAxis.xAxis]; },
            y: function (d) { return d[$scope.selectedAxis.yAxis]; },
            showControls: true,
            showValues: true,
            showLabels: true,
            duration: 500,
            xAxis: {
                showMaxMin: false,
                rotateLabels: 20
            },
            yAxis: {
                axisLabel: 'Values',
                tickFormat: function (d) {
                    return d3.format(',.0f')(d);
                }
            },
            multibarhorizontal: {
                dispatch: {
                    //chartClick: function(e) {console.log("! chart Click !")},
                    elementClick: function (e) {
                        //alert("ElementClicked! Name: " + e.data.Name + " Value: " + e.data.IndicatorValue); console.log("! element Click !");
                        $scope.hierarchicalDataNodes.push(e.data);
                        $scope.setNewData2(e);
                    }                   
                }
            }
        }
    };


    $scope.chartOptionsMultiBarDashBoard = {
        chart: {
            type: 'multiBarChart',
            height: 330,
            x: function (d) { return d[$scope.selectedAxis.xAxis]; },
            y: function (d) { return d[$scope.selectedAxis.yAxis]; },
            showControls: true,
            showValues: true,
            showLabels: true,
            duration: 500,
            xAxis: {
                showMaxMin: false,
                rotateLabels: 20
            },
            yAxis: {
                axisLabel: 'Values',
                tickFormat: function (d) {
                    return d3.format(',.0f')(d);
                }
            }
        }
    };

    $scope.chartOptionsDonutDashBoard = {
        chart: {
            type: 'pieChart',
            height: 330,
            donut: true,
            x: function (d) { return d[$scope.selectedAxis.xAxis]; },
            y: function (d) { return d[$scope.selectedAxis.yAxis]; },
            showLabels: true,

            pie: {
                startAngle: function (d) { return d.startAngle - Math.PI },
                endAngle: function (d) { return d.endAngle - Math.PI },
                dispatch: {
                    //chartClick: function(e) {console.log("! chart Click !")},
                    elementClick: function (e) {
                        //alert("ElementClicked! Name: " + e.data.Name + " Value: " + e.data.IndicatorValue); console.log("! element Click !");
                        $scope.hierarchicalDataNodes.push(e.data);
                        $scope.setNewData2(e);
                    },
                }
            },
            duration: 500,
            legend: {
                margin: {
                    top: 5,
                    right: 70,
                    bottom: 5,
                    left: 0
                }
            }
        }
    };

    $scope.setDashBoardChartType = function (data) {

        // var updateChartData = function () {
        $scope.dataToShow = data;

        if (($scope.selectedAxis.ChartType == "Pie_Chart")) {
            $scope.chartOptions = $scope.chartOptionsPieDashBoard;
            $scope.chartData = $scope.dataToShow;
        }
        else if ($scope.selectedAxis.ChartType == "Donut_Chart") {
            $scope.chartOptions = $scope.chartOptionsDonutDashBoard;
            $scope.chartData = $scope.dataToShow;
        }
        else if (($scope.selectedAxis.ChartType == "Line_Chart")) {
            $scope.chartOptions = $scope.chartOptionsLineDashBoard;
            $scope.chartData = [
                              {
                                  key: "LineChart",
                                  //"color": "#d62728",
                                  //values: window.cachedTableData
                                  values: $scope.dataToShow
                              }
            ];
        }
        else if ($scope.selectedAxis.ChartType == "Bar_Chart") {
            $scope.chartOptions = $scope.chartOptionsBarDashBoard;
            $scope.chartData = [
              {
                  key: "Bar Chart",
                  //"color": "#d62728",
                  //values: window.cachedTableData
                  values: $scope.dataToShow
              }
            ];
        }
            //else if ($scope.selectedAxis.ChartType == "MultiBar_Chart") {
            //    $scope.groupByMultiChart();
            //}
            //else if ($scope.selectedAxis.ChartType == "MultiBarHorizontal_Chart") {
            //    $scope.groupByMultiChart();
            //}
        else {
            $scope.chartOptions = $scope.chartOptionsBarDashBoard;
            $scope.chartData = [
              {
                  key: "BarChart",
                  //"color": "#d62728",
                  //values: window.cachedTableData
                  values: $scope.dataToShow
              }
            ];
        }
        // }

        //$timeout(updateChartData, 0);

    }

    //End AnalyticCtrl..................
});


app.directive('onFinishRender', function ($timeout) {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            if (scope.$last === true) {
                $timeout(function () {
                    scope.$emit(attr.onFinishRender);
                });
            }
        }
    }
});

//app.directive('cacheReportTableDataDirective', function () {
//    return function (scope, element, attrs) {
//        if (scope.$last) {
//            setTimeout(function () {
//                window.cachedTableData = $.makeArray(
//                    $('#reportTable').Meliorator('parse-table')[0]
//                );
//            }, 10);
//        }
//    };
//})

app.directive('renderAnalyticsDirective', function (HostConfigFactory) {

    var serverConfig = HostConfigFactory.getHostConfigServer();
    var clientConfig = HostConfigFactory.getHostConfigClient();

    return function (scope, element, attrs) {           
        $('#analytics-panel').Meliorator('dashboard-panel', {
            data: window.cachedTableData,
            // the labels used on the analytics panel widget can be customized using the configuration option below
            labels: {
                domain:  'Select X-Axis',
                range:  'Select Y-Axis',
                domainAggregation: 'Aggregation',
                renderAs:  'Chart Type',
                renderVisuals: 'View',                
            },
            exportCallback: function (blob) {                
                var fd = new FormData();
                fd.append('data', blob);
                $.ajax({
                    type: 'POST',
                    url: serverConfig + 'api/Charts/Save',
                    data: fd,
                    processData: false,
                    contentType: false
                }).done(function (data) {
                    alert(data)
                });
            },
            saveDashboardCallback: function (dashboardSpec) {
                var timeStamp = (new Date()).toISOString();
                var autoDashboardName = "Dashboard-" + timeStamp;
                var thisDashboardName = prompt("Please set a name to help remember this Dashboard", autoDashboardName);
                if (thisDashboardName == null)
                    thisDashboardName = autoDashboardName;

                var loggedInUser = JSON.parse(Cookies.get('logged-in'));
                
                console.log("TITLE: " + thisDashboardName + " | USER: " + JSON.stringify(loggedInUser) + " | Dashboard: " + JSON.stringify(dashboardSpec) + " | Source SQL: " + scope.generatedSQLQuery);

                $.ajax({
                    type: 'POST',
                    url: serverConfig + 'api/Charts/CreateDashboard',
                    data: JSON.stringify({
                        UserId: loggedInUser.UserId, 
                        DashboardSpec: JSON.stringify(dashboardSpec),
                        DataSQL: scope.generatedSQLQuery,
                        Title: thisDashboardName
                    }),
                    contentType: "application/json"
                }).done(function (data) {
                    alert(data)
                });
            }
        });
    };
})


