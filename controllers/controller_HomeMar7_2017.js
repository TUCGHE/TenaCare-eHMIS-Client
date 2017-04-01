app.controller('homectrl', function ($scope, $timeout) {

    $scope.welcometoehmis = "";
    $scope.ehmisexplain = "";
    $scope.homeconfigmodule = "";
    $scope.homeconfigexplain = "";
    $scope.homedataentrymodule = "";
    $scope.homedataentryexplain = "";
    $scope.homereportmodule = "";
    $scope.homereportexplain = "";
    $scope.homeanalyticsmodule = "";
    $scope.homeanalyticsexplain = "";
    $scope.homecommunicationmodule = "";
    $scope.homecommunicationexplain = "";

    $scope.languageSet = "amharic";

    if ($scope.languageSet == "english")
    {
        $scope.welcometoehmis = "Welcome to eHMIS   \n" +             
                        "(Electronic Health Management Information System) main page.";
        $scope.ehmisexplain = " The system incorporates data collection, analysis and reporting on timely," +
                              " accurately and efficient method at all level of the health institutions. " +
                              " The list below shows the different modules of the application.";
        $scope.homeconfigmodule = "Configuration Module ";
        $scope.homeconfigexplain = "This module allows users to Add Institution, Set Institution, " +
                                   "Set Denominators, Yearly Targets, etc";
        $scope.homedataentrymodule = "Data Entry Module ";
        $scope.homedataentryexplain = "This module allows users to enter eHMIS (IPD, OPD, Service) " +
                                      "data elements with validations which help with accuracy.";
        $scope.homereportmodule = "Report Module";
        $scope.homereportexplain = "This module allows users to generate standard and ad-hoc reports, " +
                                   "import reports from other institutions and download reports that have " +
                                   "been sent from other institutions via the network.";
        $scope.homeanalyticsmodule = "Analysis, Charts and Maps Module";
        $scope.homeanalyticsexplain = "This module allows users to make analysis using indicators, " +
                                      "charts and GIS mapping. The module is integrated with Power " +
                                      "Business Intelligence module for flexible data analytics.";
        $scope.homecommunicationmodule = "Communication Module";
        $scope.homecommunicationexplain = "This module allows users to view internet connection logs and " +
                                          "exchange short messages";
        $scope.homehelpmodule = "Help";
        $scope.homehelpexplain = "Get access to system help for various tasks in the application. " +
                                 "The help documentation is sub-divided based on the modules."
    }
    else if ($scope.languageSet == "amharic")
    {
        $scope.welcometoehmis = "ወደ ኢ ኤች ኤም አይ ኤስ እንኳን ደህና መጡ ፠   \n" +
                                "ዋናዉ ገጽ";
        $scope.ehmisexplain = " ይህ ሲስተም ዳታ በትክክል፡ በፍጥነት እና በተቀናጀ መንገድ መሰብሰብ፡ አናሊስስ፡ እና ሪፖርቲንግ ያደርጋል"
                              " ከዚህ በታች የሲስተሙን ሞዱሎች ተመልከቱ ";
        $scope.homeconfigmodule = "ኮንፊገሬሽን ሞዱል ";
        $scope.homeconfigexplain = "ይሄ ሞዱል ለተጠቃሚዉ ዳታ፡ አዲስ ጤና ጣቢያ፡ ታርጌት እና ዲኖሚኔቶር ማስገቢያ ሞዱል";
        $scope.homedataentrymodule = "Data Entry Module ";
        $scope.homedataentryexplain = "This module allows users to enter eHMIS (IPD, OPD, Service) " +
                                      "data elements with validations which help with accuracy.";
        $scope.homereportmodule = "Report Module";
        $scope.homereportexplain = "This module allows users to generate standard and ad-hoc reports, " +
                                   "import reports from other institutions and download reports that have " +
                                   "been sent from other institutions via the network.";
        $scope.homeanalyticsmodule = "Analysis, Charts and Maps Module";
        $scope.homeanalyticsexplain = "This module allows users to make analysis using indicators, " +
                                      "charts and GIS mapping. The module is integrated with Power " +
                                      "Business Intelligence module for flexible data analytics.";
        $scope.homecommunicationmodule = "Communication Module";
        $scope.homecommunicationexplain = "This module allows users to view internet connection logs and " +
                                          "exchange short messages";
        $scope.homehelpmodule = "Help";
        $scope.homehelpexplain = "Get access to system help for various tasks in the application. " +
                                 "The help documentation is sub-divided based on the modules."
    }
})

   