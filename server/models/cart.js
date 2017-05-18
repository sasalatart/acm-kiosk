const mongoose = require('mongoose');
const productSchema = require('./product').schema;

const cartSchema = mongoose.Schema({
  date: {
    type: Date,
    default: Date.now,
    required: true
  },
  products: [productSchema]
});

module.exports = mongoose.model('Cart', cartSchema);
module.exports.schema = cartSchema;
