var express = require('express');
var morgan = require('morgan');
var mongoose = require('mongoose');
var bluebird = require('bluebird');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');
var cookieParser = require('cookie-parser');
var secrets = require('./config/secrets');

var app = express();

mongoose.connect('mongodb://' + secrets.DB_HOST + ':' + secrets.DB_PORT + '/acmKiosk');
mongoose.Promise = bluebird;

require('./config/passport')(passport);

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());
app.use(cookieParser(secrets.COOKIE_SECRET));
app.use(session({
  cookie: {
    maxAge: 3000000
  },
  secret: secrets.SESSION_SECRET,
  saveUninitialized: true,
  resave: true
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/bower_components', express.static('bower_components'));
app.use(express.static('client/public'));

require('./routes')(app, passport);

app.listen(8888);
console.log('Listening on port 8888!');
