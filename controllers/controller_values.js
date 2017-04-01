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

// this is the Values Controller...
// loads the Values edit grid, pulling data in, via the Values Service...

app.controller('ValuesController', function ($scope, ValueService) {

    $scope.status = 'Loading...';
    $scope.status_class = 'info';

    $scope.data = [];// initially... later, the data can change any way...
    $scope.gridOptions = {
        data: 'data',// set this to a reference name (resolves to scope variable), so it can be auto populated (doesn't work that way if u just use an obj directly)
        columnDefs: [
            { name: "ValueID", displayName: "ID", visible: true, enableCellEdit: false },
            { name: "LabelID", displayName: "LabelID", visible: false },
            { name: "DataEleClass", displayName: "DataEleClass", visible: false },
            { name: "FederalID", displayName: "FederalID", visible: false },
            { name: "RegionID", displayName: "RegionID", visible: false },
            { name: "ZoneID", displayName: "ZoneID", visible: false },
            { name: "WoredaID", displayName: "WoredaID", visible: false },
            { name: "LocationID", displayName: "LocationID", visible: false },
            { name: "Week", displayName: "Week", visible: false },
            { name: "Month", displayName: "Month", visible: false },
            { name: "Quarter", displayName: "Quarter", visible: false },
            { name: "Year", displayName: "Year", visible: true },
            { name: "Value", displayName: "Value", visible: true },
            { name: "Level", displayName: "Level", visible: false },
            { name: "FACILITTYPE", displayName: "FACILITTYPE", visible: true },
            { name: "DateEntered", displayName: "DateEntered", visible: false },
            { name: "Editable", displayName: "Editable", visible: false },
        ],
        onRegisterApi: function (gridApi) {
            //set gridApi on scope
            $scope.gridApi = gridApi;
            gridApi.edit.on.afterCellEdit($scope, function (rowEntity, colDef, newValue, oldValue) {
                //Do your REST call here via $http.get or $http.post

                //Alert to show what info about the edit is available
                //alert('Column: ' + colDef.name + ' ID: ' + rowEntity.ValueID + ' OLD VAL: ' + oldValue + ' NEW VAL: ' + newValue);
                ValueService.save(rowEntity, function (response) {
                    var val = response.data;
                    if (val != null) {
                        $scope.status_class = 'success';
                        $scope.status = "Saved changes to API... (Col:" + colDef.name + ", Row: " + val.ValueID + ", Data:" + val[colDef.name] + ")";
                    } else {
                        $scope.status_class = 'danger';
                        $scope.status = "Couldn't commit the change to the API. Try again later, or report the problem";
                    }
                    //alert(JSON.stringify(response));
                });
            });
        }
    };

    // then we shall feth the values data...
    this.fetch = function (limit) {
        //obtain values via the values service...
        ValueService.get(limit, function (response) {
            $scope.data = response.data; // update the scope ref, which will update the grid automatically
            $scope.status_class = 'info';
            $scope.status = "Values have been loaded.";
        }, function (error) {
            //$scope.data = response.data; // update the scope ref, which will update the grid automatically
            $scope.status_class = 'danger';
            $scope.status = "Failed to load the values... there might be an API connectivity issue. Report problem, or refresh.";
        });
    }

    //just to instantiate things...
    this.fetch(10);

});
