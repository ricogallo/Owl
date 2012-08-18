var gravatar = require('gravatar'),
    common   = require('./lib/common'),
    user     = require('../models/').User;



var middlewares = exports;

middlewares.locals = function(req, res, next) {
  res.locals.user = req.user;
  res.locals.csrf = req.session._csrf;
  res.locals.gravatar = function(id) {
    return gravatar.url(id, { s: 64 });
  };
  next();
};

middlewares.notFound = function(req, res, next) {
  if(req.accepts('html')) {
    return common.handleError(new Error(404), res);
  }

  res.send('Not Found');
};
