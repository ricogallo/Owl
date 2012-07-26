var models = require('../models/'),
    common = require('./common');

var users = exports;

users.get = function(id, callback) {
  var whitelist = ['email', 'name'];

  models.User.get(id, function(err, user) {
    var json = {};

    if (err) {
      if (err.error && err.error === 'not_found')
        return callback(new Error(404));
      else
        return callback(new Error(500));
    }

    whitelist.forEach(function(x) {
      json[x] = user[x];
    });

    callback(err, json);
  });
}

users.me = function(user, callback) {
  var whitelist = whitelist = ['email', 'name', 'username'];

  models.User.get(user.id, function(err, docs) {
    var json = {};

    if (err) {
      if (err.error && err.error === 'not_found')
        return callback(new Error(404));
      else
        return callback(new Error(500));
    }

    whitelist.forEach(function(x) {
      json[x] = user[x];
    });

    callback(err, json);
  });
}