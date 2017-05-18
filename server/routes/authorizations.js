const isAuth = (req, res, next) => {
  if (req.user) {
    return next();
  }
  res.redirect('/');
};

const isAdmin = (req, res, next) => {
  if (req.user && req.user.admin) {
    return next();
  }
  res.redirect('/')
};

module.exports = {
  isAuth,
  isAdmin
};
