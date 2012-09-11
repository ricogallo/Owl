var gravatar = require('gravatar'),
    common   = require('./lib/common'),
    user     = require('../models/').User,
    pkginfo  = require('pkginfo')(module, 'version');



var middlewares = exports;

middlewares.tags = function(req, res, next) {
  if (req.user)
    req.user.tags = (req.user.get('tags') || []).map(function(i) {
      return i.get('name');
    });

  next();
}

middlewares.locals = function(req, res, next) {
  res.locals.user = req.user;
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

middlewares.ensureAccount = function(req, res, next) {
  if(req.url === '/email_sign_up') return next();

  if(req.user && req.user.get('email') === 'default@default.com') {
    return res.render('completeRegistration');
  }

  next();
};
