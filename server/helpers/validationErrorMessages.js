module.exports = (err, req, res) => {
  //If it isn't a mongoose-validation error, just throw it.
  if (err.name !== 'ValidationError') return cb(err);

  var messages = {
    'min': "%s below minimum.",
    'max': "%s above maximum.",
    'required': "%s is required."
  };

  //A validationerror can contain more than one error.
  var errors = [];

  //Loop over the errors object of the Validation Error
  Object.keys(err.errors).forEach(function(field) {
    var eObj = err.errors[field];

    if (messages.hasOwnProperty(eObj.properties.type)) {
      errors.push(eObj.message);
    } else {
      errors.push(require('util').format(messages[eObj.properties.type], eObj.properties.path));
    }
  });

  res.status(400).json(errors);
}
