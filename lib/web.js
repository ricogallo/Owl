var models = require('../models/'),
    passpr = require('passport'),
    views  = require('consolidate');

var profile = exports;

profile.account = function() {
  var res = this.res;

  consolidate.handlebars('../views/account.handlebars', function(err, html) {
    res.html(html);
  });
};

profile.signIn = function() {
  var res = this.res;

  consolidate.handlebars('../views/login.handlebars', function(err, html) {
    res.html(html);
  });
};

profile.login = passpr.authenticate('local', { successReturnToOrRedirect: '/account', failureRedirect: '/login' });

profile.logout = function() {
  this.req.logout();
  this.res.redirect('/');
};
