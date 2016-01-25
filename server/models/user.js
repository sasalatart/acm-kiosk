var mongoose = require('mongoose');
var nomineeSchema = require('./nominee').nomineeSchema;
var _ = require('underscore');

var schema = {
  facebook: {
    id: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    photo: {
      type: String,
      required: true
    }
  },
  admin: {
    type: Boolean,
    required: true
  },
  votes: [{
    type: mongoose.Schema.ObjectId,
    ref: 'nomineeSchema'
  }]
};

var userSchema = mongoose.Schema(schema);

userSchema.path('votes').validate(function(votes) {
  return votes.length <= 3;
});

userSchema.path('votes').validate(function(votes) {
  return _.uniq(_.map(votes, String)).length === votes.length;
});

module.exports = mongoose.model('User', userSchema);
module.exports.userSchema = userSchema;
