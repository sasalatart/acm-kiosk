var express = require('express');
var morgan = require('morgan');
var mongoose = require('mongoose');
var bluebird = require('bluebird');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');
var cookieParser = require('cookie-parser');

var app = express();

var DB_HOST = process.env.DATABASE_HOST || 'mongo_db';
var DB_PORT = process.env.DATABASE_PORT || '27017';
mongoose.connect('mongodb://' + DB_HOST + ':' + DB_PORT + '/acmKiosk');
mongoose.Promise = bluebird;

require('./config/passport')(passport);

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());
app.use(cookieParser(process.env.COOKIE_SECRET || 'napoleon'));
app.use(session({
  cookie: {
    maxAge: 3000000
  },
  secret: process.env.SESSION_SECRET || 'napoleon',
  saveUninitialized: true,
  resave: true
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/bower_components', express.static('bower_components'));
app.use(express.static('client/assets'));
app.use(express.static('client/templates'));

require('./routes')(app, passport);

app.listen(8888);
console.log('Listening on port 8888!');
