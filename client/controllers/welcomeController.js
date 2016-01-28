(function() {
  'use strict'

  angular.module('acmKiosk').controller('welcomeController', welcomeController);

  welcomeController.$inject = ['sessionService'];

  function welcomeController(sessionService) {
    var vm = this;

    sessionService.identity().then(function(identity) {
      vm.identity = identity;
    });
  }
})();
