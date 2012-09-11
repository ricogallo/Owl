var models = require('../models/');

var buckets = exports;

buckets.create  = function(obj, callback) {
  obj.user.set('buckets', [new models.Bucket({ name: obj.name })]);
  
  obj.user.save(function(e) {
    callback(e ? new Error(500) : null);
  });
};

buckets.delete = function(obj, callback) {
  models.Bucket.destroy({ where: { id: obj.id } }, function(e) {
    if(e) return callback(new Error(500));

    callback(null);
  });
};

buckets.edit = function(obj, callback) {
  models.Bucket.update({ name: obj.name }, { where: { id: obj.id, user_id: obj.user_id } }, function(e) {
    if(e) return callback(new Error(500));

    callback(null);
  });
};

buckets.show = function(obj, callback) {
  models.User.findOne({ where: { username: obj.user }, fetch: ["buckets"] }, function(e, user) {
    if(e) return callback(new Error(500));
    
    callback(null, user.get('buckets'));
  });
};

buckets.showOne = function(obj, callback) {
  models.User.findOne({ where: { username: obj.user, buckets: { name: obj.name } }, fetch: ["buckets"] }, function(e, user) {
    if(e) return callback(new Error(500));
    var bucket = user.get('buckets') && user.get('buckets').shift();

    if(bucket) {
      bucket.load({ fetch: ["links.{user,tags}"] }, function(e) {
        callback(null, bucket);
      });
    }
    else {
      callback(new Error(404));
    }
  });
};

buckets.addLink = function(obj, callback) {
  models.Bucket.findOne({ where: { id: obj.bucket } }, function(e, bucket) {
    if(e) return callback(new Error(500)); 
    
    models.Link.findOne({ where: { id: obj.link } }, function(e, link) {
      if(e) return callback(new Error(500));

      bucket.set('links', [link]);
      bucket.save(function(e) {
        callback(e ? new Error(500) : null);
      });
    });
  });
};
