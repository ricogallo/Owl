var models = require('../../models/'),
    passpr = require('passport');

var profile = exports;

profile.account = function(req, res) {
  res.render('account');
};

profile.signIn = function(req, res) {
  res.render('login', {status: req.params && req.params.status});
};

profile.login = passpr.authenticate('local', { successReturnToOrRedirect: '/me', failureRedirect: '/login/failed' });


profile.logout = function(req, res) {
  req.logout();
  res.redirect('/');
};

profile.signUp = function(req, res) {
  res.render('register');
};

profile.settings = function(req, res) {
  res.render('update');
};