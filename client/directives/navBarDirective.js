(function() {
  'use strict'

  angular.module('acmKiosk').directive('navBar', navBar);

  function navBar() {
    var directive = {
      restrict: 'E',
      templateUrl: 'navBar.html',
      controller: 'navBarController',
      controllerAs: 'navBarCtrl'
    };

    return directive;
  }
})();
