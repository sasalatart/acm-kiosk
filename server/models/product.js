var mongoose = require('mongoose');

var schema = {
  name: {
    type: String,
    required: true
  },
  packsStored: {
    type: Number,
    default: 0,
    required: true
  },
  packsDisplayed: {
    type: Number,
    default: 0,
    required: true
  },
  costPerPack: {
    type: Number,
    required: true
  },
  unitsPerPack: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  boughtLastTime: {
    type: Number,
    default: 0,
    required: true
  }
};

var productSchema = mongoose.Schema(schema);

module.exports = mongoose.model('Product', productSchema);
module.exports.productSchema = productSchema;
