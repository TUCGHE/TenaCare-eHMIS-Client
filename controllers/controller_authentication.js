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

app.controller('AuthenticationCtrl', function ($scope, AuthenticationService, LanguageFactory) {

    var className = "userPage";
    var lang = $scope.languageSet;

    $scope.userPage = {};

    $scope.getLanguageLabel = function (lang, className) {
        LanguageFactory.getLanguageLabelService(lang, className)
		.then(function (data) {
		    $scope.values = data;

		    for (var i = 0; i < $scope.values.length; i++) {
		        $scope.userPage[$scope.values[i].indexName] = $scope.values[i].LanguageName;
		    }
		})

        $scope.mainButtonColor = {
            "english": "lightgray",
            "arabic": "lightgray",
            "amharic": "lightgray",
            "french": "lightgray",
            "portuguese": "lightgray",
            "spanish": "lightgray"
        };

        $scope.mainButtonColor[lang] = "cornflowerblue";
    }

    $scope.mainButtonColor = {
        "english": "lightgray",
        "arabic": "lightgray",
        "amharic": "lightgray",
        "french": "lightgray",
        "portuguese": "lightgray",
        "spanish": "lightgray"
    };

    lang = localStorage.getItem('languageSet', undefined);

    if (lang === null) {
        lang = 'english';
    }
    
    $scope.mainButtonColor[lang] = "cornflowerblue";
    
    $scope.getLanguageLabel(lang, className);        

    $scope.setLanguage = function (langName) {

        //LanguageFactory.setLanguageService(langName);       

        $scope.mainButtonColor = {
            "english": "lightgray",
            "arabic": "lightgray",
            "amharic": "lightgray",
            "french": "lightgray",
            "portuguese": "lightgray",
            "spanish": "lightgray"
        };

        $scope.mainButtonColor[langName] = "cornflowerblue";
        localStorage.setItem('languageSet', langName);

        location.reload();
    }

    //Cookies.set('logged-in', '{"FullName": "Robot", "UserId":"Hello World"}');

    if (Cookies.get('logged-in')) { // we are already logged-in, just redirect to main page
        //alert($scope.userPage['youAreAlreadyLoggedin'], $scope.userPage['authenticationSuccess'], 5000);
        window.location = 'mainPage.html';
    }

    $scope.login = function () {

        var username = $('#username').val(), password = $('#password').val();
        if (username.length == 0) {
            alert($scope.userPage['sorryPleaseSetTheUserNameThenTryAgain'],
                $scope.userPage['authentication'], 2000);
            return;
        }

        if (password.length == 0) {
            alert($scope.userPage['sorryPleaseSetThePasswordThenTryAgain'], $scope.userPage['authentication'], 2000);
            return;
        }

        var rememberMe = $('#cbxRememberMe').prop('checked');

        AuthenticationService.login(username, password, function (reponse) {
            // so we can recall this next visit and on other pages...
            if (rememberMe) {
                Cookies.set('logged-in', reponse.data // contains the user object
                    , {
                    expires: 7 //days
                });
            } else { // it's only for this session...
                Cookies.set('logged-in', reponse.data);
            }
           

            // success, redirect to main page...
            //alert($scope.userPage['waitAsWeRedirectYouToTheMainPage'], $scope.userPage['authenticationSuccess'], 0);
            window.location = 'mainPage.html';

        }, function () {
            // failure, report error
            Cookies.remove('logged-in'); // just in case... any failed login attempts should immediately invalidate any existing valid ones
            alert($scope.userPage['sorryLoginFailed'], $scope.userPage['authentication'], 5000);           

        });

    }

});


app.controller('UserCtrl', function ($scope, AuthenticationService, LanguageFactory) {
    
    $scope.allUserRoles = {};

    $scope.status_class = {};
    $scope.status = {};

    var className = "userPage";
    var lang = $scope.languageSet;

    $scope.userPage = {};

    $scope.getLanguageLabel = function (lang, className) {
        LanguageFactory.getLanguageLabelService(lang, className)
		.then(function (data) {
		    $scope.values = data;

		    for (var i = 0; i < $scope.values.length; i++) {
		        $scope.userPage[$scope.values[i].indexName] = $scope.values[i].LanguageName;
		    }

		    $scope.status = $scope.userPage['waitAsUsersAreBeingLoaded'];
		    $scope.status_class = $scope.userPage['info'];
		})
    }

    lang = localStorage.getItem('languageSet', 'english');

    $scope.getLanguageLabel(lang, className);

    $scope.edit_action = {
        title: $scope.userPage['newUser'],
        user: {},
        mode: 'add',
    }

    // will hold roles returned from api for each user...
    // mapping userid: [role,...]
    $scope.assignedUserRoles = {};

    AuthenticationService.getAllRoles(function (response) {
        for (id in response.data) {
            var role = response.data[id];
            $scope.allUserRoles[role._roleid] = role;
        }   
    }, function () {

        alert($scope.userPage['sorryWeFailedToGetTheListOfUserRoles'],
            $scope.userPage['userManagement'], 5000);

    });


    $scope.loadUsers = function () {
        AuthenticationService.getUsers("ROOT", function (response) {
            $scope.users = response.data.Users;
            $scope.assignedUserRoles = response.data.UserRoles;
            $scope.status_class = $scope.userPage['success'];
            $scope.status = $scope.userPage['userYouCanAdministerHaveBeenLoaded'];

        }, function () {
           
            alert($scope.userPage['sorryWeFailedToGetTheListOfUsers'],
                $scope.userPage['userManagement'], 5000);
            $scope.status_class = $scope.userPage['danger'];
            $scope.status = $scope.userPage['sorryWeFailedToGetTheListOfUsers']

        });
    }

    function addInActiveRole(userRoles, allRoles) {
        var activeRoles = userRoles.map(function (role) { return role._roleid });
        for (i in allRoles) {
            role = allRoles[i];
            if (activeRoles.indexOf(role._roleid) < 0) {
                userRoles.push({
                    "_roleid": role._roleid,
                    "_isActive": false
                })
            }
        }

        return userRoles;
    }

    $scope.toggleEditUser = function (user) {

        $scope.edit_action.title = $scope.userPage['editUser'];
        $scope.edit_action.user = user;
        $scope.edit_action.mode = 'edit';
        $scope.edit_action.user_roles = addInActiveRole($scope.assignedUserRoles[user._userid], $scope.allUserRoles);

        for (role in $scope.edit_action.user_roles) {

        }

        $('.edit-user-panel:first').removeClass('col-md-offset-1');
        $('.edit-user-panel:nth-child(2)').removeClass('col-md-5').addClass('col-md-7');
        $('.edit-user-panel-controls').addClass('col-md-5');

        $('#user_loginid').prop('readonly', true);
    }

    $scope.toggleNewUser = function () {
        $scope.edit_action = {
            title: $scope.userPage['newUser'],
            user: {},
            mode: 'add',
        }
        $('.edit-user-panel:first').addClass('col-md-offset-1');
        $('.edit-user-panel:nth-child(2)').removeClass('col-md-7').addClass('col-md-5');
        $('.edit-user-panel-controls').removeClass('col-md-5');
        $('#user_loginid').prop('readonly', false);
    }


    $scope.createNewUser = $scope.updateUser = function () {
        var user = $scope.edit_action.user;

        if (!user._userid) {
            alert($scope.userPage['theLoginIsInvalid'], $scope.userPage['newUser'], 5000, function () {
                $('#user_loginid').focus();
            });
            return;
        }

        if (!user._fullName) {
            alert($scope.userPage['pleaseSpecifyAValidFullnameAndTryAgain'], $scope.userPage['newUser'], 5000, function () {
                $('#user_fullname').focus();
            });
            return;
        }

        if (!user._password) {
            alert($scope.userPage['pleaseSpecifyAValidPasswordAndTryAgain'], $scope.userPage['newUser'], 5000, function () {
                $('#user_password').focus();
            });
            return;
        }

        if (user._password_confirm != user._password) {
            alert($scope.userPage['thePasswordDoesntMatch'], $scope.userPage['newUser'], 5000, function () {
                $('#user_password').focus();
            });
            return;
        }
        

        AuthenticationService.createUser(user, function (reponse) {

            // success, redirect to main page...
            alert($scope.userPage['userHasBeenCreated'], $scope.userPage['userCreationSuccess'], 3000);
            $scope.toggleNewUser();

            $scope.users.push(user);

        }, function () {

            alert($scope.userPage['sorryCreatingUserFailed'], scope.userPage['userCreationFailure'],  5000);

        });


    }

    
    $scope.deleteUser = function () {
        var user = $scope.edit_action.user;

        if (user._userid) {
            AuthenticationService.deleteUser(user._userid, function (reponse) {

                // success, redirect to main page...
                alert(scope.userPage['userHasBeenDeleted'], 
                scope.userPage['deletionSuccess'], 3000);
                $scope.users.splice($scope.users.indexOf(user), 1);
                $scope.toggleNewUser();

            }, function () {

                alert(scope.userPage['sorryDeletingUserFailed'], scope.userPage['deletionFailure'], 5000);

            });
        }
    }


    $scope.updateUser = function () {
        var user = $scope.edit_action.user;
       

        if (!user._userid) {
            alert(scope.userPage['youHaveAlteredTheUserLogin'], scope.userPage['userUpdate'], 5000, function () {
                $('#user_loginid').focus();
            });
            return;
        }

        if (!user._fullName) {
            alert(scope.userPage['pleaseSpecifyAValidFullNameAndTryAgain'], scope.userPage['userUpdate'], 5000, function () {
                $('#user_fullname').focus();
            });
            return;
        }

        // first, check if the password has changed....
        if (user._password_confirm) {
            if (user._password_confirm != user._password) {
                alert(scope.userPage['youHaveAlteredThePassword'], scope.userPage['userUpdate'], 5000, function () {
                    $('#user_password').focus();
                });
                return;
            }
        }

        AuthenticationService.updateUser(user, $scope.edit_action.user_roles, function (reponse) {

            // success, redirect to main page...
            alert(scope.userPage['userHasBeenUpdated'], scope.userPage['updateSuccess'], 3000);

        }, function () {
           
            alert(scope.userPage['sorryUpdatingUserFailed'], scope.userPage['updateFailure'], 5000);

        });


    }

    $scope.toggleNewUser();
    $scope.loadUsers();
});