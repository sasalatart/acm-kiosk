(function() {
  'use strict';

  angular.module('acmKiosk').factory('User', function($resource) {
    return $resource('/users/:id', {
      id: '@id'
    }, {
      toggleAdmin: {
        method: 'PUT'
      }
    });
  });
})();
