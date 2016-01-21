(function() {
  'use strict'

  angular.module('acmKiosk').controller('productElectionController', productElectionController);

  productElectionController.$inject = ['sessionService'];

  function productElectionController(sessionService) {
    var vm = this;

    sessionService.identity().then(function(identity) {
      if (!identity) {
        sessionService.redirectToRoot();
        alert('You have not logged in!');
      } else {

      }
    });
  }
})();
