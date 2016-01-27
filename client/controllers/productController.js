(function() {
  'use strict'

  angular.module('acmKiosk').controller('productController', productController);

  productController.$inject = ['sessionService', 'Product', '$http'];

  function productController(sessionService, Product, $http) {
    var vm = this;
    vm.products = [];
    vm.productForm = {};
    vm.carts = [];

    sessionService.identity().then(function(identity) {
      if (!identity) {
        sessionService.redirectToRoot();
        alert('You have not logged in!');
      } else {
        vm.identity = identity;

        Product.query(function(products) {
          vm.products = products;
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
            alert(error.data.messages);
          });
          vm.productForm = {};
        };

        vm.updateProduct = function(product) {
          var tempProduct = product;
          tempProduct.name = product.editName || product.name;
          tempProduct.costPerPack = product.editCostPerPack || product.costPerPack;
          tempProduct.unitsPerPack = product.editUnitsPerPack || product.unitsPerPack;
          tempProduct.price = product.editPrice || product.price;
          tempProduct.$update({
            id: product._id
          }, function(updatedProduct) {
            product.name = updatedProduct.name;
            product.costPerPack = updatedProduct.costPerPack;
            product.unitsPerPack = updatedProduct.unitsPerPack;
            product.price = updatedProduct.price;
          }, function(error) {
            alert(error.data.messages);
          });
          product.editing = false;
        };

        vm.deleteProduct = function(product) {
          Product.delete({
            id: product._id
          }, function() {
            var index = vm.products.indexOf(product);
            if (index !== -1) {
              vm.products.splice(index, 1);
            }
          }, function(error) {
            alert(error.data.messages);
          });
        };

        vm.buyProducts = function() {
          var cartOrder = [];
          vm.products.forEach(function(product) {
            cartOrder.push({
              _id: product._id,
              bought: product.quantityBought
            });
          });

          $http({
              method: 'POST',
              url: '/products/buy',
              data: {
                cartOrder: cartOrder
              }
            })
            .success(function(cart) {
              vm.carts.push(cart);
              Product.query(function(products) {
                vm.products = products;
              });
            })
            .error(function(error) {
              console.log(error);
            });
        };

        vm.moveProducts = function() {
          var productsToMove = [];

          vm.products.forEach(function(product) {
            productsToMove.push({
              _id: product._id,
              quantity: product.quantityToMove
            });
          });

          $http({
            method: 'POST',
            url: '/products/move',
            data: {
              productsToMove: productsToMove
            }
          })
          .success(function(products) {
            vm.products = products;
          })
          .error(function(error) {
            console.log(error);
          });
        };

        vm.costPerUnit = function(product) {
          return product.costPerPack / product.unitsPerPack;
        };

        vm.profitForBox = function(product) {
          return (product.price * product.unitsPerPack) - product.costPerPack;
        };
      }
    })
  }
})();
