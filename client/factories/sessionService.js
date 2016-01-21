(function() {
  'use strict'

  angular.module('acmKiosk').service('sessionService', sessionService);

  function sessionService($http, $q, $window) {
    var vm = this;
    var _identity = undefined;

    var logout = function() {
      $http.get('/logout')
        .success(function() {
          $window.location.href = '/#/';
          _identity = undefined;
        })
        .error(function(error, data) {
          alert('error');
        });
    };

    var identity = function(setIdentity) {
      if (setIdentity) {
        _identity = setIdentity;
        return;
      }

      var deferred = $q.defer();

      if (angular.isDefined(_identity)) {
        deferred.resolve(_identity);
        return deferred.promise;
      }

      $http.get('/getUser')
        .success(function(result) {
          _identity = result;
          deferred.resolve(_identity);
        })
        .error(function() {
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
