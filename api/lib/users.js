var core        = require('../../core/users'),
    handleError = require('./common').handleError;

var users = exports;

users.get = function(req, res) {
  core.get({
    id: req.params.id
  }, function(e, user) {
    if(e)
      return handleError(e, res);

    res.json(user);
  });
};

users.me = function(req, res) {
  core.me({
    user: req.user
  }, function(e, me) {
    if(e)
      return handleError(e, res);

    res.json(me);
  });
};
