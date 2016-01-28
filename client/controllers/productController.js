(function() {
  'use strict'

  angular.module('acmKiosk').controller('productController', productController);

  productController.$inject = ['sessionService', 'Product', 'Cart', '$http'];

  function productController(sessionService, Product, Cart, $http) {
    var vm = this;

    sessionService.identity().then(function(identity) {
      if (!identity) {
        sessionService.redirectToRoot();
        alert('You have not logged in!');
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
              bought: product.quantityBought || 0
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
              quantity: product.quantityToMove || 0
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

        vm.removeFromDisplay = function(product) {
          $http({
              method: 'PUT',
              url: '/products/' + product._id + '/removeFromDisplay',
            })
            .success(function(updatedProduct) {
              product.packsDisplayed = updatedProduct.packsDisplayed;
            })
            .error(function(error) {
              console.log(error);
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
    })
  }
})();
