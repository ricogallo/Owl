var models = require('../models/'),
    common = require('./common');

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

users.get = function(req, res) {
  var id = req.params.id,
      whitelist = ['email', 'name'];

  models.User.get(id, function(err, user) {
    var json = {};

    if (err) {
      if (err.error && err.error === 'not_found')
        return res.end(res.writeHead(404));
      else
        return res.end(res.writeHead(500));
    }
      

    if (!user)
      

    whitelist.forEach(function(x) {
      json[x] = user[x];
    });

    res.json(json);
  });
}

users.me = function(req, res) {
  var whitelist = whitelist = ['email', 'name', 'username'];

  models.User.get(req.user.id, function(err, docs) {
    var json = {};

    if (err) {
      if (err.error && err.error === 'not_found')
        return res.end(res.writeHead(404));
      else
        return res.end(res.writeHead(500));
    }

    whitelist.forEach(function(x) {
      json[x] = user[x];
    });

    res.json(json);
  });
}