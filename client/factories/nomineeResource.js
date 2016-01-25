(function() {
  'use strict'

  angular.module('acmKiosk').factory('Nominee', function($resource) {
    return $resource('/nominees/:id', { id: '@id' });
  });
})();
