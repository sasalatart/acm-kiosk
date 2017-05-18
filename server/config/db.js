const config = require('.');
const mongoose = require('mongoose');
const bluebird = require('bluebird');

mongoose.connect(`mongodb://${config.DB_HOST}:${config.DB_PORT}/acm-kiosk`);
mongoose.Promise = bluebird;
