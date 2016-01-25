module.exports = function(app, passport) {
  var sessionController = require('./controllers/sessionController')(passport);
  var nomineeController = require('./controllers/nomineeController');

  app.get('/', function(req, res) {
    res.sendFile('client/templates/index.html', {
      'root': '../acm-kiosk'
    });
  });

  app.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email' }));
  app.get('/auth/facebook/callback', sessionController.login);
  app.get('/logout', sessionController.isAuthenticated, sessionController.logout);
  app.get('/getUser', sessionController.getUser);

  app.get('/nominees', sessionController.isAuthenticated, nomineeController.index);
  app.post('/nominees', sessionController.isAdmin, nomineeController.create);
  app.put('/nominees/:id/vote', sessionController.isAuthenticated, nomineeController.vote);
  app.put('/nominees/:id/removeVote', sessionController.isAuthenticated, nomineeController.removeVote);
  app.get('/nominees/:id/getVoters', sessionController.isAuthenticated, nomineeController.getVoters);
  app.delete('/nominees/:id', sessionController.isAdmin, nomineeController.delete);
}
