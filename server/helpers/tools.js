const findElement = (array, propName, propValue) => {
  for (let i = 0; i < array.length; i++) {
    if (String(array[i][propName]) === String(propValue)) {
      return array[i];
    }
  }
};

const addToStock = (products, cartOrder) => {
  return products.map(product => {
    const productOrdered = findElement(cartOrder, '_id', product._id);
    product.packsStored += productOrdered.bought;
    product.boughtLastTime = productOrdered.bought;
    return product;
  });
};

const removeFromStock = (products, productsToMove) => {
  return products.map(product => {
    const productToMove = findElement(productsToMove, '_id', product._id);
    product.packsStored -= productToMove.quantity;
    product.packsDisplayed += productToMove.quantity;
    return product;
  });
};

module.exports = {
  findElement,
  addToStock,
  removeFromStock
};
