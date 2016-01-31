(function() {
  angular.module('acmKiosk').config(router);

  function router($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'welcome.html'
      })
      .when('/productElection', {
        templateUrl: 'productElection.html',
        controller: 'nomineeController',
        controllerAs: 'nomineeCtrl'
      })
      .when('/users', {
        templateUrl: 'users.html',
        controller: 'userController',
        controllerAs: 'userCtrl'
      })
      .when('/stock', {
        templateUrl: 'stock.html',
        controller: 'stockController',
        controllerAs: 'stockCtrl'
      })
      .when('/accounting', {
        templateUrl: 'accounting.html',
        controller: 'productController',
        controllerAs: 'productCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  }
})();
