var mongoose = require('mongoose');
var userSchema = require('./user').userSchema;

var schema = {
  name: {
    type: String,
    required: true
  },
  voters: [{
    type: mongoose.Schema.ObjectId,
    ref: 'userSchema',
  }]
};

var nomineeSchema = mongoose.Schema(schema);

module.exports = mongoose.model('Nominee', nomineeSchema);
module.exports.nomineeSchema = nomineeSchema;
