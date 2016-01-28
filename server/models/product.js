var mongoose = require('mongoose');

var schema = {
  name: {
    type: String,
    required: true
  },
  packsStored: {
    type: Number,
    min: 0,
    default: 0,
    required: true
  },
  packsDisplayed: {
    type: Number,
    min: 0,
    default: 0,
    required: true
  },
  costPerPack: {
    type: Number,
    min: 0,
    required: true
  },
  unitsPerPack: {
    type: Number,
    min: 1,
    required: true
  },
  price: {
    type: Number,
    min: 0,
    required: true
  },
  boughtLastTime: {
    type: Number,
    min: 0,
    default: 0,
    required: true
  }
};

var productSchema = mongoose.Schema(schema);

productSchema.methods.notAdminToJSON = function() {
  var object = this.toObject();
  delete object.costPerPack;
  delete object.price;
  delete object.boughtLastTime;
  return object;
};

module.exports = mongoose.model('Product', productSchema);
module.exports.productSchema = productSchema;
