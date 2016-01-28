var Product = require('../models/product');
var Cart = require('../models/cart');

module.exports = {
  index: (req, res, next) => {
    Product.find({})
      .then(products => res.status(200).json(products))
      .catch(next);
  },

  create: (req, res, next) => {
    var newProduct = new Product();
    newProduct.name = req.body.name;
    newProduct.costPerPack = req.body.costPerPack;
    newProduct.unitsPerPack = req.body.unitsPerPack;
    newProduct.price = req.body.price;
    newProduct.save()
      .then(res.status(201).json(newProduct))
      .catch(next);
  },

  update: (req, res, next) => {
    Product.findOne({ _id: req.params.id }).then(product => {
      product.name = req.body.name;
      product.costPerPack = req.body.costPerPack;
      product.unitsPerPack = req.body.unitsPerPack;
      product.price = req.body.price;
      product.save().then(res.status(200).json(product));
    })
    .catch(next);
  },

  delete: (req, res, next) => {
    Product.remove({ _id: req.params.id })
      .then(res.status(202).json({}))
      .catch(next);
  },

  buy: (req, res, next) => {
    var newCart = new Cart();
    var ids = req.body.cartOrder.map(product => product._id);

    function findElement(array, propName, propValue) {
      for (var i = 0; i < array.length; i++)
        if (array[i][propName] == propValue)
          return array[i];
    }

    Product.find({ _id: { $in: ids } }).then(products => {
      Promise.all(products.map(product => {
        var productOrdered = findElement(req.body.cartOrder, '_id', product._id);
        product.packsStored += productOrdered.bought;
        product.boughtLastTime = productOrdered.bought;
        return product.save().then(newCart.products.push(product));
      })).then(newCart.save().then(res.status(201).json(newCart)));
    })
    .catch(next);
  },

  move: (req, res, next) => {
    var ids = req.body.productsToMove.map(product => product._id);

    function findElement(array, propName, propValue) {
      for (var i = 0; i < array.length; i++)
        if (array[i][propName] == propValue)
          return array[i];
    }

    Product.find({ _id: { $in: ids } }).then(products => {
      Promise.all(products.map(product => {
        var productToMove = findElement(req.body.productsToMove, '_id', product._id);
        product.packsStored -= productToMove.quantity;
        product.packsDisplayed += productToMove.quantity;
        return product.save();
      })).then(res.status(200).json(products))
    })
    .catch(next);
  },

  removeFromDisplay: (req, res, next) => {
    Product.findOne({ _id: req.params.id }).then(product => {
      product.packsDisplayed -= 1;
      product.save().then(res.status(200).json(product));
    })
    .catch(next);
  },

  getCarts: (req, res, next) => {
    Cart.find({})
      .then(carts => res.status(200).json(carts))
      .catch(next);
  }
}
