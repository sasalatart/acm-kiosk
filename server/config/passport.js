const FacebookStrategy = require('passport-facebook').Strategy;
const configAuth = require('../config/auth');
const User = require('../models/user');

module.exports = passport => {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findOne({
      '_id': id
    }, (err, user) => {
      done(err, user);
    });
  });

  passport.use(new FacebookStrategy({
    clientID: configAuth.facebookAuth.clientID,
    clientSecret: configAuth.facebookAuth.clientSecret,
    callbackURL: configAuth.facebookAuth.callbackURL,
    profileFields: ['id', 'email', 'displayName', 'picture.width(50).height(50)']
  }, (accessToken, refreshToken, profile, done) => {
    process.nextTick(() => {
      User.findOne({
        'facebook.id': profile.id
      }, (err, user) => {
        if (err) {
          return done(err);
        }

        if (user) {
          return done(null, user);
        }

        const newUser = new User();
        newUser.facebook.id = profile.id;
        newUser.facebook.token = accessToken;
        newUser.facebook.email = profile.emails[0].value;
        newUser.facebook.name = profile.displayName;
        newUser.facebook.photo = profile.photos[0].value;

        User.count({}, (err, count) => {
          if (err) {
            throw err;
          } else {
            newUser.admin = count === 0;
            newUser.save(err => {
              if (err) {
                throw err;
              } else {
                return done(null, newUser);
              }
            });
          }
        });
      });
    });
  }));
};
