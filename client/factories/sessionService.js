(function() {
  'use strict'

  angular.module('acmKiosk').service('sessionService', sessionService);

  function sessionService($http, $q, $window) {
    var vm = this;
    var _identity = undefined;

    var logout = function() {
      $http.get('/logout').then(function() {
        $window.location.href = '/#/';
        _identity = undefined;
      });
    };

    var identity = function(setIdentity) {
      if (setIdentity) {
        _identity = setIdentity;
        return;
      }

      var deferred = $q.defer();

      $http.get('/getUser')
        .then(function success(response) {
          _identity = response.data;
          deferred.resolve(_identity);
        }, function error() {
          _identity = undefined;
          deferred.reject();
        });

      return deferred.promise;
    };

    var getIdentity = function() {
      return _identity;
    };

    var redirectToRoot = function() {
      $window.location.href = '/#/';
    };

    return {
      logout,
      identity,
      getIdentity,
      redirectToRoot
    }
  }
})()
