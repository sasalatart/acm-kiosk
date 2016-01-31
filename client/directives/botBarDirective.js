(function() {
  'use strict';

  angular.module('acmKiosk').directive('botBar', botBar);

  function botBar() {
    var directive = {
      restrict: 'E',
      templateUrl: 'botBar.html',
      replace: true
    };

    return directive;
  }
})();
