const config = require('.');
const mongoose = require('mongoose');
const bluebird = require('bluebird');

mongoose.connect(config.MONGODB_URI || `mongodb://${config.DB_HOST}:${config.DB_PORT}/acm-kiosk`);
mongoose.Promise = bluebird;
