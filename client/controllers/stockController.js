(function() {
  'use strict';

  angular.module('acmKiosk').controller('stockController', stockController);

  stockController.$inject = ['sessionService', 'Product'];

  function stockController(sessionService, Product) {
    var vm = this;

    sessionService.identity().then(function(identity) {
      if (!identity) {
        sessionService.redirectToRoot();
        swal('Oops...', '¡Debes iniciar sesión para hacer esto!', 'error');
      } else {
        Product.query(function(products) {
          vm.products = products;
        });
      }
    });
  }
})();
