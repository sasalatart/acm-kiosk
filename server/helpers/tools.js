module.exports = {
  findElement: (array, propName, propValue) => {
    for (var i = 0; i < array.length; i++) {
      if (String(array[i][propName]) === String(propValue)) {
        return array[i];
      }
    }
  }
};
