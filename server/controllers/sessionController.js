module.exports = function(passport) {
  return {
    login: (req, res, next) => {
      passport.authenticate('facebook', (err, user, info) => {
        if (user) {
          req.login(user, function(err) {
            if (err) {
              return next(err);
            } else {
              res.redirect('/');
            }
          });
        } else {
          res.status(404).send({ messages: err });
        }
      })(req, res, next);
    },

    logout: (req, res) => {
      req.session.destroy(() => {
        res.redirect('/');
      });
    },

    isAuth: (req, res, next) => {
      if (req.user) {
        return next();
      } else {
        res.redirect('/');
      }
    },

    isAdmin: (req, res, next) => {
      if (req.user && req.user.admin) {
        return next();
      } else {
        res.redirect('/');
      }
    },

    getUser: (req, res) => {
      res.status(200).json(req.user);
    }
  };
};
