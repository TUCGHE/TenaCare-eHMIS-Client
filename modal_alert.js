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

$(document).ready(function () {
    window._alert = window.alert;

    /* 
    
    Let's override the default alert with something sleek...
    -- Joe
    NOTE: the new alert now takes an optional title parameter for the alert dialog...
    And an optional time-out, indicating, the modal can be automatically hidden after specified period
    in seconds.
    
    */
    window.alertStack = [];
    window.alert = function (message, title, timeOut, callback) {

        if (window.alertStack.indexOf(message) >= 0)
            return;

        window.alertStack.push(message);

        var modalTemplate = $('#modalTemplate').html();
        
        modalTemplate = modalTemplate.replace("{message}", message);
        modalTemplate = modalTemplate.replace("{title}", title || "Attention");
        var alertId = "alertModal_" + (new Date()).getTime();
        modalTemplate = modalTemplate.replace("{id}", alertId);

        //$('#modalContainer').empty(); // would prevent subsequent modals from properly functioning - e.g when multiple events are triggered simultaneously
        var modalEl = $('#modalContainer').append($(modalTemplate));

        $('#' + alertId).modal({ show: false })
        $('#' + alertId).modal('show');

        if (timeOut) {
            setTimeout(function () {
                $('#' + alertId).modal('hide');
            }, timeOut);
        }

        $('#' + alertId).on('hidden.bs.modal', function () {
            delete window.alertStack[window.alertStack.indexOf(message)];
            $('#' + alertId).remove();
            if (callback) {
                callback();
            }
        })

    }
});