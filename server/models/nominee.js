const mongoose = require('mongoose');

const nomineeSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  voters: [{
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }]
});

module.exports = mongoose.model('Nominee', nomineeSchema);
module.exports.schema = nomineeSchema;
