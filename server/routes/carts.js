const router = require('express').Router();
const Cart = require('../models/cart');

const index = (req, res, next) => {
  Cart.find({})
    .then(carts => res.status(200).json(carts))
    .catch(next);
};

const destroy = (req, res, next) => {
  Cart.remove({ _id: req.params.id })
    .then(() => res.status(202).json({}))
    .catch(next);
};

module.exports = ({ isAdmin }) => {
  router.get('/', isAdmin, index);
  router.delete('/:id', isAdmin, destroy);

  return router;
};
