(function() {
  'use strict';

  angular.module('acmKiosk').controller('stockController', stockController);

  stockController.$inject = ['sessionService', 'Product'];

  function stockController(sessionService, Product) {
    const vm = this;

    sessionService.identity().then(identity => {
      if (!identity) {
        sessionService.redirectToRoot();
        swal('Oops...', '¡Debes iniciar sesión para hacer esto!', 'error');
      } else {
        Product.query(products => vm.products = products);

        vm.sortBy = key => {
          vm.sortingKey = key;
          vm.sortingAsc = !vm.sortingAsc;

          const sortingFunction = (a, b) => {
            if (a[key] > b[key]) return (vm.sortingAsc ? 1 : -1);
            if (a[key] < b[key]) return (vm.sortingAsc ? -1 : 1);
            if (a[key] === b[key]) return 0;
          };

          vm.products.sort(sortingFunction);
        };

        vm.sortingClass = key => {
          let classString = '';
          if (vm.sortingKey === key) {
            classString = (vm.sortingAsc ? 'sorted ascending' : 'sorted descending');
          }

          return classString;
        };
      }
    });
  }
})();
