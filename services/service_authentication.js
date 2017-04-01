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

app.service('AuthenticationService', function ($http, HostConfigFactory) {

    var serverConfig = HostConfigFactory.getHostConfigServer();
    var clientConfig = HostConfigFactory.getHostConfigClient();

    this.login = function (username, password, successCallback, errorCallback) {
        $http({
            method: 'POST',
            url: serverConfig + 'api/authentication/login',
            data: { username: username, password: password}
        }).then(successCallback, errorCallback);
    }

    this.getUsers = function (userId, successCallback, errorCallback) {
        $http({
            method: 'POST',
            url: serverConfig + 'api/authentication/users/',
            data: { UserId: userId }
        }).then(successCallback, errorCallback);
    }

    this.getAllRoles = function (successCallback, errorCallback) {
        $http({
            method: 'GET',
            url: serverConfig + 'api/authentication/roles/'
        }).then(successCallback, errorCallback);
    }

    this.updateUser = function (user, roles, successCallback, errorCallback) {
        $http({
            method: 'POST',
            url: serverConfig + 'api/authentication/update_user/',
            data: { user: user, roles: roles }
        }).then(successCallback, errorCallback);
    }

    this.createUser = function (user, successCallback, errorCallback) {
        $http({
            method: 'POST',
            url: serverConfig + 'api/authentication/create_user/',
            data: user
        }).then(successCallback, errorCallback);
    }

    this.deleteUser = function (userid, successCallback, errorCallback) {
        $http({
            method: 'POST',
            url: serverConfig + 'api/authentication/delete_user/',
            data: { UserId: userid }
        }).then(successCallback, errorCallback);
    }
});
