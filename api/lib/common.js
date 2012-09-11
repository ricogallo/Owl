var codes = require('http').STATUS_CODES;

exports.handleError = function handleError (res, fn) {
  return function () {
    var args = [].slice.call(arguments, 0),
        e    = args.shift();

    if (e) {
      res.send(codes[e.message], parseInt(e.message, 10));
    } else { fn.apply(null, arguments); }
  };
};
