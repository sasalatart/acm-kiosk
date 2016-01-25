(function() {
  'use strict'

  angular.module('acmKiosk').directive('productElection', productElection);

  function productElection() {
    var directive = {
      restrict: 'E',
      templateUrl: 'productElection.html',
      controller: 'nomineeController',
      controllerAs: 'nomineeCtrl'
    };

    return directive;
  }
})();
