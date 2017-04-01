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

app.controller('DashboardsCtrl', function ($scope, $timeout, HostConfigFactory) {

    var serverConfig = HostConfigFactory.getHostConfigServer();
    var clientConfig = HostConfigFactory.getHostConfigClient();

    $scope.init = function () {
        var loggedInUser = JSON.parse(Cookies.get('logged-in'));
        $.ajax({
            type: 'GET',
            url: serverConfig + 'api/Charts/GetDashboards',
            data: {
                UserId: loggedInUser.UserId
            }
        }).done(function (data) {
            $scope.dashboards = data;
            // load first one...
            if (data.length > 0) {
                $scope.loadDashboard(data[0])
            }
        });
    }
    

    $scope.loadDashboard = function (dash) {
        //alert(dash.dashboardSpec);
        $.ajax({
            type: 'POST',
            url: serverConfig + 'api/Charts/GetDashboardData',
            data: JSON.stringify({
                DataSQL: dash.dataSQL
            }),
            contentType: "application/json"
        }).done(function (data) {
            
            $('#dashboard').Meliorator('dashboard', {
                data: data,
                dashboardSpec: { title: dash.title, spec: JSON.parse(dash.dashboardSpec) },
                // the labels used on the analytics panel widget can be customized using the configuration option below
                labels: {
                    domain: 'Select Domain',
                    range: 'Select Series',
                    domainAggregation: 'Domain Aggregation',
                    renderAs: 'Render As',
                    renderVisuals: 'Render',
                }
            });

        });
    }

    $timeout($scope.init,0);

});