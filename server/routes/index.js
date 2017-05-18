const authorizations = require('./authorizations');
const validationErrorMessages = require('../helpers/validationErrorMessages');

module.exports = (app, passport) => {
  app.get('/', function(req, res) {
    res.sendFile('client/templates/index.html', {
      'root': '../acm-kiosk'
    });
  });

  app.use('/', require('./sessions')(passport));
  app.use('/nominees', require('./nominees')(authorizations));
  app.use('/users', require('./users')(authorizations));
  app.use('/products', require('./products')(authorizations));
  app.use('/carts', require('./carts')(authorizations));

  app.use((err, req, res, next) => {
    validationErrorMessages(err, req, res, next);
  });

  app.use((err, req, res) => {
    res.status(err.statusCode || 500).json({ messages: [err] });
  });
};
