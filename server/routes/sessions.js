const router = require('express').Router();

const loginCallback = passport => {
  return (req, res, next) => {
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
  };
};

const logout = (req, res) => {
  req.session.destroy(() => res.redirect('/'));
};

const currentUser = (req, res) => {
  res.status(200).json(req.user);
};

module.exports = passport => {
  router.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email' }));
  router.get('/auth/facebook/callback', loginCallback(passport));
  router.get('/logout', logout);
  router.get('/current_user', currentUser);

  return router;
}
