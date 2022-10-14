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

weatherApp.controller('searchByWordController', ['$scope', 'cityService',
                function($scope, cityService) {
    $scope.searchByWord = cityService.searchByWord;
    console.log($scope.searchByWord);
}]);
