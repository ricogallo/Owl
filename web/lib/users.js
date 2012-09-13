var common   = require('./common'),
    models   = require('../../models'),
    gravatar = require('gravatar'),
    passport = require('passport'),
    utile    = require('utile'),
    core     = require('../../core'),
    mail     = require('nodemailer');

var users = exports,
    gmail = mail.createTransport('SMTP', {
      service: 'Gmail',
      auth: {
        user: 'no-reply@urlship.com',
        pass: process.env.NOREPLY_PWD
      }
    });

users.sendMail = function(req, res, next) { 
  models.User.findOne({ where: { email: req.body.email } }, function(e, usr) {
    if(usr) { return res.redirect('/'); }

    var token = utile.randomString(40);

    models.Redis.set(token, req.body.email, function() {
      models.Redis.expire(token, 86400, function() {
        gmail.sendMail({
          from   : 'urlship <no-reply@urlship.com>',
          to     : req.body.email,
          subject: 'Welcome to urlship!',
          text   : 'Welcome to urlship, you\'re one step away from activating your account, please click here http://alpha.urlship.com/activate/' + token + ' and follow instructions'
        }, function(e) {
          res.redirect('/');
        });
      });
    });
  });
};

users.completeRegistration = function(req, res, next) {
  var body = {
    email  : req.body.email,
    name   : req.body.name + ' ' + req.body.surname,
    surname: req.body.surname
  };

  models.User.update(body, { where: { username: req.user.get('username') } }, function(e) {
    if(e) return res.send(500);
    
    res.redirect('/');
  }); 
};

users.create = function(req, res, next) {
  var username = req.body.username,
      password = req.body.password,
      name     = req.body.name,
      surname  = req.body.surname,
      token    = req.body.token,
      salt     = core.common.salt();

  if (
    typeof username === 'undefined' ||
    typeof password === 'undefined' ||
    typeof name     === 'undefined' ||
    typeof surname  === 'undefined' ||
    typeof token    === 'undefined'
  ) return res.send(400);

  password = core.common.crypt(salt + password);

  models.Redis.get(token, function(e, email) {
    if(!email || e) { return res.redirect('/'); }

    core.users.create({username: username, password: password, salt: salt, name: name + ' ' + surname, email: email}, common.handleError(res, function(_, docs) {
      passport.authenticate('local', { successReturnToOrRedirect: '/', failureRedirect: '/login' })(req, res, next);
    }));
  });
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

  core.users.settings({body: body, id: id}, common.handleError(res, function() {
    res.redirect('/me');    
  }));
};

users.account = function(req, res) {
  var id = req.params.id;

  core.links.user({id: id}, common.handleError(res, function(_, links, user) {
    res.render('links', { links: links, user: user });
  }));
};
