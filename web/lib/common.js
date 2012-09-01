var codes = require('http').STATUS_CODES;

var common = exports;

common.handleError = function handleError (res, fn) {
  return function () {
    var args = [].slice.call(arguments, 0),
        e    = args.shift();
    
    if (e) {
      res.render('error', {
        msg   : codes[e.message],
        status: parseInt(e.message, 10)
      });
    } else { fn.apply(null, arguments); }
  };
};
