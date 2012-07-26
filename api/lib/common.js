var codes = require('http').STATUS_CODES;

exports.handleError = function handleError(e, res) {
  res.send(codes[e.message], parseInt(e.message, 10));
};


