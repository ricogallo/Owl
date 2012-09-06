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
  models.Redis.get(req.params.tok, function(e, tok) {
    if(e || !tok) { return res.redirect('/'); }
    
    res.render('register', { token: req.params.tok });
  });
};

profile.userProfile = function(req, res) {
  res.render('userProfile');
};
