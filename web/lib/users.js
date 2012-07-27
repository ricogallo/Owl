var common = require('../../core/common'),
    models = require('../../models'),
    core = require('../../core');

var users = exports;

users.create = function(req, res) {
  var username = req.body.username,
      password = req.body.password,
      name = req.body.name,
      surname = req.body.surname,
      email = req.body.email,
      salt = common.salt();

  if (
    typeof username === 'undefined' ||
    typeof password === 'undefined' ||
    typeof name === 'undefined'     ||
    typeof surname === 'undefined'  ||
    typeof email === 'undefined'
  ) return res.send(400);

  password = common.crypt(salt + password);

  models.User.create({id: username, password: password, salt: salt, name: name+' '+surname, email: email}, function(err, docs) {
    //
    // If there's an error return a 500
    //
    if (err) {
      res.send(500);
    }

    return res.redirect('/');
  });
};

users.me = function(req, res) {
  core.links.user({id: req.user.id}, function(err, docs) {
    if (err)
      return core.common.errorHandler(err, res);

    res.render('links', { links: docs });
  });
};

users.account = function(req, res) {
  var id = req.params.id;

  core.links.user({id: id}, function(err, links, user) {
    if (err)
      return core.common.errorHandler(err, res);

    res.render('links', { links: links });
  });
};
