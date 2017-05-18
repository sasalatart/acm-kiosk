(function() {
  'use strict';

  angular.module('acmKiosk').directive('topBar', topBar);

  function topBar() {
    const directive = {
      restrict: 'E',
      templateUrl: 'topBar.html',
      replace: true
    };

    return directive;
  }
})();
