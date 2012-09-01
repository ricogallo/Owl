var common   = require('./common'),
    models   = require('../../models'),
    gravatar = require('gravatar'),
    passport = require('passport'),
    core     = require('../../core');

var users = exports;

users.create = function(req, res, next) {
  var username = req.body.username,
      password = req.body.password,
      name = req.body.name,
      surname = req.body.surname,
      email = req.body.email,
      salt = core.common.salt();

  if (
    typeof username === 'undefined' ||
    typeof password === 'undefined' ||
    typeof name     === 'undefined' ||
    typeof surname  === 'undefined' ||
    typeof email    === 'undefined'
  ) return res.send(400);

  password = core.common.crypt(salt + password);

  models.User.create({username: username, password: password, salt: salt, name: name + ' ' + surname, email: email}, common.handleError(res, function(_, docs) {
    passport.authenticate('local', { successReturnToOrRedirect: '/', failureRedirect: '/login' })(req, res, next);
  }));
};

users.me = function(req, res) {
  core.links.user({ id: req.user.get('id') }, common.handleError(res, function(_, docs) {
    res.render('links', { user: docs });
  }));
};

users.get = function(req, res) {
  models.User.findOne({ where: { username: req.params.id } }, function(e, user) {
    core.links.user({ id: user && user.get('id') }, function(e, docs) {
      res.render('links', { user: docs });
    });
  });
};

users.userProfile = function(req, res) {
  var body = req.body,
      id   = req.user.get('id');

  core.users.settings({body: body, id: id}, handleError(res, function() {
    res.redirect('/me');    
  }));
};

users.account = function(req, res) {
  var id = req.params.id;

  core.links.user({id: id}, handleError(res, function(_, links, user) {
    res.render('links', { links: links, user: user });
  }));
};
