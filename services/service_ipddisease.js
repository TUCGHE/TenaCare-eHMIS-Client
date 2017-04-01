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

app.service("myService", function ($http, HostConfigFactory) {

    var serverConfig = HostConfigFactory.getHostConfigServer();
    var clientConfig = HostConfigFactory.getHostConfigClient();

    //get All Eployee
    this.getDisease = function () {

        return $http.get("http://localhost:6485/api/values/");
    };

    this.getValues = function (year, month) {
        return $http.get("http://localhost:6485/api/values/" + year + "/" + month);
        /*var response = $http({
            method : "GET",
            URL: "http://localhost:6485/api/values/",
            params: {
            id: JSON.stringify(year, month)}
      
        });
        return response;*/
    }

    this.getValuesService = function (id, locationId, year, month, reportType) {
        return $http.get(serverConfig + "api/EhmisValues/?id=0" + "&locationId=" + locationId + "&year=" + year + "&month=" + month + "&reportType=" + reportType)
            .then(function (response) {
                console.log(response); //I get the correct items, all seems ok here				  				
                return response.data;
            });
        return this;
    }
    this.getIPDDictionaryService = function () {
        return $http.get(serverConfig + "api/EhmisValues/2")
            .then(function (response) {
                console.log(response); //I get the correct items, all seems ok here				  				
                return response.data;
            });
        return this;
    }

    this.getIPDDictionary = function (response) {
        $http.get(serverConfig + "api/EhmisValues/2").then(response);
    }


    // Add Employee
    this.AddRec = function (values) {

        var response = $http({
            method: "POST",
            url: "http://localhost:6485/api/values/",
            dataType: "json",
            headers: {
                "Content-Type": "application/json"
            },
            //data: values
            data: JSON.stringify(values)
        });

        return response;
    }
    this.AddNewDataElements = function (values) {

        var response = $http({
            method: "POST",
            url: serverConfig + "api/NewDataElementsIndicators/",
            dataType: "json",
            headers: {
                "Content-Type": "application/json"
            },
            //data: values
            data: JSON.stringify(values)
        });

        return response;
    }
    this.PostNewIndicator = function (id, value) {

        var response = $http({
            method: "POST",
            url: serverConfig + "api/NewDataElementsIndicators/?id=" + id,
            dataType: "json",
            headers: {
                "Content-Type": "application/json"
            },
            //data: values
            data: JSON.stringify(value)
        });

        return response;
    }
    this.AddNewDisease = function (diseaseName, id) {

        var response = $http({
            method: "POST",
            url: serverConfig + "api/NewDataElementsIndicators/?id=" + id + "&diseaseName=" + diseaseName,
            dataType: "json",
            headers: {
                "Content-Type": "application/json"
            },
            //data: values
            //  data: JSON.stringify(diseaseName)
        });

        return response;
    }
    this.ipdDataEntryFactory = function () {
        return $http.get(serverConfig + "api/EhmisValues/2")
            .then(function (response) {
                console.log(response); //I get the correct items, all seems ok here				  				
                return response.data;
            });
        return this;
    }

    this.getIPDReportService = function (id, selectedmonth, selectedQuarter, selectedyear, LocationId, checkedState, quarterCheckedState, selectedMonthEnd, selectedQuarterEnd) {
        return $http.get(serverConfig + "api/OfficialReports/?id=" + id + "&id1=" + selectedmonth + "&id4=" + selectedQuarter + "&id2=" + selectedyear + "&id3=" + LocationId + "&id5=" + checkedState + "&id6=" + quarterCheckedState + "&id7=" + selectedMonthEnd + "&id8=" + selectedQuarterEnd)
				.then(function (response) {
				    console.log(response); //I get the correct items, all seems ok here				  				
				    return response.data;
				});
        return this;
    }
    this.getOPDReportService = function (id, selectedmonth, selectedQuarter, selectedyear, LocationId, checkedState, quarterCheckedState, selectedMonthEnd, selectedQuarterEnd) {
        return $http.get(serverConfig + "api/OfficialReports/?id=" + id + "&id1=" + selectedmonth + "&id4=" + selectedQuarter + "&id2=" + selectedyear + "&id3=" + LocationId + "&id5=" + checkedState + "&id6=" + quarterCheckedState + "&id7=" + selectedMonthEnd + "&id8=" + selectedQuarterEnd)
				.then(function (response) {
				    console.log(response); //I get the correct items, all seems ok here				  				
				    return response.data;
				});
        return this;
    }
    this.getServiceReport = function (id, selectedmonth, selectedQuarter, selectedyear, LocationId, checkedState, quarterCheckedState, selectedMonthEnd, selectedQuarterEnd) {

        return $http.get(serverConfig + "api/OfficialReports/?id=" + id + "&id1=" + selectedmonth + "&id4=" + selectedQuarter + "&id2=" + selectedyear + "&id3=" + LocationId + "&id5=" + checkedState + "&id6=" + quarterCheckedState + "&id7=" + selectedMonthEnd + "&id8=" + selectedQuarterEnd)
				.then(function (response) {
				    console.log(response); //I get the correct items, all seems ok here				  				
				    return response.data;
				});
        return this;
    }
    this.getSiteSettingService = function (id) {
        return $http.get(serverConfig + "api/Location/?id=1" + "&locationid=" + id)
            .then(function (response) {
                console.log(response); //I get the correct items, all seems ok here
                return response.data;
            });
        return this;
    }

    this.getSiteName = function (id) {
        return $http.get(serverConfig + "api/OfficialReports/?id=" + id)
            .then(function (response) {
                console.log(response); //I get the correct items, all seems ok here
                return response.data;
            });
        return this;
    }

    this.uploadFileToUrl = function (file, uploadUrl, user) {
        // var fd = new FormData();
        //fd.append('file', file);

        return $http({
            method: 'POST',
            url: uploadUrl,
            transformRequest: angular.identity,
            headers: { 'Content-Type': undefined },

            transformRequest: function (data) {
                var formData = new FormData();

                formData.append("model", angular.toJson(data.model));
                formData.append("file", data.file);

                return formData;
            },
            //Create an object that contains the model and files which will be transformed
            // in the above transformRequest method
            data: { model: user, file: file }
        })

        .success(function (response) {
            return response;
        })

        .error(function (error) {
            response.data = response.ExceptionMessage;
            // alert(response.ExceptionMessage);
            return response;
        });
    }
    this.uploadExcelFile = function (file, uploadUrl, user, selectedYear) {
        // var fd = new FormData();
        //fd.append('file', file);

        return $http({
            method: 'POST',
            url: uploadUrl,
            transformRequest: angular.identity,
            headers: { 'Content-Type': undefined },

            transformRequest: function (data) {
                var formData = new FormData();

                formData.append("model", angular.toJson(data.model));
                formData.append("file", data.file);
                formData.append("year", angular.toJson(data.year));

                return formData;
            },
            //Create an object that contains the model and files which will be transformed
            // in the above transformRequest method
            data: { model: user, file: file, year: selectedYear }
        })

        .success(function (response) {
            return response;
        })

        .error(function (error) {
            response.data = response.ExceptionMessage;
            // alert(response.ExceptionMessage);
            return response;
        });
    }
    this.getImortedFileInfo = function () {
        return $http.get(serverConfig + "api/UploadImport/")
       .then(function (response) {
           console.log(response); //I get the correct items, all seems ok here
           return response.data;
       });
        return this;
    }
    this.SelectLabelDescription = function () {
        return $http.get(serverConfig + "api/NewDataElementsIndicators/")
        .then(function (response) {
            return response.data;
        });
    }
   
    this.getSpecificFacilities = function (id, hmisCode, nextStep) {
        return $http.get(serverConfig + "api/AddInstitution/?id= " + id + "&hmisCode=" + hmisCode + "&nextStep=" + nextStep)
              .then(function (response) {
                  return response.data;
              });
    }
    this.PostNewInstitution = function (value) {

        var response = $http({
            method: "POST",
            url: serverConfig + "api/AddInstitution/?id=1",
            dataType: "json",
            headers: {
                "Content-Type": "application/json"
            },
            data: JSON.stringify(value)
        });

        return response;
    }
    this.Getusername = function () {
        return $http.get(serverConfig + "api/BackupAndRestore/")
        .then(function (response) {
            return response.data;
        });
    }
    this.GetListOfTasks = function () {
        return $http.get(serverConfig + "api/BackupAndRestore/?id=1")
        .then(function (response) {
            return response.data;
        });
    }
    this.StartBackupAndRestore = function (databaseName) {

        var response = $http({
            method: "POST",
            url: serverConfig + "api/BackupAndRestore/?id=1",
            dataType: "json",
            headers: {
                "Content-Type": "application/json"
            },
            data: JSON.stringify(databaseName)
        });

        return response;
    }
    this.DeleteScheduledBackup = function (taskDelete) {

        var response = $http({
            method: "POST",
            url: serverConfig + "api/BackupAndRestore/?id=2",
            dataType: "json",
            headers: {
                "Content-Type": "application/json"
            },
            data: JSON.stringify(taskDelete)
        });

        return response;
    }
    this.UpdateScheduledBackup = function (value) {

        var response = $http({
            method: "POST",
            url: serverConfig + "api/BackupAndRestore/?id=1&id2=3",
            dataType: "json",
            headers: {
                "Content-Type": "application/json"
            },
            data: JSON.stringify(value)
        });

        return response;
    }
    this.ScheduleBackup = function (value) {

        var response = $http({
            method: "POST",
            url: serverConfig + "api/BackupAndRestore/?id=1&id2=2",
            dataType: "json",
            headers: {
                "Content-Type": "application/json"
            },
            data: JSON.stringify(value)
        });

        return response;
    }
    this.uploadRestoreFile = function (file, databaseName) {
        return $http({
            method: 'POST',
            url: serverConfig + "api/BackupAndRestore/",
            transformRequest: angular.identity,
            headers: { 'Content-Type': undefined },

            transformRequest: function (data) {
                var formData = new FormData();

                formData.append("model", angular.toJson(data.model));
                formData.append("file", data.file);

                return formData;
            },
            //Create an object that contains the model and files which will be transformed
            // in the above transformRequest method
            data: { model: databaseName, file: file }
        })
        .success(function (response) {
            return response;
        })
        .error(function (error) {
            response.data = response.ExceptionMessage;
            // alert(response.ExceptionMessage);
            return response;
        });
    }
});
