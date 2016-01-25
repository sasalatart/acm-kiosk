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

    vm.getHeight = function() {
      return (1.25 * $('.ui.fixed.menu').height()) + 'px';
    };
  }
})();
