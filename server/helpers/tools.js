module.exports = {
  findElement: (array, propName, propValue) => {
    for (var i = 0; i < array.length; i++) {
      if (array[i][propName] == propValue) {
        return array[i];
      }
    }
  }
}
