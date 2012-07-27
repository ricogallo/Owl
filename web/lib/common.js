var codes = require('http').STATUS_CODES;

var common = exports;

common.handleError = function handleError(e, res) {
  res.render('error', {
    msg: codes[e.message],
    status: parseInt(e.message, 10)
  });
};