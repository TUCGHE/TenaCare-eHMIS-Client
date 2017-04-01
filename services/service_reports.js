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

app.service('ReportsService', function ($http) {

    this.getReportTypes = function (selected_period, location_level, successCallback, errorCallback) {
        var params = {};
        if (selected_period != undefined)
            params['period'] = selected_period;

        if (location_level != undefined)
            params['location_level'] = location_level;

        $http({
            method: 'GET',
            params: params,
            url: 'http://localhost:1790/api/reports/report_types'
        }).then(successCallback, errorCallback);
    }

});
