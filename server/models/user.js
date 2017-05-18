const mongoose = require('mongoose');
const _ = require('underscore');

const userSchema = mongoose.Schema({
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
    ref: 'Nominee'
  }]
});

userSchema.path('votes').validate(function(votes) {
  return votes.length <= 3;
}, 'Sólo puedes votar tres veces.');

userSchema.path('votes').validate(function(votes) {
  return _.uniq(_.map(votes, String)).length === votes.length;
}, 'No puedes votar más de una vez por el mismo producto.');

userSchema.methods.toggleAdmin = function() {
  this.admin = !this.admin;
  this.save();
};

userSchema.methods.toJSON = function() {
  let object = this.toObject();
  delete object.facebook.token;
  return object;
};

module.exports = mongoose.model('User', userSchema);
module.exports.schema = userSchema;
