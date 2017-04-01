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

app.controller('newDataElementsctrl', function ($scope, myService, LanguageFactory) {

    var className = "indicatorAdd";
    var lang = $scope.languageSet;

    $scope.indicatorAdd = {};

    $scope.getLanguageLabel = function (lang, className) {
        LanguageFactory.getLanguageLabelService(lang, className)
		.then(function (data) {
		    $scope.values = data;

		    for (var i = 0; i < $scope.values.length; i++) {
		        $scope.indicatorAdd[$scope.values[i].indexName] = $scope.values[i].LanguageName;
		    }		  
		})
    }

    lang = localStorage.getItem('languageSet', 'english');

    $scope.getLanguageLabel(lang, className);

  
    $scope.insertNewData = function (name, category, type) {
        var values = {
            "Name": name, "Category": category,
            "Type": type
        }
        if (values.Name == undefined || values.Name == "")
        {
            alert($scope.indicatorAdd['pleaseFillDataElementsName']); 
        }
        else if (values.Category == undefined || values.Category == "")
        {
            alert($scope.indicatorAdd['pleaseFillCategoryName']); 
        }
        else if (values.Type == undefined || values.Type == "") {
            alert($scope.indicatorAdd['pleaseFillDataElementsType']); 
        }
        else {
            myService.AddNewDataElements(values)
            .then(function (response) {
                if (response.statusText == "OK") {
                    alert($scope.indicatorAdd['dataSuccessfullySaved']); 
                    $scope.name = "";
                    $scope.category = "";
                    $scope.type = "";
                }
                else
                    alert($scope.indicatorAdd['failedToSaveDataPleaseTryAgain']);
            });
        }
    }
    $scope.insertNewDisease = function (diseaseName)
    {
        if (diseaseName == undefined || diseaseName == "") {
            alert($scope.indicatorAdd['pleaseFillDataElementsType']);
        }
        else {
            myService.AddNewDisease(diseaseName, 1)
           .then(function (response) {
               if (response.statusText == "OK") {
                   alert($scope.indicatorAdd['dataSuccessfullySaved']);
                   $scope.diseaseName = "";
               }
               else
                   alert($scope.indicatorAdd['failedToSaveDataPleaseTryAgain']);
           });
        }
    }
    $scope.EnableDenom = true;
    $scope.selectLabelDescription = function ()
    {
        $scope.EnableDenom = false;
        myService.SelectLabelDescription()
        .then(function(data){
            $scope.labelDescriptions = data;
        });
     
        
    }
     $scope.numeratorValues = [];
    $scope.denominatorValues = [];
    $scope.ChangedValueNumerator = [];
    $scope.ChangedValueDenominator = [];
    var countN = 1;
    var countD = 1;
    $scope.collectSelection = function (displaydata, labelDescription, checkedDescription)
    {
        $scope.selectedDescription = labelDescription.labelID;
       
        if (checkedDescription == true) {
            if (displaydata == 'numerator') {
                var notationN = "N" + countN;
                var valueobj = { "LabelId": labelDescription.labelID, "DataEleClass": labelDescription.dataEleClass, "Description": labelDescription.descrip, "Notation": notationN };
                $scope.ChangedValueNumerator.push(valueobj);
                $scope.numeratorValues = $scope.ChangedValueNumerator;
                countN = countN + 1;
            }
            else if (displaydata == 'denominator') {
                var notationD = "D" + countD;
                var valueobj = { "LabelId": labelDescription.labelID, "DataEleClass": labelDescription.dataEleClass, "Description": labelDescription.descrip, "Notation": notationD };
                $scope.ChangedValueDenominator.push(valueobj);
                $scope.denominatorValues = $scope.ChangedValueDenominator;
                countD = countD + 1;
            }
        }
        else {
            if (displaydata == 'numerator')
            {
                var index = $scope.numeratorValues.length - 1;
                $scope.numeratorValues.splice(index);
                countN--;
            }
            else if (displaydata == 'denominator')
            {
                var index = $scope.denominatorValues.length - 1;
                $scope.denominatorValues.splice(index);
                countD--;
            }
            

        }              
    }
    $scope.numerators = [];
    $scope.denominators = [];
    $scope.changedselection = [];
    $scope.changedselection2 = [];
    var countNumerator = 1;
    var countDenominator =  1;
    $scope.numeratorAction = function (numerator, checkedNumerator) {
      
        if (checkedNumerator == true) {
            if (countNumerator == $scope.numeratorValues.length) {
                $scope.notationDisplay = { "Notation": numerator.Notation, "LabelId": numerator.LabelId, "DataEleClass": numerator.DataEleClass, "showOptions": false };
            }
            else {
                $scope.notationDisplay = { "Notation": numerator.Notation, "LabelId": numerator.LabelId, "DataEleClass": numerator.DataEleClass, "showOptions": true };
            }


            $scope.changedselection.push($scope.notationDisplay);
            $scope.numerators = $scope.changedselection;

            countNumerator++;
        }
        else {
            var index = $scope.numerators.length - 1;
            $scope.numerators.splice(index);
            countNumerator--;
        }                   
    }
    $scope.denominatorAction = function (denominator, checkedDenominator) {
        if (checkedDenominator == true) {
            if (countDenominator == $scope.denominatorValues.length) {
                $scope.notationDisplay = { "Notation": denominator.Notation, "LabelId": denominator.LabelId, "DataEleClass": denominator.DataEleClass, "showOptions": false };
            }
            else {
                $scope.notationDisplay = { "Notation": denominator.Notation, "LabelId": denominator.LabelId, "DataEleClass": denominator.DataEleClass, "showOptions": true };
            }


            $scope.changedselection2.push($scope.notationDisplay);
            $scope.denominators = $scope.changedselection2;
            countDenominator++;
        }
        else {
            var index = $scope.denominators.length - 1;
            $scope.denominators.splice(index);
            countDenominator--;
        }
        
    }
    $scope.numeratorOperations = [];
    $scope.denominatorOperations = [];
    $scope.changeOperationsNume = [];
    $scope.changeOperationsDeno = [];

    $scope.collectActions = function (operation) {
        $scope.changeOperationsNume.push(operation);
        $scope.numeratorOperations = $scope.changeOperationsNume;

    }
    $scope.collectDenominatorActions = function (operation) {
        $scope.changeOperationsDeno.push(operation);
        $scope.denominatorOperations = $scope.changeOperationsDeno;
    }
    $scope.insertNewIndicator = function (operation, indicatorName, numeratorName, denominatorName) {
        if (indicatorName == undefined)
        {
            alert($scope.indicatorAdd['pleaseFillIndicatorName']); 
        }
        else if (numeratorName == undefined)
        {
            alert($scope.indicatorAdd['pleaseFillNumeratorName']); 
        }
        else if (denominatorName == undefined)
        {
            alert($scope.indicatorAdd['pleaseFillDenominatorName']); 
        }
        else if($scope.denominatorOperations.length == 0 && $scope.denominators.length >1)
        {
            alert($scope.indicatorAdd['pleaseSelectDenominatorOperation']); 
        }
        else if ($scope.numeratorOperations.length == 0 && $scope.numerators.length > 1)
        {
            alert($scope.indicatorAdd['pleaseSelectNumeratorOperation']);
        }
        else if ($scope.numerators.length == 0)
        {
            alert($scope.indicatorAdd['pleaseChooseNumeratorsFromTheListOfNumeratorsSelected']);
        }
        else if ($scope.denominators.length == 0)
        {
            alert($scope.indicatorAdd['pleaseChooseDenominatorsFromTheListOfDenominatorSelected']);
        }
        else if ($scope.operation == undefined) {
            alert($scope.indicatorAdd['pleaseSelectAnOperationForNumeratorAndDenominator']);
        }
        else {

            var oplabelid1, oplabelid2, opDataEleClass1, opDataEleClass2, numeratorDataClass, denominatorDataClass;
            for (var i = 0; i < $scope.numerators.length; i++) {
                if (opDataEleClass1 == undefined) {
                    opDataEleClass1 = $scope.numerators[i].DataEleClass;
                    numeratorDataClass = opDataEleClass1;
                }
                else {
                    if (opDataEleClass1 == $scope.numerators[i].DataEleClass) {
                        opDataEleClass1 = $scope.numerators[i].DataEleClass;

                    }
                    else {
                        numeratorDataClass = numeratorDataClass + "," + $scope.numerators[i].DataEleClass;
                        opDataEleClass1 = $scope.numerators[i].DataEleClass;
                    }
                }

                if (oplabelid1 == undefined) {
                    if ($scope.numeratorOperations[i] == undefined) {
                        oplabelid1 = $scope.numerators[i].LabelId;
                    }
                    else { oplabelid1 = $scope.numerators[i].LabelId + "," + $scope.numeratorOperations[i]; }

                }
                else {
                    if ($scope.numeratorOperations[i] == undefined) {
                        oplabelid1 = oplabelid1 + $scope.numerators[i].LabelId;
                    }
                    else { oplabelid1 = oplabelid1 + $scope.numerators[i].LabelId + "," + $scope.numeratorOperations[i]; }

                }

            }
            for (var i = 0; i < $scope.denominators.length; i++) {
                if (opDataEleClass2 == undefined) {
                    opDataEleClass2 = $scope.denominators[i].DataEleClass;
                    denominatorDataClass = opDataEleClass2;
                }
                else {
                    if (opDataEleClass2 == $scope.denominators[i].DataEleClass) {
                        opDataEleClass2 = $scope.denominators[i].DataEleClass;
                    }
                    else {
                        denominatorDataClass = denominatorDataClass + "," + $scope.denominators[i].DataEleClass;
                        opDataEleClass2 = $scope.denominators[i].DataEleClass;
                    }
                }
                if (oplabelid2 == undefined) {
                    if ($scope.denominatorOperations[i] == undefined) {
                        oplabelid2 = $scope.denominators[i].LabelId;
                    }
                    else { oplabelid2 = $scope.denominators[i].LabelId + "," + $scope.denominatorOperations[i]; }

                }

                else {
                    if ($scope.denominatorOperations[i] == undefined) {
                        oplabelid2 = oplabelid2 + $scope.denominators[i].LabelId;
                    }
                    else { oplabelid2 = oplabelid2 + $scope.denominators[i].LabelId + "," + $scope.denominatorOperations[i]; }

                }

            }
            var value = {
                "IndicatorName": indicatorName, "NumeratorName": numeratorName, "DenominatorName": denominatorName, "LabelIdN": oplabelid1,
                "LabelIdD": oplabelid2, "DataEleClassN": numeratorDataClass, "DataEleClassD": denominatorDataClass, "Action": operation, "Percentaile": $scope.percentaile
            }
            myService.PostNewIndicator(2, value)
                .then(function (response) {
                    if (response.statusText == "OK") {
                        alert($scope.indicatorAdd['dataSuccessfullySaved']);
                        $scope.diseaseName = "";
                        $scope.numeratorTrue = true;
                        $scope.displaydata = 'numerator';
                        //reset all variables
                        $scope.indicatorName = undefined;
                        $scope.numeratorName = undefined;
                        $scope.denominatorName = undefined;
                        $scope.operation = undefined;
                        $scope.percentaile = undefined;

                        $scope.numeratorOperations = [];
                        $scope.denominatorOperations = [];
                        $scope.changeOperationsNume = [];
                        $scope.changeOperationsDeno = [];

                        $scope.numerators = [];
                        $scope.denominators = [];
                        $scope.changedselection = [];
                        $scope.changedselection2 = [];

                        $scope.numeratorValues = [];
                        $scope.denominatorValues = [];
                        $scope.ChangedValueNumerator = [];
                        $scope.ChangedValueDenominator = [];
                    }
                    else
                        alert($scope.indicatorAdd['failedToSaveDataPleaseTryAgain']);
                });
        }
       
    }
    $scope.percentaile;
    $scope.percetageSelection = function (percentaile) {
        $scope.percentaile = percentaile;
    }
});