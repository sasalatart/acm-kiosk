module.exports = (err, req, res, next) => {
  var errors = { messages: [] };

  if (err.name === 'ValidationError') {
    var messages = {
      'min': ' is below minimum.',
      'max': ' is above maximum.',
      'required': ' is required.'
    };

    Object.keys(err.errors).forEach(function(field) {
      var eObj = err.errors[field];
      errors.messages.push(eObj.properties.path + messages[eObj.properties.type]);
    });

    res.status(400).json(errors);
  } else if (err.name === 'TypeError') {
    errors.messages.push('Resource not found');
    res.status(404).json(errors);
  } else {
    next(err, req, res);
  }
};
