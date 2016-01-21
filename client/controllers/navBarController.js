(function() {
  'use strict'

  angular.module('acmKiosk').controller('navBarController', navBarController);

  navBarController.$inject = ['sessionService'];

  function navBarController(sessionService) {
    var vm = this;
    vm.sessionService = sessionService;

    vm.logout = function() {
      sessionService.logout();
    };
  }
})();
