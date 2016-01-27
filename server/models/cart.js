var mongoose = require('mongoose');
var productSchema = require('./product').productSchema;

var schema = {
  date: {
    type: Date,
    default: Date.now,
    required: true
  },
  products: [productSchema]
};

var cartSchema = mongoose.Schema(schema);

module.exports = mongoose.model('Cart', cartSchema);
module.exports.cartSchema = cartSchema;
