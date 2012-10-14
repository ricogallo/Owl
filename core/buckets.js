var models = require('../models/');

var buckets = exports;

buckets.create  = function(obj, callback) {
  obj.user.set('bucket', new models.Bucket({ name: obj.name }));
  
  obj.user.save(function(e) {
    callback(e ? common.error(500, e) : null);
  });
};

buckets.delete = function(obj, callback) {
  models.Bucket.destroy({ where: { id: obj.id } }, function(e) {
    if(e) return callback(common.error(500, e));

    callback(null);
  });
};

buckets.edit = function(obj, callback) {
  models.Bucket.update({ name: obj.name }, { where: { id: obj.id, user_id: obj.user_id } }, function(e) {
    if(e) return callback(common.error(500, e));

    callback(null);
  });
};

buckets.show = function(obj, callback) {
  models.User.findOne({ where: { username: obj.user }, fetch: ["buckets"] }, function(e, user) {
    if(e) return callback(common.error(500, e));
    
    callback(null, user.get('buckets'));
  });
};

buckets.showOne = function(obj, callback) {
  models.User.findOne({ where: { username: obj.user, buckets: { name: obj.name } }, fetch: ["buckets"] }, function(e, user) {
    if(e) return callback(common.error(500, e));
    var bucket = user.get('buckets') && user.get('buckets').shift();

    if(bucket) {
      bucket.load({ fetch: ["links.{user,tags}"] }, function(e) {
        callback(null, bucket);
      });
    }
    else {
      callback(common.error(404, e));
    }
  });
};

buckets.addLink = function(obj, callback) {
  models.Bucket.findOne({ where: { id: obj.bucket } }, function(e, bucket) {
    if(e) return callback(common.error(500, e)); 
    
    models.Link.findOne({ where: { id: obj.link } }, function(e, link) {
      if(e) return callback(common.error(500, e));

      bucket.set('links', [link]);
      bucket.save(function(e) {
        callback(e ? common.error(500, e) : null);
      });
    });
  });
};
