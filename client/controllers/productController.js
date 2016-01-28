(function() {
  'use strict'

  angular.module('acmKiosk').controller('productController', productController);

  productController.$inject = ['sessionService', 'errorService', 'Product', 'Cart', '$http'];

  function productController(sessionService, errorService, Product, Cart, $http) {
    var vm = this;

    sessionService.identity().then(function(identity) {
      if (!identity) {
        sessionService.redirectToRoot();
        swal('Oops...', '¡Debes iniciar sesión para hacer esto!', 'error');
      } else {
        vm.identity = identity;

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
            price: product.editPrice || product.price
          }, function(updatedProduct) {
            product.name = updatedProduct.name;
            product.costPerPack = updatedProduct.costPerPack;
            product.unitsPerPack = updatedProduct.unitsPerPack;
            product.price = updatedProduct.price;
          }, function(error) {
            errorService.handler(error.data);
          });
          product.editing = false;
        };

        vm.removeFromDisplay = function(product) {
          product.$update({
            id: product._id,
            packsDisplayed: product.packsDisplayed - 1,
          }, function(updatedProduct) {
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
              vm.products = response.data.products;
            }, function error(response) {
              errorService.handler(response.data);
            });

          vm.action = "";
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
              vm.products = response.data;
            }, function error(response) {
              errorService.handler(response.data);
            });

          vm.action = "";
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
            return product.boughtLastTime * product.unitsPerPack * product.price;
          } else {
            return (product.packsStored + product.packsDisplayed) * ((product.price * product.unitsPerPack) - product.costPerPack);
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
      }
    });
  }
})();
