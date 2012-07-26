var models = require('../../models/'),
    passpr = require('passport'),
    views  = require('consolidate');

var profile = exports;

profile.account = function(req, res) {
  res.render('account', {user: req.user});
};

profile.signIn = function(req, res) {
  res.render('login');
};

profile.login = passpr.authenticate('local', { successReturnToOrRedirect: '/account', failureRedirect: '/login' });

profile.logout = function(req, res) {
  req.logout();
  res.redirect('/');
};

profile.signUp = function(req, res) {
  res.render('register');
};
