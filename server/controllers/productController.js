var async = require('async');
var Product = require('../models/product');
var Cart = require('../models/cart');

module.exports = {
  index: function(req, res) {
    Product.find({}, function(err, products) {
      if (err) {
        res.status(500).json(err);
      } else {
        res.status(200).json(products);
      }
    });
  },

  create: function(req, res) {
    var newProduct = new Product();
    newProduct.name = req.body.name;
    newProduct.costPerPack = req.body.costPerPack;
    newProduct.unitsPerPack = req.body.unitsPerPack;
    newProduct.price = req.body.price;

    newProduct.save(function(err) {
      if (err) {
        res.status(400).json({ messages: 'Failed to create your new product.' });
      } else {
        res.status(201).json(newProduct);
      }
    });
  },

  update: function(req, res) {
    Product.findOne({ _id: req.params.id }, function(err, product) {
      if (err) {
        res.status(500).json(err);
      } else {
        product.name = req.body.name;
        product.costPerPack = req.body.costPerPack;
        product.unitsPerPack = req.body.unitsPerPack;
        product.price = req.body.price;
        product.save(function(err) {
          if (err) {
            res.status(400).json(err);
          } else {
            res.status(200).json(product);
          }
        });
      }
    });
  },

  delete: function(req, res) {
    Product.remove({ _id: req.params.id }, function(err) {
      if (err) {
        res.status(404).json(err);
      } else {
        res.status(202).json({});
      }
    })
  },

  buy: function(req, res) {
    var newCart = new Cart();

    async.eachSeries(req.body.cartOrder, function(productOrdered) {
      Product.findOne({ _id: productOrdered._id }, function(err, product) {
        if (err) {
          throw err;
        } else {
          product.packsStored += productOrdered.bought;
          product.boughtLastTime = productOrdered.bought;
          product.save(function(err) {
            if (err) {
              throw err;
            } else {
              newCart.products.push(product);
            }
          });
        }
      });
    }, newCart.save(function(err) {
      if (err) {
        //rollback here
        res.status(500).json(err);
      } else {
        res.status(201).json(newCart);
      }
    }));
  },

  move: function(req, res) {
    var promises = req.body.productsToMove.map(function(productToMove) {
      return new Promise(function(resolve, reject) {
        Product.findOne({ _id: productToMove._id }, function(err, product) {
          if (err) {
            return reject(err);
          } else {
            product.packsStored -= productToMove.quantity;
            product.packsDisplayed += productToMove.quantity;
            product.save(function(err) {
              if (err) {
                return reject (err);
              } else {
                return resolve(product);
              }
            });
          }
        });
      });
    });

    Promise.all(promises)
      .then(function(products) { res.status(200).json(products) })
      .catch(console.error);
  }
}
