(function() {
  'use strict';

  angular.module('acmKiosk').service('errorService', errorService);

  function errorService() {
    const handler = errors => {
      swal('Oops...', errors.messages.reduce((message, error) => {
        return message + '\n' + error;
      }), 'error');
    };

    return {
      handler
    };
  }
})();
