var core        = require('../../core/tags'),
    handleError = require('./common').handleError;

var tags = exports;

tags.subscribe = function(req, res) {
  core.subscribe({
    user: req.user,
    tag : req.body.tag
  }, handleError(res, function () {
    res.writeHead(204, {'Content-Type': 'application/json'});
    res.end();
  }));
};

tags.unsubscribe = function(req, res) {
  core.unsubscribe({
    user: req.user,
    tag : req.body.tag
  }, handleError(res, function(e) {
    res.writeHead(204, {'Content-Type': 'application/json'});
    res.end();
  }));
};
