const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const config = require('./config');

const app = express();

require('./config/db');
require('./config/passport')(passport);

app.use(morgan('tiny'));

app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());
app.use(cookieParser(config.SECRET_TOKEN));
app.use(session({
  cookie: {
    maxAge: 3000000
  },
  secret: config.SECRET_TOKEN,
  saveUninitialized: true,
  resave: true
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/bower_components', express.static('bower_components'));
app.use(express.static('client/public'));

require('./routes')(app, passport);

module.exports = app;
