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

/*
* global angular app instance "app", defined in the app.js file
*/

app.controller('ReportsController', function ($scope, ReportsService) {

    // data/model...
    $scope.data = {
        report_periods: ['Monthly', 'Quarterly', 'Annual', 'Weekly'],
        export_formats: ['MS Excel (Formatted)', 'MS Excel (Data)', 'MS Word', 'PDF'],
        report_types: [] // we'll later fetch the real list from the service, based on periodicity specified and our current location level
    }

   

    $scope.current_year = (new Date()).getFullYear() - 8; // not exactly always correct hack, so we adjust to the Eth Calendar Yr...
    $scope.max_year = $scope.current_year + 1;
    $scope.min_year = 2000;

    $scope.status = 'Set parameters, click Generate, to proceed...';
    $scope.status_class = 'info';
    $scope.report_title = "";
    $scope.report_url = "";

    $scope.location_level = 0; // should be set based on loc level of global site settings for current user...

    

    $scope.updateReportTypes = function () {

        //obtain values via the values service...
        ReportsService.getReportTypes($scope.data.selected_period, $scope.location_level, function (response) {
            $scope.data.report_types = response.data; // update the scope ref, which will update the grid automatically
            $scope.status_class = 'info';
            $scope.status = "Report types for the period " + $scope.data.selected_period + " loaded";
        }, function (error) {
            //$scope.data = response.data; // update the scope ref, which will update the grid automatically
            $scope.status_class = 'danger';
            $scope.status = "Failed to get report types for the period " + $scope.data.selected_period;
        });

    }

    // init the bootstrap switch stuff...
    $.fn.bootstrapSwitch.defaults.size = 'large';
    $.fn.bootstrapSwitch.defaults.onColor = 'success';
    $('input[data-toggle-switch="true"]').bootstrapSwitch();

    //let's init the reports params
    $scope.data.selected_period = $scope.data.report_periods[0];// just to init...
    $scope.updateReportTypes();

});
