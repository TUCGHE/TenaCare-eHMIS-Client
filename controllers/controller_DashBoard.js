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

app.controller('analyticsCtrl', function ($scope, $timeout, AnalyticsFactory, AnalyticsFilterFactory)
{

    $scope.selectedAxis =
                      {
                          "xAxis": "",
                          "yAxis": "",
                          "AggregationType": "",
                          "ChartType": "",
                          "GroupBy": ""
                      };


    $scope.getFileNames = function () {
        AnalyticsFactory.getFileNamesService()
       .then(function (data) {
           $scope.fileNames = data;

           for (var i = 0; i < $scope.fileNames.length; i++) {

           }
       });
    }
  
    $scope.getChartOptions = function()
    {
        var updateChartData = function()
        {
            $scope.chartOptions = $scope.chartOptionsTemp;
        }

        $scope.$watch('chartOptionsTemp', function (newValue, oldValue) {
            $timeout(updateChartData, 0);
        });
       //return $scope.chartOptionsTemp;
    }

    $scope.getChartData = function () {
        var updateChartData = function () {
            $scope.chartData = $scope.chartDataTemp;
        }

        $scope.$watch('chartDataTemp', function (newValue, oldValue) {
            $timeout(updateChartData, 0);
        });
        //return $scope.chartOptionsTemp;
    }

    $scope.chartOptions = $scope.getChartOptions();
    $scope.chartData = $scope.getChartData();

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
                        alert("ElementClicked!"); console.log("! element Click !")
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

    $scope.chartDataTemp = [
             {
                 key: "Regional Data",
                 values: [
                     {
                         "label": "A",
                         "value": 29.76
                     },
                     {
                         "label": "B",
                         "value": 11
                     },
                     {
                         "label": "C",
                         "value": 32.80
                     },
                     {
                         "label": "D",
                         "value": 87.45
                     },
                     {
                         "label": "E",
                         "value": 3.19
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
                 ]
             }
    ];

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

});

