angular.module('re.co')
 .factory('focus', function($timeout, $window) {
    return function(id) {
      $timeout(function() {
        var element = $window.document.getElementById(id);
        if(element)
          element.focus();
      });
    };
  });

angular.module('re.co')

    /**
     * Ask form controller
     */
    .controller('AskLandingCtrl', function(askFormModal, $scope, $rootScope, $route, mySharedProfile, $http, $location, gettextCatalog, $window, focus, Analytics) {

    $scope.profile = mySharedProfile.Profil;
    $scope.smsLoad = false;
    $scope.phoneNumber = "";


    //language management
    $scope.curLangue = $rootScope.language;
    $scope.otherLangue = $scope.curLangue == "fr" ? "en" : "fr";
    $scope.switchLang = function(lang){
        window.location.href = "/ask/"+lang+"/"
    }

    // focus in input telephone
    $scope.focusInput = function(){
        focus('tel-input');
    }
    $scope.focusInput();

    // App download tracking
    $scope.trackAppDl = function(){
		Analytics.trackEvent("Ask","Download from landing page");
    }
    $scope.dlFromMobile = function(){
        Analytics.trackEvent("Public","Download Ask","re.co/ask");
    }
    // Sending SMS
    $scope.getAppBySms = function (number) {

        if (!$scope.phoneForm.$valid || $scope.phoneNumber.length < 6) {
            $scope.isOk = false;
            return;
        }
        $scope.isOk = true;
        $scope.isSending = true;
        var url = Config.UrlServiceAsk + "/enroleask/" + $scope.curLangue +"?phoneNumber="+$scope.phoneNumber+"&country="+$scope.curLangue;
        $http.get(url)
            .success(function (data) {
                console.log(data);
                Analytics.trackEvent("Public","Send Ask link","re.co/ask");
                })
            .error(mySharedProfile.CallBackError)
            .then(function () {
                $scope.isSent = true;
                $scope.isSending = false;
            });
    }
      
    

    });
    
