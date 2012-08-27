var models = require('../models/'),
    utile  = require('utile'),
    common = require('./common');

var users = exports;

users.get = function(obj, callback) {
  var id = obj.id,
      whitelist = ['email', 'name'];

  models.User.findOne({where: {username: id}}, function(err, user) {
    var json = {};

    if (!user)
      return callback(new Error(404));

    if (err)
      return callback(new Error(500));

    whitelist.forEach(function(x) {
      json[x] = user.get(x);
    });

    callback(err, json);
  });
};

users.me = function(obj, callback) {
  var user = obj.user,
      whitelist = ['email', 'name', 'username'];

  models.User.findOne({where: {id: user.get('id')}}, function(err, docs) {
    var json = {};

    if (!docs)
      return callback(new Error(404));

    if (err)
      return callback(new Error(500));

    whitelist.forEach(function(x) {
      json[x] = user.get(x);
    });

    callback(err, json);
  });
};

users.create = function(obj, callback) {
  models.User.create(obj, function(e, r) {
    if (e) {
      if (e.validate)
        return callback(new Error(400));
      else
        return callback(new Error(500));
    }

    callback(e, r);
  });
};

users.settings = function(obj, callback) {
  var body = obj.body,
      id = obj.id,
      whitelist = ['name'];

  if (body.name && body.surname)
    body.name += " "+body.surname;
  
  body = utile.filter(body, function(v, k) {
    return ~whitelist.indexOf(k);
  });

  models.User.update(body, {where: {id: id}}, function(err) {
    if (err)
      return callback(new Error(500));

    callback(err);
  });
};
