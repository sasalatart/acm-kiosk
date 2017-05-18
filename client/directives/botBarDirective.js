(function() {
  'use strict';

  angular.module('acmKiosk').directive('botBar', botBar);

  function botBar() {
    const directive = {
      restrict: 'E',
      templateUrl: 'botBar.html',
      replace: true
    };

    return directive;
  }
})();
