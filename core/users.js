var models  = require('../models/'),
    utile   = require('utile'),
    buckets = require('./buckets'),
    common  = require('./common');

var users = exports;

users.get = function(obj, callback) {
  var id = obj.id,
      whitelist = ['email', 'name', 'id', 'username'];

  models.User.findOne({where: {username: id}, fetch: ['tags', 'bucket', 'links']}, function(err, user) {
    var json = {};

    if (!user)
      return callback(common.error(404, e));

    if (err)
      return callback(common.error(500, e));

    whitelist.forEach(function(x) {
      json[x] = user.get(x);
    });

    json.tags = (user.get('tags') || []).map(function(i) {
      return i.get('name');
    });

    user.tags = json.tags;

    callback(err, json, user);
  });
};

users.me = function(obj, callback) {
  var user = obj.user,
      whitelist = ['email', 'name', 'username'];

  models.User.findOne({where: {id: user.get('id')}, fetch: ['tags']}, function(err, docs) {
    var json = {};

    if (!user)
      return callback(common.error(404, e));

    if (err)
      return callback(common.error(500, e));

    whitelist.forEach(function(x) {
      json[x] = user.get(x);
    });

    json.tags = (user.get('tags') || []).map(function(i) {
      return i.get('name');
    });

    callback(err, json);
  });
};

users.create = function(obj, callback) {
  models.User.create(obj, function(e, r) {
    var bucket;

    if (e) {
      if (Array.isArray(e) && e[0].attribute)
        return callback(common.error(400, e));
      else
        return callback(common.error(500, e));
    }

    buckets.create({name: r.get('username'), user: r}, function(e) {
      if (e) return callback(common.error(500, e));

      callback(e, r);
    });
  });
};

users.findOrCreate = function(obj, callback) {
  models.User.findOne(obj.where || obj, function(e, user) {
    if (e) 
      return callback(common.error(500, e));

    if (user)
      return callback(e, user);

    user.create(obj.where || obj, callback);
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
      return callback(common.error(500, e));

    callback(err);
  });
};