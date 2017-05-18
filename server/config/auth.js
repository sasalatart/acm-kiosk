const config = require('.');

module.exports = {
  facebookAuth: {
    'clientID': config.FB_CLIENT_ID,
    'clientSecret': config.FB_CLIENT_SECRET,
    'callbackURL': `http://${config.HOST}:${config.PORT}/auth/facebook/callback`
  }
};
