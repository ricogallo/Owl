var core        = require('../../core/tags'),
    handleError = require('./common').handleError;

var tags = exports;

tags.subscribe = function(req, res) {
  console.log(req.params.tag);
  core.subscribe({
    user: req.user,
    tag : req.body.tag
  }, function(e) {
    if (e)
      return handleError(e, res);

    res.writeHead(204, {'Content-Type': 'application/json'});
    res.end();
  });
};

tags.unsubscribe = function(req, res) {
  core.unsubscribe({
    user: req.user,
    tag : req.body.tag
  }, function(e) {
    if (e)
      return handleError(e, res);

    res.writeHead(204, {'Content-Type': 'application/json'});
    res.end();
  });
};