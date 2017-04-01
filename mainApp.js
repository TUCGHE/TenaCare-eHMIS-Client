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

//var app = angular.module('eHMISApp' //this is our main angular app...
//    , ['ngRoute', 'leaflet-directive', 'angularUtils.directives.dirPagination',  'nvd3'])
var app = angular.module('eHMISApp' //this is our main angular app...
    , ['ngRoute', 'leaflet-directive', 'angularUtils.directives.dirPagination', 'nvd3', 'angular-loading-bar'])

app.config(function ($routeProvider, $locationProvider) {
		  $routeProvider
		    .when("/", {
		      templateUrl: "templates/template_home.htm",
		      controller: "homectrl"
		  }).when("/home", {
		      templateUrl: "templates/template_home.htm",
		      controller: "homectrl"
		  }).when("/serviceDataEntry", {
		      templateUrl: "templates/template_serviceDataEntry.htm",
		      controller: "servicedataentryController"

		  }).when("/DenominatorsEntry", {
		      templateUrl: "templates/template_denominatorsEntry.html",
		      controller: "denominatorController"

		  }).when("/serviceDataEntryQuarter", {
		      templateUrl: "templates/template_serviceDataEntryQuarter.htm",
		      controller: "servicedataentryQuarterController"

		  }).when("/serviceDataEntryAnnual", {
		      templateUrl: "templates/template_serviceDataEntryAnnual.htm",
		      controller: "servicedataentryAnnualController"

		  }).when("/ipdDataEntry", {
		      templateUrl: "templates/template_ipdDataEntry.html",
		      controller: "monthlyipddiseaseController"
		  }).when("/SiteSetting", {
		      templateUrl: "templates/template_SiteSetting2.html",
		      controller: "locationCtrl"
		  }).when("/SiteSettingTemporary", {
		      templateUrl: "templates/template_SiteSettingTemporary.html",
		      controller: "locationCtrl"              
		  }).when("/ipdReport", {
		      templateUrl: "templates/template_ipdOfficialReport.html",
		      controller: "ipdDiseaseCtrl"
		  }).when("/serviceReport", {
		      templateUrl: "templates/template_MonthlyServiceOfficialReport.html",
		      controller: "serviceReportCtrl"
		  }).when("/opdReport", {
		      templateUrl: "templates/template_opdOfficialReport.html",
		      controller: "opdDiseaseCtrl"
		  }).when('/start', {
		      templateUrl: 'templates/template_start.html',
		      controller: 'StartController'
		  }).when('/values', {
                templateUrl: 'templates/template_values.html',
                controller: 'ValuesController'
		  }).when('/opdDataEntryQuarter', {
                templateUrl: 'templates/template_quarteropddisease.html',
                controller: 'quarteropddiseaseController'

		  }).when('/opdDataEntryMonthly', {
		      templateUrl: 'templates/template_monthlyopddisease.html',
		      controller: 'monthlyopddiseaseController'

		  }).when('/gis', {
		      templateUrl: 'templates/template_map.html',
		      controller: 'mapController'

          }).when('/quarterhpopddisease', {
                templateUrl: 'templates/template_quarterhpopddisease.html',
                controller: 'quarterhpopddiseaseController'
          }).when('/reports', {
                templateUrl: 'templates/template_reports.html',
                controller: 'ReportsController'
          }).when('/customReport', {
              templateUrl: 'templates/template_CustomReport.html',
              controller: 'locationCtrl'
          }).when('/customReport_alt', {
              templateUrl: 'templates/_alt_template_CustomReport.html',
              controller: 'reportCtrl'
          }).when('/analytics', {
              templateUrl: 'templates/template_Analytics.html',
              controller: 'analyticsCtrl'
          }).when('/analytics2', {
              templateUrl: 'templates/template_Analytics2.html',
              controller: 'analyticsCtrl2'
		  }).when('/dashboards', {
		      templateUrl: 'templates/template_dashboards.html',
		      controller: 'analyticsCtrl'
		  }).when('/dashboards2', {
		      templateUrl: 'templates/template_dashboards2.html',
		      controller: 'analyticsCtrl'
          }).when('/plugin_bi', {
              templateUrl: 'templates/template_plugin_powerbi.html',
              controller: 'PluginPowerBICtrl'
          }).when('/Import', {
              templateUrl: 'templates/template_importHMISData.html',
              controller: 'uploadCtrl'
          }).when('/ImportFromExcel', {
              templateUrl: 'templates/template_importHMISData.html',
              controller: 'uploadCtrl'              
          }).when('/ValidationsIndicators', {
              templateUrl: 'templates/template_newDataElementsEntry.html',
              controller: 'newDataElementsctrl'
          }).when('/Users', {
                templateUrl: 'templates/template_users.html',
                controller: 'UserCtrl'
            }).when('/Validation', {
              templateUrl: 'templates/template_validation.html',
              controller: 'validateController'
            })
               .when('/dashboards', {
                   templateUrl: 'templates/template_dashboards.html',
                   controller: 'DashboardsCtrl'
               })
               .when('/tena_scorecard', {
                   templateUrl: 'templates/template_tenascorecard.html',
                   controller: 'TenaCtrl'
               })
               .when('/ManageInstitution', {
                   templateUrl: 'templates/template_addInstitution.html',
                   controller: 'addFacilityCtrl'
               })
              .when('/Backups', {
                   templateUrl: 'templates/template_backupAndRestore.html',
                   controller: 'backupAndRestore'
              })
              .when('/SetLanguage', {
                   templateUrl: 'templates/template_chooseLanguage.html',
                   controller: 'homectrl'
               })
          .otherwise({              
              templateUrl: "templates/template_home.htm",
              controller: 'homectrl'
		  });
	});

// ensure user is logged-in, otherwise redirect to login... 
// (assumption: this will always be loaded on all pages - can't say that for controllers/services/etc...)
	if (Cookies.get('logged-in') == undefined) {
	    if (!window.location.pathname.endsWith('index.html')) { // do this check, to avoid infinite loooping
	        window.location.assign('index.html'); // could there be a better cross-page routing approach?
	    }
	}
