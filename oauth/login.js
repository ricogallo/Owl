var passport = require('passport'),
    login    = require('connect-ensure-login'),
    views    = require('consolidate'),
    routes   = exports;

routes.index = function(req, res) {
  res.writeHead(200);
  res.end();
};

routes.form = function(req, res) {
  views.handlebars('../views/login', function(err, html) {
    res.end(html);
  });
};

routes.login = passport.authenticate('local', { successReturnToOrRedirect: '/', failureRedirect: '/login' });

routes.logout = function(req, res) {
  req.logout();
};

routes.account = [
  login.ensureLoggedIn(),
  function(req, res) {
    views.handlebars('../views/account', function(err, html) {
      res.end(html);
    });
  }
]

