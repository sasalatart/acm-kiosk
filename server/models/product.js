const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
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
});

productSchema.methods.notAdminToJSON = function() {
  let object = this.toObject();
  delete object.costPerPack;
  delete object.price;
  delete object.boughtLastTime;
  return object;
};

module.exports = mongoose.model('Product', productSchema);
module.exports.schema = productSchema;
