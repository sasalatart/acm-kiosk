(function() {
  'use strict';

  angular.module('acmKiosk').controller('productController', productController);

  productController.$inject = ['sessionService', 'errorService', 'Product', 'Cart', '$http'];

  function productController(sessionService, errorService, Product, Cart, $http) {
    var vm = this;

    sessionService.identity().then(function(identity) {
      if (!identity || !identity.admin) {
        sessionService.redirectToRoot();
        swal('Oops...', 'No tienes permisos para ingresar aquí.', 'error');
      } else {
        Product.query(function(products) {
          vm.products = products;
        });

        Cart.query(function(carts) {
          vm.carts = carts;
        });

        vm.newProduct = function() {
          var product = new Product();
          product.name = vm.productForm.name;
          product.costPerPack = vm.productForm.costPerPack;
          product.unitsPerPack = vm.productForm.unitsPerPack;
          product.price = vm.productForm.price;
          product.$save().then(function(newProduct) {
            vm.products.push(newProduct);
          }, function(error) {
            errorService.handler(error.data);
          });
          vm.productForm = {};
        };

        vm.updateProduct = function(product) {
          product.$update({
            id: product._id,
            name: product.editName || product.name,
            costPerPack: product.editCostPerPack || product.costPerPack,
            unitsPerPack: product.editUnitsPerPack || product.unitsPerPack,
            price: product.editPrice || product.price,
            packsStored: product.editPacksStored || product.packsStored,
            packsDisplayed: product.editPacksDisplayed || product.packsDisplayed
          }, function(updatedProduct) {
            product.name = updatedProduct.name;
            product.costPerPack = updatedProduct.costPerPack;
            product.unitsPerPack = updatedProduct.unitsPerPack;
            product.price = updatedProduct.price;
            product.packsStored = updatedProduct.packsStored;
            product.packsDisplayed = updatedProduct.packsDisplayed;
          }, function(error) {
            errorService.handler(error.data);
          });
          product.editing = false;
        };

        vm.deleteProduct = function(product) {
          Product.delete({
            id: product._id
          }, function() {
            var index = vm.products.indexOf(product);
            if (index !== -1) vm.products.splice(index, 1);
          }, function(error) {
            errorService.handler(error.data);
          });
        };

        vm.buyProducts = function() {
          var cartOrder = [];
          vm.products.forEach(function(product) {
            cartOrder.push({
              _id: product._id,
              bought: product.quantityBought || 0
            });
          });

          $http.post('/products/buy', {
            cartOrder: cartOrder
          })
          .then(function success(response) {
            vm.carts.push(response.data.newCart);
            for (var i = 0; i < vm.products.length; i = i + 1) {
              vm.products[i].packsStored = response.data.products[i].packsStored;
              vm.products[i].boughtLastTime = response.data.products[i].boughtLastTime;
              vm.products[i].quantityBought = undefined;
            }
          }, function error(response) {
            errorService.handler(response.data);
          });

          vm.action = '';
        };

        vm.moveProducts = function() {
          var productsToMove = [];
          vm.products.forEach(function(product) {
            productsToMove.push({
              _id: product._id,
              quantity: product.quantityToMove || 0
            });
          });

          $http.post('/products/move', {
            productsToMove: productsToMove
          })
          .then(function success(response) {
            for (var i = 0; i < vm.products.length; i = i + 1) {
              vm.products[i].packsStored = response.data[i].packsStored;
              vm.products[i].packsDisplayed = response.data[i].packsDisplayed;
              vm.products[i].quantityToMove = undefined;
            }
          }, function error(response) {
            errorService.handler(response.data);
          });

          vm.action = '';
        };

        vm.removeFromDisplay = function(product) {
          product.$update({
            id: product._id,
            packsDisplayed: product.packsDisplayed - 1
          }, function(updatedProduct) {
            product.packsDisplayed = updatedProduct.packsDisplayed;
          }, function(error) {
            errorService.handler(error.data);
          });
          product.editing = false;
        };

        vm.sortBy = function(key) {
          vm.sortingKey = key;
          vm.sortingAsc = !vm.sortingAsc;

          var sortingFunction = function(a, b) {
            if (a[key] > b[key]) return (vm.sortingAsc ? 1 : -1);
            if (a[key] < b[key]) return (vm.sortingAsc ? -1 : 1);
            if (a[key] === b[key]) return 0;
          };

          if (key === 'costPerUnit' || key === 'balance') {
            var comparator;
            if (key === 'costPerUnit') {
              comparator = vm.costPerUnit;
            } else if (key === 'balance') {
              comparator = vm.profitForProduct;
            }

            sortingFunction = function(a, b) {
              if (comparator(a) > comparator(b)) return (vm.sortingAsc ? 1 : -1);
              if (comparator(a) < comparator(b)) return (vm.sortingAsc ? -1 : 1);
              if (comparator(a) === comparator(b)) return 0;
            };
          }

          vm.products.sort(sortingFunction);
        };

        vm.sortingClass = function(key) {
          var classString = '';
          if (vm.sortingKey === key) {
            classString = (vm.sortingAsc ? 'sorted ascending' : 'sorted descending');
          }

          return classString;
        };

        vm.deleteCart = function() {
          Cart.delete({
            id: vm.selectedCartID
          }, function() {
            var index = vm.carts.map(cart => cart._id).indexOf(vm.selectedCartID);
            if (index !== -1) vm.carts.splice(index, 1);
            vm.selectedCartID = undefined;
          }, function(error) {
            errorService.handler(error.data);
          });
        };

        vm.costPerUnit = function(product) {
          return product.costPerPack / product.unitsPerPack;
        };

        vm.costForProduct = function(product, cart) {
          if (cart) {
            return product.boughtLastTime * product.costPerPack;
          } else {
            return (product.packsStored + product.packsDisplayed) * product.costPerPack;
          }
        };

        vm.profitForProduct = function(product, cart) {
          if (cart) {
            return product.boughtLastTime * product.unitsPerPack * product.price - vm.costForProduct(product, cart);
          } else {
            return (product.packsStored + product.packsDisplayed) * (product.price * product.unitsPerPack) - vm.costForProduct(product, cart);
          }
        };

        vm.totalCost = function(products, cart) {
          return products.map(function(product) {
            return vm.costForProduct(product, cart);
          }).reduce(function(sum, current) {
            return sum + current;
          });
        };

        vm.totalProfit = function(products, cart) {
          return products.map(function(product) {
            return vm.profitForProduct(product, cart);
          }).reduce(function(sum, current) {
            return sum + current;
          });
        };

        vm.potentialProfit = function() {
          if (vm.productForm) {
            return (vm.productForm.unitsPerPack * vm.productForm.price) - vm.productForm.costPerPack;
          } else {
            return 0;
          }
        };
      }
    });
  }
})();
