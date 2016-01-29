(function() {
  'use strict';

  angular.module('acmKiosk').factory('Cart', function($resource) {
    return $resource('/carts/:id', {
      id: '@id'
    });
  });
})();
