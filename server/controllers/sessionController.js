module.exports = function(passport) {
  return {
    login: function(req, res, next) {
      passport.authenticate('facebook', function(err, user, info) {
        if (user) {
          req.login(user, function(err) {
            if (err) {
              return next(err);
            } else {
              res.redirect('/');
            }
          });
        } else {
          res.status(404).send({ messages: info.message });
        }
      })(req, res, next);
    },

    logout: function(req, res) {
      req.session.destroy(function(err) {
        res.redirect('/');
      });
    },

    isAuth: function(req, res, next) {
      if (req.user) {
        return next();
      } else {
        res.redirect('/');
      }
    },

    isAdmin: function(req, res, next) {
      if (req.user && req.user.admin) {
        return next();
      } else {
        res.redirect('/');
      }
    },

    getUser: function(req, res) {
      res.status(200).json(req.user);
    }
  };
};
