module.exports = function(app, passport) {
  var sessionController = require('./controllers/sessionController')(passport);
  var nomineeController = require('./controllers/nomineeController');
  var productController = require('./controllers/productController');
  var userController = require('./controllers/userController');

  app.get('/', function(req, res) {
    res.sendFile('client/templates/index.html', {
      'root': '../acm-kiosk'
    });
  });

  app.get('/auth/facebook', passport.authenticate('facebook', {
    scope: 'email'
  }));
  app.get('/auth/facebook/callback', sessionController.login);
  app.get('/logout', sessionController.isAuthenticated, sessionController.logout);
  app.get('/getUser', sessionController.getUser);

  app.get('/nominees', sessionController.isAuthenticated, nomineeController.index);
  app.post('/nominees', sessionController.isAdmin, nomineeController.create);
  app.put('/nominees/:id/vote', sessionController.isAuthenticated, nomineeController.vote);
  app.put('/nominees/:id/removeVote', sessionController.isAuthenticated, nomineeController.removeVote);
  app.get('/nominees/:id/getVoters', sessionController.isAuthenticated, nomineeController.getVoters);
  app.get('/nominees/resetVoters', sessionController.isAdmin, nomineeController.resetVoters);
  app.delete('/nominees/:id', sessionController.isAdmin, nomineeController.delete);

  app.get('/users', sessionController.isAuthenticated, userController.index);
  app.put('/users/:id/toggleAdmin', sessionController.isAdmin, userController.toggleAdmin);

  app.get('/products', sessionController.isAdmin, productController.index);
  app.post('/products', sessionController.isAdmin, productController.create);
  app.put('/products/:id', sessionController.isAdmin, productController.update);
  app.post('/products/buy', sessionController.isAdmin, productController.buy);
  app.post('/products/move', sessionController.isAdmin, productController.move);
  app.put('/products/:id/removeFromDisplay', sessionController.isAdmin, productController.removeFromDisplay);
  app.delete('/products/:id', sessionController.isAdmin, productController.delete);

  app.get('/carts', sessionController.isAdmin, productController.getCarts);

  app.use((err, req, res, next) => {
    if (process.env.NODE_ENV && process.env.NODE_ENV.toUpperCase() === 'PRODUCTION') {
      delete err.stack;
    } else {
      res.status(err.statusCode || 500).json(err);
    }
  });
}
