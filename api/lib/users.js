var core        = require('../../core/users'),
    handleError = require('./common').handleError;

var users = exports;

users.get = function(req, res) {
  core.get({
    id: req.params.id
  }, handleError(function(e, user) {
    res.json(user);
  }));
};

users.me = function(req, res) {
  core.me({
    user: req.user
  }, handleError(function(e, me) {
    res.json(me);
  }));
};
