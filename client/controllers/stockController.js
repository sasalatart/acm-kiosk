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

        vm.sortBy = function(key) {
          vm.sortingKey = key;
          vm.sortingAsc = !vm.sortingAsc;

          var sortingFunction = function(a, b) {
            if (a[key] > b[key]) return (vm.sortingAsc ? 1 : -1);
            if (a[key] < b[key]) return (vm.sortingAsc ? -1 : 1);
            if (a[key] === b[key]) return 0;
          };

          vm.products.sort(sortingFunction);
        };

        vm.sortingClass = function(key) {
          var classString = '';
          if (vm.sortingKey === key) {
            classString = (vm.sortingAsc ? 'sorted ascending' : 'sorted descending');
          }

          return classString;
        };
      }
    });
  }
})();
