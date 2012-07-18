var models = require('../models/'),
    common = require('./common');

var users = exports;

users.create = function(req, res) {
  var username = req.body.username,
      password = req.body.password,
      salt = common.salt();

  if (
    typeof username === 'undefined' ||
    typeof password === 'undefined'
  ) return res.send(400);

  password = common.crypt(salt + password);

  models.User.create({id: username, password: password, salt: salt}, function(err, docs) {
    //
    // If there's an error return a 500
    //
    if (err) {
      res.send(500);
    }
    return res.redirect('/');
  });
};
