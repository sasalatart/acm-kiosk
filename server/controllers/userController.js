var User = require('../models/user');

module.exports = {
  index: (req, res, next) => {
    User.find({})
      .then(users => res.status(200).json(users))
      .catch(next);
  },

  toggleAdmin: (req, res, next) => {
    User.findOne({ _id: req.params.id }).then(user => {
      user.toggleAdmin();
      res.status(200).json(user);
    })
    .catch(next);
  }
};
