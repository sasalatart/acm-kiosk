module.exports = function(app, passport) {
  var sessionCtrl = require('./controllers/sessionController')(passport);
  var nomineeCtrl = require('./controllers/nomineeController');
  var productCtrl = require('./controllers/productController');
  var userCtrl = require('./controllers/userController');
  var validationErrorMessages = require('./helpers/validationErrorMessages');

  app.get('/', function(req, res) {
    res.sendFile('client/templates/index.html', {
      'root': '../acm-kiosk'
    });
  });

  app.get('/auth/facebook', passport.authenticate('facebook', {
    scope: 'email'
  }));
  app.get('/auth/facebook/callback', sessionCtrl.login);
  app.get('/logout', sessionCtrl.isAuth, sessionCtrl.logout);
  app.get('/getUser', sessionCtrl.getUser);

  app.get('/nominees', sessionCtrl.isAuth, nomineeCtrl.index);
  app.post('/nominees', sessionCtrl.isAdmin, nomineeCtrl.create);
  app.put('/nominees/:id/vote', sessionCtrl.isAuth, nomineeCtrl.vote);
  app.put('/nominees/:id/removeVote', sessionCtrl.isAuth, nomineeCtrl.removeVote);
  app.get('/nominees/resetVoters', sessionCtrl.isAdmin, nomineeCtrl.resetVoters);
  app.delete('/nominees/:id', sessionCtrl.isAdmin, nomineeCtrl.delete);

  app.get('/users', sessionCtrl.isAuth, userCtrl.index);
  app.put('/users/:id', sessionCtrl.isAdmin, userCtrl.toggleAdmin);

  app.get('/products', sessionCtrl.isAuth, productCtrl.index);
  app.post('/products', sessionCtrl.isAdmin, productCtrl.create);
  app.put('/products/:id', sessionCtrl.isAdmin, productCtrl.update);
  app.post('/products/buy', sessionCtrl.isAdmin, productCtrl.buy);
  app.post('/products/move', sessionCtrl.isAdmin, productCtrl.move);
  app.delete('/products/:id', sessionCtrl.isAdmin, productCtrl.delete);
  app.get('/carts', sessionCtrl.isAdmin, productCtrl.getCarts);

  app.use((err, req, res, next) => {
    validationErrorMessages(err, req, res);
  });

  app.use((err, req, res, next) => {
    res.status(err.statusCode || 500).json(err);
  });
}
