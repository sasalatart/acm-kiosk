(function() {
  'use strict';

  angular.module('acmKiosk').service('errorService', errorService);

  function errorService() {
    var handler = function(errors) {
      swal('Oops...', errors.reduce(function(message, error) {
        return message + '\n' + error;
      }), 'error');
    };

    return {
      handler
    };
  }
})();
