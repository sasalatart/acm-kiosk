(function() {
  'use strict';

  angular.module('acmKiosk').service('sessionService', sessionService);

  function sessionService($http, $q, $window) {
    let _identity;

    const logout = () => {
      $http.get('/logout').then(() => {
        $window.location.href = '/#/';
        _identity = undefined;
      });
    };

    const identity = setIdentity => {
      if (setIdentity) {
        _identity = setIdentity;
        return;
      }

      const deferred = $q.defer();

      $http.get('/current_user').then(function success(response) {
          _identity = response.data;
          deferred.resolve(_identity);
        }, function error() {
          _identity = undefined;
          deferred.reject();
        });

      return deferred.promise;
    };

    const getIdentity = () => {
      return _identity;
    };

    const redirectToRoot = () => {
      $window.location.href = '/#/';
    };

    return {
      logout,
      identity,
      getIdentity,
      redirectToRoot
    };
  }
})();
