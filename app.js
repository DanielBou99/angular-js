// MODULE
var adviceApp = angular.module('adviceApp', ['ngRoute', 'ngResource']);

// ROUTES
adviceApp.config(function ($routeProvider,) {
    $routeProvider
    .when('/', {
        templateUrl: 'pages/home.htm',
        controller: 'homeController'
    })
    .when('/oneAdvice', {
        templateUrl: 'pages/oneAdvice.htm',
        controller: 'oneAdviceController'
    })
    .when('/searchByWord', {
        templateUrl: 'pages/searchByWord.htm',
        controller: 'searchByWordController'
    })
});

// SERVICES
adviceApp.service('adviceService', function() {
    this.searchByWord = '';
});

// CONTROLLERS
adviceApp.controller('homeController', ['$scope', 'adviceService', 
                function($scope, adviceService) {
    $scope.searchByWord = adviceService.searchByWord;
    $scope.$watch('searchByWord', function() {
        adviceService.searchByWord = $scope.searchByWord;
    });
}]);

adviceApp.controller('oneAdviceController', ['$scope', '$http', 
                function($scope, $http) {
    $scope.loading = true;
    $http({
        method: 'GET',
        url: 'https://api.adviceslip.com/advice'
      }).then(function successCallback(response) {
            console.log(response.data.slip);
            $scope.advice = response.data.slip;
            $scope.loading = false;
        }, function errorCallback(response) {
            console.log('### error request ###')
            console.log(response);
            $scope.loading = false;
    });
}]);

adviceApp.controller('searchByWordController', ['$scope', '$http', 'adviceService',
                function($scope, $http, adviceService) {
    $scope.loading = true;
    $scope.searchByWord = adviceService.searchByWord;

    apiLink = 'https://api.adviceslip.com/advice/search/' + $scope.searchByWord;

    $http({
        method: 'GET',
        url: apiLink
      }).then(function successCallback(response) {
            console.log(response);
            if (response?.data?.message?.text.search('/No advice slips/') === -1) {
                $scope.advices = [
                    {
                        id: 0,
                        advice: 'No advice found'
                    }
                ];
            } else {
                $scope.advices = response?.data?.slips;
            }
            console.log($scope.advices);
            $scope.loading = false;
        }, function errorCallback(response) {
            console.log('### error request ###')
            console.log(response);
            $scope.loading = false;
    });

}]);

// DIRECTIVES
adviceApp.directive("cardAdvice", function() {
    return {
        restrict: 'AECM',
        templateUrl: 'directives/cardAdviceResult.htm',
        replace: true,
        scope: {
            adviceObject: "="
        }
    }
 });
