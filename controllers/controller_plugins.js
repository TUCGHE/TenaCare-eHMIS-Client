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

app.controller('PluginPowerBICtrl', function ($scope, PluginBIService) {

    $scope.biReports = {}

    PluginBIService.getReports(function (response) {
        $scope.biReports = response.data;
        // load the first one...
        var count = 0;
        for (report in $scope.biReports) {
            $scope.loadReport($scope.biReports[report]);
            count += 1;
            break;
        }
        if (count <= 1) {
            $('#biButtons').hide();
        }
           
    }, function (error) {
        alert("Failed to get the Power BI Reports", "Error", 5000);
    });

    $scope.loadReport = function (uri) {
        $('#powerbiEmbed').attr({ src: uri });
    }
});

//TENA Analytics
app.controller('TenaCtrl', function ($scope) {

   
});