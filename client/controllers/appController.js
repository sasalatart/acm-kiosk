(function() {
  'use strict';

  angular.module('acmKiosk').controller('appController', appController);

  appController.$inject = ['sessionService'];

  function appController(sessionService) {
    var vm = this;

    sessionService.identity().then(function(identity) {
      vm.currentUser = function() {
        sessionService.getIdentity();
        return sessionService.getIdentity();
      };

      vm.logout = function() {
        sessionService.logout();
      };

      angular.element(document).ready(function() {
        $('.wrapper').css('margin-left', $('.ui.left.menu').width() + 'px');
        $(window).resize($('.wrapper').css('margin-left', $('.ui.left.menu').width() + 'px'));
      });
    });
  }
})();
