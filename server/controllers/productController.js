var Product = require('../models/product');
var Cart = require('../models/cart');
var tools = require('../helpers/tools');

module.exports = {
  index: (req, res, next) => {
    Product.find({})
      .then(products => {
        if (!req.user.admin) {
          products = products.map(product => product.notAdminToJSON());
        }
        res.status(200).json(products);
      })
      .catch(next);
  },

  create: (req, res, next) => {
    var newProduct = new Product();
    newProduct.name = req.body.name;
    newProduct.costPerPack = req.body.costPerPack;
    newProduct.unitsPerPack = req.body.unitsPerPack;
    newProduct.price = req.body.price;
    newProduct.save()
      .then(newProduct => res.status(201).json(newProduct))
      .catch(next);
  },

  update: (req, res, next) => {
    Product.findOne({ _id: req.params.id }).then(product => {
      product.name = req.query.name || product.name;
      product.packsDisplayed = req.query.packsDisplayed || product.packsDisplayed;
      product.costPerPack = req.query.costPerPack || product.costPerPack;
      product.unitsPerPack = req.query.unitsPerPack || product.unitsPerPack;
      product.price = req.query.price || product.price;
      return product.save().then(product => res.status(200).json(product));
    })
    .catch(next);
  },

  delete: (req, res, next) => {
    Product.remove({ _id: req.params.id })
      .then(() => res.status(202).json({}))
      .catch(next);
  },

  buy: (req, res, next) => {
    var newCart = new Cart();
    var ids = req.body.cartOrder.map(product => product._id);

    Product.find({ _id: { $in: ids } }).then(products => {
      return Promise.all(products.map(product => {
        var productOrdered = tools.findElement(req.body.cartOrder, '_id', product._id);
        product.packsStored += productOrdered.bought;
        product.boughtLastTime = productOrdered.bought;
        return product.validate();
      })).then(() => {
        return Promise.all(products.map(product => {
          return product.save();
        })).then(products => {
          newCart.products = products;
          return newCart.save();
        }).then(() => res.status(201).json({ products: products, newCart: newCart }));
      });
    })
    .catch(next);
  },

  move: (req, res, next) => {
    var ids = req.body.productsToMove.map(product => product._id);

    Product.find({ _id: { $in: ids } }).then(products => {
      return Promise.all(products.map(product => {
        var productToMove = tools.findElement(req.body.productsToMove, '_id', product._id);
        product.packsStored -= productToMove.quantity;
        product.packsDisplayed += productToMove.quantity;
        return product.validate();
      })).then(() => {
        return Promise.all(products.map(product => {
          return product.save();
        })).then(products => res.status(200).json(products));
      });
    })
    .catch(next);
  },

  getCarts: (req, res, next) => {
    Cart.find({})
      .then(carts => res.status(200).json(carts))
      .catch(next);
  }
};
