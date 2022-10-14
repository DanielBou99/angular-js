// MODULE
var weatherApp = angular.module('weatherApp', ['ngRoute', 'ngResource']);

// ROUTES
weatherApp.config(function ($routeProvider,) {
    $routeProvider
    .when('/', {
        templateUrl: 'pages/home.htm',
        controller: 'homeController'
    })
    .when('/forecast', {
        templateUrl: 'pages/forecast.htm',
        controller: 'forecastController'
    })
    .when('/searchByWord', {
        templateUrl: 'pages/searchByWord.htm',
        controller: 'searchByWordController'
    })
});

// SERVICES
weatherApp.service('cityService', function() {
    this.searchByWord = '';
});

// CONTROLLERS
weatherApp.controller('homeController', ['$scope', 'cityService', 
                function($scope, cityService) {
    $scope.searchByWord = cityService.searchByWord;
    $scope.$watch('searchByWord', function() {
        cityService.searchByWord = $scope.searchByWord;
    });
}]);

weatherApp.controller('forecastController', ['$scope', '$http', 
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

weatherApp.controller('searchByWordController', ['$scope', '$http', 'cityService',
                function($scope, $http, cityService) {
    $scope.loading = true;
    $scope.searchByWord = cityService.searchByWord;

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
weatherApp.directive("cardAdvice", function() {
    return {
        restrict: 'AECM',
        templateUrl: 'directives/cardAdviceResult.htm',
        replace: true,
        scope: {
            adviceObject: "="
        }
    }
 });
