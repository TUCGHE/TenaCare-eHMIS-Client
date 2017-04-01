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

app.controller('backupAndRestore', function ($scope, myService, LanguageFactory) {
   
    var className = "backupAndRestore";
    var lang = $scope.languageSet;

    $scope.backupAndRestore = {};

    $scope.getLanguageLabel = function (lang, className) {
        LanguageFactory.getLanguageLabelService(lang, className)
		.then(function (data) {
		    $scope.values = data;

		    for (var i = 0; i < $scope.values.length; i++) {
		        $scope.backupAndRestore[$scope.values[i].indexName] = $scope.values[i].LanguageName;
		    }

		    $scope.databaseName = $scope.backupAndRestore['ehmis'];
		    $scope.titleName = $scope.backupAndRestore['newBackupSchedule'];
		    $scope.showAddButton = true;
		    $scope.showUpdateButton = false;
		    $scope.periodOptions = [{ name: $scope.backupAndRestore['daily'], value: 0 }, { name: $scope.backupAndRestore['weekly'], value: 1 },
                { name: $scope.backupAndRestore['monthly'], value: 2 }];

		    $scope.options = [{ name: "1", value: 1 }, { name: "2", value: 2 }, { name: "3", value: 3 }, { name: "4", value: 4 },
                             { name: "5", value: 5 }, { name: "6", value: 6 }, { name: "7", value: 7 }, { name: "8", value: 8 },
                             { name: "9", value: 9 }, { name: "10", value: 10 }, { name: "11", value: 11 }, { name: "12", value: 12 }, { name: "13", value: 13 },
                             { name: "14", value: 14 }, { name: "15", value: 15 }, { name: "16", value: 16 }, { name: "17", value: 17 },
                             { name: "18", value: 18 }, { name: "19", value: 19 }, { name: "20", value: 20 }, { name: "21", value: 21 },
                             { name: "22", value: 22 }, { name: "23", value: 23 }, { name: "24", value: 24 }, { name: "25", value: 25 }, { name: "26", value: 26 },
                             { name: "27", value: 27 }, { name: "28", value: 28 }, { name: "29", value: 29 }, { name: "30", value: 30 }, { name: "31", value: 31 }];

		    $scope.dayoptions = [{ name: $scope.backupAndRestore['monday'], value: 1 }, { name: $scope.backupAndRestore['tuesday'], value: 2 },
                              { name: $scope.backupAndRestore['wednesday'], value: 3 }, { name: $scope.backupAndRestore['thursday'], value: 4 },
                              { name: $scope.backupAndRestore['friday'], value: 5 }, { name: $scope.backupAndRestore['saturday'], value: 6 },
                              { name: $scope.backupAndRestore['sunday'], value: 0 }]


		})
    }

    lang = localStorage.getItem('languageSet', 'english');

    $scope.getLanguageLabel(lang, className);
   
    $scope.startDataBaseBackup = function (databaseName)
    {
        myService.StartBackupAndRestore(databaseName)
        .then(function (response)
        {
            $scope.status1 = response.data[0];
            $scope.message1 = response.data[1];
            if ($scope.status1 == true) {
                alert($scope.message1);
            }
            else {
                alert($scope.message1);
            }
        });
    }
    $scope.getlistofTask = function ()
    {
        myService.GetListOfTasks()
        .then(function (data)
        {
            $scope.ListofTasks = data;
        });

    }
    $scope.editTask = function (list)
    {
        $scope.titleName = $scope.backupAndRestore['editSelectedSchedule'];
        $scope.showAddButton = false;
        $scope.showUpdateButton = true;
        if ( list == 0) {
            $scope.Period = 0;
            $scope.Period = $scope.periodOptions[0];

        }
        else if (list == 1) {
            $scope.Period = 1;
            $scope.Period = $scope.periodOptions[1];
        }
        else
        {
            $scope.Period = 2;
            $scope.Period = $scope.periodOptions[2];
        }
           
    }
    $scope.deleteScheduledBackup = function (taskDelete)
    {
        myService.DeleteScheduledBackup(taskDelete)
        .then(function (response)
        {
            $scope.message = response.data[0];
            if ($scope.message == true)
            {
                alert($scope.backupAndRestore['scheduleSuccessfullyDeleted']);
                $scope.getlistofTask();
            }
            else
                alert($scope.backupAndRestore['scheduleNotDeleted']);
        });
    }
    $scope.updateScheduledBackup = function (databaseName, period, day, time, userName, password) {
        var value = { "DatabaseName": databaseName, "Period": period, "Day": day, "Time": time, "UserName": userName, "Password": password };
        myService.UpdateScheduledBackup(value)
        .then(function (response) {
            $scope.message = response.data;
            if ($scope.message == "" || $scope.message == undefined) {
                alert($scope.backupAndRestore['scheduleSuccessfullyUpdated']);
                $scope.getlistofTask();
            }
            else
                alert($scope.message);
        });
    }

    $scope.startDataBaseRestore = function (databaseName) {

        var file = $scope.restoreFile;
        if (file == undefined) {
            alert($scope.backupAndRestore['pleaseChooseFileToImport']);
        }
        else {
            myService.uploadRestoreFile(file, databaseName)
            .then(function (response) {
                alert(response.data);
                angular.forEach(
             angular.element("input[type='file']"),
                function (inputElem) {
                    angular.element(inputElem).val(null);
                });
            });
        }
    }
    $scope.startScheduleBackup = function (databaseName, period, day, time, userName, password)
    {
        if (period == undefined)
        {
            alert($scope.backupAndRestore['pleaseChooseBackupPeriod']);
        }
        else if (time == undefined)
        {
            alert($scope.backupAndRestore['pleaseSpecifyTime']);
        }
        else if (password == undefined) {
            alert($scope.backupAndRestore['pleaseInsertPassword']);
        }  
        else {
            $scope.flag = 1;
            for (var i = 0; i <= $scope.ListofTasks.length ; i++)
            {
                var lists = $scope.ListofTasks[i];
                if(lists != undefined)
                    if (lists[0] == period) {
                        alert($scope.backupAndRestore['backupExists']);
                        $scope.flag = 0;
                    }
                    else {
                       
                    }
              
            }
            if ($scope.flag == 1)
            {
                var value = {
                    "DatabaseName": databaseName, "Period": period, "Day": day, "Time": time,
                    "UserName": userName, "Password": password
                };
                myService.ScheduleBackup(value)
                .then(function (response) {
                    $scope.message = response.data;
                    if ($scope.message == "" || $scope.message == undefined) {
                        alert($scope.backupAndRestore['scheduleSuccessfullyCreated']);
                        $scope.getlistofTask();
                    }
                    else
                        alert($scope.message);
                });
            }
           
          

        }
       
       
    }
});