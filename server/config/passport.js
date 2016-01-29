var FacebookStrategy = require('passport-facebook').Strategy;
var configAuth = require('../config/auth');
var User = require('../models/user');

module.exports = function(passport) {
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findOne({
      '_id': id
    }, function(err, user) {
      done(err, user);
    });
  });

  passport.use(new FacebookStrategy({
    clientID: configAuth.facebookAuth.clientID,
    clientSecret: configAuth.facebookAuth.clientSecret,
    callbackURL: configAuth.facebookAuth.callbackURL,
    profileFields: ['id', 'email', 'displayName', 'picture.width(50).height(50)']
  }, function(accessToken, refreshToken, profile, done) {
    process.nextTick(function() {
      User.findOne({
        'facebook.id': profile.id
      }, function(err, user) {
        if (err) {
          return done(err);
        }
        if (user) {
          return done(null, user);
        } else {
          var newUser = new User();
          newUser.facebook.id = profile.id;
          newUser.facebook.token = accessToken;
          newUser.facebook.email = profile.emails[0].value;
          newUser.facebook.name = profile.displayName;
          newUser.facebook.photo = profile.photos[0].value;

          User.count({}, function(err, count) {
            if (err) {
              throw err;
            } else {
              if (count === 0) {
                newUser.admin = true;
              } else {
                newUser.admin = false;
              }

              newUser.save(function(err) {
                if (err) {
                  throw err;
                } else {
                  return done(null, newUser);
                }
              });
            }
          });
        }
      });
    });
  }));
};
