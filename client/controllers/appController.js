(function() {
  'use strict';

  angular.module('acmKiosk').controller('appController', appController);

  appController.$inject = ['sessionService'];

  function appController(sessionService) {
    const vm = this;

    sessionService.identity().then(identity => {
      vm.currentUser = () => sessionService.getIdentity();
      vm.logout = () => sessionService.logout();
    });
  }
})();
