var gravatar = require('gravatar'),
    common   = require('./lib/common'),
    user     = require('../models/').User,
    pkginfo  = require('pkginfo')(module, 'version');



var middlewares = exports;

middlewares.locals = function(req, res, next) {
  res.locals.user = req.user;
  if (req.user)
    console.dir(req.user.get('tags'));
  res.locals.csrf = req.session._csrf;
  res.locals.landing = false;
  res.locals.gravatar = function(id) {
    return gravatar.url(id, { s: 64 });
  };
  res.locals.VERSION = module.exports.version;
  next();
};

middlewares.notFound = function(req, res, next) {
  if(req.accepts('html')) {
    return common.handleError(res)(new Error(404));
  }

  res.send('Not Found');
};
