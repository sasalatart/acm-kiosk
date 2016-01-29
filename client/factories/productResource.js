(function() {
  'use strict ';

  angular.module('acmKiosk').factory('Product', function($resource) {
    return $resource('/products/:id', {
      id: '@id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  });
})();
