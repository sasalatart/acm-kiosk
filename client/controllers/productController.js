(function() {
  'use strict';

  angular.module('acmKiosk').controller('productController', productController);

  productController.$inject = ['sessionService', 'errorService', 'Product', 'Cart', '$http'];

  function productController(sessionService, errorService, Product, Cart, $http) {
    const vm = this;

    sessionService.identity().then(identity => {
      if (!identity || !identity.admin) {
        sessionService.redirectToRoot();
        swal('Oops...', 'No tienes permisos para ingresar aquí.', 'error');
      } else {
        Product.query(products => vm.products = products);
        Cart.query(carts => vm.carts = carts);

        vm.newProduct = () => {
          const product = new Product(vm.productForm);
          product.$save().then(newProduct => {
            vm.products.push(newProduct);
          }, error => {
            errorService.handler(error.data);
          });
          vm.productForm = {};
        };

        vm.updateProduct = product => {
          product.$update({
            id: product._id,
            body: {
              name: product.editName || product.name,
              costPerPack: product.editCostPerPack || product.costPerPack,
              unitsPerPack: product.editUnitsPerPack || product.unitsPerPack,
              price: product.editPrice || product.price,
              packsStored: product.editPacksStored || product.packsStored,
              packsDisplayed: product.editPacksDisplayed || product.packsDisplayed
            }
          }, updatedProduct => {
            product.name = updatedProduct.name;
            product.costPerPack = updatedProduct.costPerPack;
            product.unitsPerPack = updatedProduct.unitsPerPack;
            product.price = updatedProduct.price;
            product.packsStored = updatedProduct.packsStored;
            product.packsDisplayed = updatedProduct.packsDisplayed;
          }, error => {
            errorService.handler(error.data);
          });
          product.editing = false;
        };

        vm.deleteProduct = product => {
          Product.delete({ id: product._id }, () => {
            const index = vm.products.indexOf(product);
            if (index !== -1) vm.products.splice(index, 1);
          }, error => {
            errorService.handler(error.data);
          });
        };

        vm.buyProducts = () => {
          const cartOrder = vm.products.map(product => {
            return {
              _id: product._id,
              bought: product.quantityBought || 0
            };
          });

          $http.post('/products/buy', { cartOrder: cartOrder }).then(response => {
            vm.carts.push(response.data.newCart);

            for (let i = 0; i < vm.products.length; i = i + 1) {
              vm.products[i].packsStored = response.data.products[i].packsStored;
              vm.products[i].boughtLastTime = response.data.products[i].boughtLastTime;
              vm.products[i].quantityBought = undefined;
            }
          }, response => {
            errorService.handler(response.data);
          });
          vm.action = '';
        };

        vm.moveProducts = () => {
          const productsToMove = vm.products.map(product => {
            return {
              _id: product._id,
              quantity: product.quantityToMove || 0
            };
          });

          $http.post('/products/move', { productsToMove: productsToMove }).then(response => {
            for (let i = 0; i < vm.products.length; i = i + 1) {
              vm.products[i].packsStored = response.data[i].packsStored;
              vm.products[i].packsDisplayed = response.data[i].packsDisplayed;
              vm.products[i].quantityToMove = undefined;
            }
          }, response => {
            errorService.handler(response.data);
          });
          vm.action = '';
        };

        vm.removeFromDisplay = product => {
          product.$update({
            id: product._id,
            body: {
              packsDisplayed: product.packsDisplayed - 1
            }
          }, updatedProduct => {
            product.packsDisplayed = updatedProduct.packsDisplayed;
          }, error => {
            errorService.handler(error.data);
          });
          product.editing = false;
        };

        vm.sortBy = key => {
          vm.sortingKey = key;
          vm.sortingAsc = !vm.sortingAsc;

          let sortingFunction = (a, b) => {
            if (a[key] > b[key]) return (vm.sortingAsc ? 1 : -1);
            if (a[key] < b[key]) return (vm.sortingAsc ? -1 : 1);
            if (a[key] === b[key]) return 0;
          };

          if (key === 'costPerUnit' || key === 'balance') {
            let comparator;
            if (key === 'costPerUnit') {
              comparator = vm.costPerUnit;
            } else if (key === 'balance') {
              comparator = vm.profitForProduct;
            }

            sortingFunction = (a, b) => {
              if (comparator(a) > comparator(b)) return (vm.sortingAsc ? 1 : -1);
              if (comparator(a) < comparator(b)) return (vm.sortingAsc ? -1 : 1);
              if (comparator(a) === comparator(b)) return 0;
            };
          }

          vm.products.sort(sortingFunction);
        };

        vm.sortingClass = key => {
          let classString = '';
          if (vm.sortingKey === key) {
            classString = (vm.sortingAsc ? 'sorted ascending' : 'sorted descending');
          }

          return classString;
        };

        vm.deleteCart = () => {
          Cart.delete({ id: vm.selectedCartID }, () => {
            const index = vm.carts.map(cart => cart._id).indexOf(vm.selectedCartID);
            if (index !== -1) vm.carts.splice(index, 1);
            vm.selectedCartID = undefined;
          }, error => {
            errorService.handler(error.data);
          });
        };

        vm.costPerUnit = product => product.costPerPack / product.unitsPerPack;

        vm.costForProduct = (product, cart) => {
          if (cart) {
            return product.boughtLastTime * product.costPerPack;
          } else {
            return (product.packsStored + product.packsDisplayed) * product.costPerPack;
          }
        };

        vm.profitForProduct = (product, cart) => {
          if (cart) {
            return product.boughtLastTime * product.unitsPerPack * product.price - vm.costForProduct(product, cart);
          } else {
            return (product.packsStored + product.packsDisplayed) * (product.price * product.unitsPerPack) - vm.costForProduct(product, cart);
          }
        };

        vm.totalCost = (products, cart) => {
          return products.map(product => vm.costForProduct(product, cart))
            .reduce((sum, current) => sum + current);
        };

        vm.totalProfit = (products, cart) => {
          return products.map(product => vm.profitForProduct(product, cart))
            .reduce((sum, current) => sum + current);
        };

        vm.potentialProfit = () => {
          if (vm.productForm) {
            return (vm.productForm.unitsPerPack * vm.productForm.price) - vm.productForm.costPerPack;
          }
          return 0;
        };
      }
    });
  }
})();
