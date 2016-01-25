module.exports = function(app, passport) {
  var sessionController = require('./controllers/sessionController')(passport);
  var nomineeController = require('./controllers/nomineeController');

  app.get('/', function(req, res) {
    res.sendFile('client/templates/index.html', {
      'root': '../acm-kiosk'
    })
  })

  app.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email' }));
  app.get('/auth/facebook/callback', sessionController.login);
  app.get('/logout', sessionController.logout);
  app.get('/getUser', sessionController.getUser);

  app.get('/nominees', nomineeController.index);
  app.post('/nominees', nomineeController.create);
  app.put('/nominees/:id/vote', nomineeController.vote);
  app.put('/nominees/:id/removeVote', nomineeController.removeVote);
  app.get('/nominees/:id/getVoters', nomineeController.getVoters);
  app.delete('/nominees/:id', nomineeController.delete);
}
