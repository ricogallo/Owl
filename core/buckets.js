var models = require('../models/');

var buckets = exports;

buckets.create  = function(obj, callback) {
  obj.user.set('buckets', [new models.Bucket({ name: obj.name })]);

  obj.user.save(function(e) {
    callback(e ? new Error(500) : null);
  });
};

buckets.addLink = function(obj, callback) {
  models.Bucket.findOne({ where: { id: obj.bucket } }, function(e, bucket) {
    models.Link.findOne({ where: { id: obj.link } }, function(e, link) {
      bucket.set('links', [link]);
      bucket.save(function(e) {
        callback(e ? new Error(500) : null);
      });
    });
  });
};
