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
adviceApp.service('adviceService', ['$http', function($http) {
    this.searchByWord = '';
    API_ENDPOINT = 'https://api.adviceslip.com/advice';

    this.GetOneAdvice = function() {
        return $http({
            method: 'GET',
            url: API_ENDPOINT
          });
    };

    this.GetAdviceByWord = function (palavra) {
        return $http({
            method: 'GET',
            url: API_ENDPOINT + '/search/' + palavra
          });
    };

}]);

// CONTROLLERS
adviceApp.controller('homeController', ['$scope', 'adviceService', 
                function($scope, adviceService) {
    $scope.searchByWord = adviceService.searchByWord;
    
    $scope.$watch('searchByWord', function() {
        adviceService.searchByWord = $scope.searchByWord;
    });
}]);

adviceApp.controller('oneAdviceController', ['$scope', 'adviceService', 
                function($scope, adviceService) {
    $scope.loading = true;

    adviceService.GetOneAdvice().then(function successCallback(response) {
        $scope.advice = response.data.slip;
        $scope.loading = false;
    }, function errorCallback(response) {
        console.log('### error request ###')
        console.log(response);
        $scope.loading = false;
    });

}]);

adviceApp.controller('searchByWordController', ['$scope', 'adviceService',
                function($scope, adviceService) {
    $scope.loading = true;
    $scope.searchByWord = adviceService.searchByWord;

    adviceService.GetAdviceByWord($scope.searchByWord).then(function successCallback(response) {
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
