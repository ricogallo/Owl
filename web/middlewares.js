var gravatar = require('gravatar'),
    common   = require('./lib/common'),
    user     = require('../models/').User;



var middlewares = exports;

middlewares.locals = function(req, res, next) {
  res.locals.user = req.user;
  res.locals.csrf = req.session._csrf;
  res.locals.gravatar = function(chunk, context, bodies, params) {
   return chunk.map(function(chunk) {
      user.findOne({where: {id: params.id}}, function(e, user) {
        chunk.end(gravatar.url(user.email, { s: 64 }));
      });
    });
  };
  next();
};

middlewares.notFound = function(req, res, next) {
  if(req.accepts('html')) {
    return common.handleError(new Error(404), res);
  }

  res.send('Not Found');
};
