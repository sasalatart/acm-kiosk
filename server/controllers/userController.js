var User = require('../models/user');

module.exports = {
  index: function(req, res) {
    User.find({}, function(err, users) {
      if (err) {
        res.status(500).json(err);
      } else {
        res.status(200).json(users);
      }
    });
  },

  toggleAdmin: function(req, res) {
    User.findOne({ _id: req.params.id }, function(err, user) {
      if (err) {
        res.status(500).json(err);
      } else {
        user.toggleAdmin();
        res.status(200).json(user)
      }
    })
  }
};
