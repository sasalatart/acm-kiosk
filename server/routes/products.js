const router = require('express').Router();
const _ = require('lodash');
const Product = require('../models/product');
const Cart = require('../models/cart');
const tools = require('../helpers/tools');

const index = (req, res, next) => {
  Product.find({}).then(products => {
    if (!req.user.admin) {
      products = products.map(product => product.notAdminToJSON());
    }

    res.status(200).json(products);
  }).catch(next);
};

const create = (req, res, next) => {
  const newProduct = new Product(req.body);
  newProduct.save().then(newProduct => {
    res.status(201).json(newProduct);
  }).catch(next);
};

const update = (req, res, next) => {
  const newAttributes = JSON.parse(req.query.body);
  _.pick(newAttributes, _.identity);

  Product.findOneAndUpdate({ _id: req.params.id }, { $set: newAttributes }, { new: true }).then(product => {
    res.status(200).json(product);
  }).catch(next);
};

const destroy = (req, res, next) => {
  Product.remove({ _id: req.params.id }).then(() => {
    res.status(202).json({})
  }).catch(next);
};

const buy = (req, res, next) => {
  const { cartOrder } = req.body;
  const ids = cartOrder.map(product => product._id);

  Product.find({ _id: { $in: ids } }).then(products => {
    products = tools.addToStock(products, cartOrder);

    let newCart;
    return Promise.all(products.map(product => product.validate())).then(() => {
      return Promise.all(products.map(product => product.save())).then(products => {
        newCart = new Cart({ products });
        return newCart.save();
      }).then(() => {
        res.status(201).json({ products, newCart });
      });
    });
  }).catch(next);
};

const move = (req, res, next) => {
  const { productsToMove } = req.body;
  const ids = productsToMove.map(product => product._id);

  Product.find({ _id: { $in: ids } }).then(products => {
    products = tools.removeFromStock(products, productsToMove);

    return Promise.all(products.map(product => product.validate())).then(() => {
      return Promise.all(products.map(product => product.save())).then(products => {
        res.status(200).json(products);
      });
    });
  }).catch(next);
};

module.exports = ({ isAdmin }) => {
  router.get('/', isAdmin, index);
  router.post('/', isAdmin, create);
  router.put('/:id', isAdmin, update);
  router.delete('/:id', isAdmin, destroy);
  router.post('/buy', isAdmin, buy);
  router.post('/move', isAdmin, move);

  return router;
};
