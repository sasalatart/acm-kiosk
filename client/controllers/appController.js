(function() {
  'use strict';

  angular.module('acmKiosk').controller('appController', appController);

  appController.$inject = ['sessionService'];

  function appController(sessionService) {
    var vm = this;

    sessionService.identity().then(function(identity) {
      vm.currentUser = function() {
        return sessionService.getIdentity();
      };

      vm.logout = function() {
        sessionService.logout();
      };
    });
  }
})();
