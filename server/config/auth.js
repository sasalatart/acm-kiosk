var secrets = require('./secrets');

module.exports = {
  facebookAuth: {
    'clientID': secrets.FB_CLIENT_ID,
    'clientSecret': secrets.FB_CLIENT_SECRET,
    'callbackURL': 'http://' + secrets.APP_HOST + ':' + secrets.APP_PORT + '/auth/facebook/callback'
  }
};
