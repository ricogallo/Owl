var models = require('../models/'),
    common = require('./common');

var users = exports;

users.get = function(obj, callback) {
  var id = obj.id,
      whitelist = ['email', 'name'];

  models.User.findOne({where: {id: id}}, function(err, user) {
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
}

users.me = function(obj, callback) {
  var user = obj.user,
      whitelist = ['email', 'name', 'username'];

  models.User.findOne({where: {id: user.id}}, function(err, docs) {
    var json = {};

    if (!docs)
      return callback(new Error(404));

    if (err)
      return callback(new Error(500));

    whitelist.forEach(function(x) {
      json[x] = user[x];
    });

    callback(err, json);
  });
}