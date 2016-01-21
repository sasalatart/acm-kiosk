var mongoose = require('mongoose');

var userSchema = {
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
  }
}

var userMongooseSchema = mongoose.Schema(userSchema);

module.exports = mongoose.model('User', userMongooseSchema);
module.exports.userMongooseSchema = userMongooseSchema;
module.exports.userSchema = userSchema;
