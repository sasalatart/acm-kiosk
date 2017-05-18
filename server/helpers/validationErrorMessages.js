module.exports = (err, req, res, next) => {
  const errors = { messages: [] };

  if (err.name === 'ValidationError') {
    const messages = {
      'min': ' is below minimum.',
      'max': ' is above maximum.',
      'required': ' is required.'
    };

    Object.keys(err.errors).forEach(field => {
      const eObj = err.errors[field];
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
