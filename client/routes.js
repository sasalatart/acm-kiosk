(function() {
  angular.module('acmKiosk').config(router);

  function router($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'welcome.html',
        controller: 'welcomeController',
        controllerAs: 'welcomeCtrl'
      })
      .when('/productElection', {
        template: '<product-election></product-election>'
      })
      .when('/users', {
        templateUrl: 'users.html',
        controller: 'userController',
        controllerAs: 'userCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  }
})();
