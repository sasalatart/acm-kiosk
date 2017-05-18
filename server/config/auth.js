const config = require('.');

module.exports = {
  facebookAuth: {
    'clientID': config.FB_CLIENT_ID,
    'clientSecret': config.FB_CLIENT_SECRET,
    'callbackURLDev': `http://${config.HOST}:${config.PORT}/auth/facebook/callback`,
    'callbackURLProd': `http://${config.HOST}/auth/facebook/callback`
  }
};
