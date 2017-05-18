const router = require('express').Router();
const User = require('../models/user');

module.exports = ({ isAuth, isAdmin }) => {
  router.get('/', isAuth, (req, res, next) => {
    User.find({})
      .then(users => res.status(200).json(users))
      .catch(next);
  });

  router.put('/:id', isAdmin, (req, res, next) => {
    User.findOne({ _id: req.params.id }).then(user => {
      user.toggleAdmin();
      res.status(200).json(user);
    }).catch(next);
  });

  return router;
};
