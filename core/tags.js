var models = require('../models/'),
    common = require('./common'),
    hater  = require('hater');

var tags = exports;

tags.get = function(obj, callback) {
  models.Tag.get(obj.id, function(e, tag) {
    if(e) {
      return e.error === 'not_found' ?
        callback(common.error(404, e)) :
        callback(common.error(500, e)) ;
    }

    tag.id = tag.id.split('/').pop();

    callback(e, tag);
  });
};

tags.subscribe = function(obj, callback) {
  var user = obj.user,
      tag  = obj.tag;

  models.Tag.findOne({where: {name: tag}}, function(err, rows) {
    if (err)
      return callback(common.error(500, e));

    if (!rows)
      return callback(common.error(404, e));

    user.set('tags', [rows]);
    
    user.save(function(err, rows) {
      if (err)
        return callback(common.error(500, e));

      var Q = new hater.builder.Query();
      Q.query = 'UPDATE tags SET followers = CASE WHEN followers IS NULL THEN 1 ELSE followers+1 END';
      Q.where({'name': tag});
      Q.exec(function(e) {
        if (e) return callback(e);

        callback(e);
      });
    });
  });
};

tags.unsubscribe = function(obj, callback) {
  var user = obj.user,
      tag  = obj.tag;

  models.Tag.findOne({where: {name: tag}}, function(err, row) {
    if (err)
      return callback(common.error(500, e));

    if (!row)
      return callback(common.error(404, e));

    user.unlink(row, function(err) {
      if (err)
        return callback(common.error(500, e));

      var Q = new hater.builder.Query();
      Q.query = 'UPDATE tags SET followers = followers-1';
      Q.where({'name': tag});
      Q.exec(function(e) {
        if (e) return callback(e);

        callback(e);
      });
    });
  });
};
