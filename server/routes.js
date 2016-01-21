module.exports = function(app, passport) {
  var sessionController = require('./controllers/sessionController')(passport);

  app.get('/', function(req, res) {
    res.sendFile('client/templates/index.html', {
      'root': '../acm-kiosk'
    })
  })

  app.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email' }));
  app.get('/auth/facebook/callback', sessionController.login);
  app.get('/logout', sessionController.logout);
  app.get('/getUser', sessionController.getUser);
}
