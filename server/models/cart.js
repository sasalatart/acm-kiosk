var mongoose = require('mongoose');
var productSchema = require('./product').schema;

var cartSchema = mongoose.Schema({
  date: {
    type: Date,
    default: Date.now,
    required: true
  },
  products: [productSchema]
});

module.exports = mongoose.model('Cart', cartSchema);
module.exports.schema = cartSchema;
