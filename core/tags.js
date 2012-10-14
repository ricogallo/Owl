var models = require('../models/'),
    common = require('./common'),
    hater  = require('hater');

var tags = exports;

tags.get = function(obj, callback) {
  models.Tag.get(obj.id, function(e, tag) {
    if(e) {
      return e.error === 'not_found' ?
        callback(common.error(e, 404)) :
        callback(common.error(e, 500)) ;
    }

    tag.id = tag.id.split('/').pop();

    callback(e, tag);
  });
};

tags.subscribe = function(obj, callback) {
  var user = obj.user,
      tag  = obj.tag;

  models.Tag.findOne({where: {name: tag}}, function(e, rows) {
    if (e)
      return callback(common.error(e, 500));

    if (!rows)
      return callback(common.error(e, 404));

    user.set('tags', [rows]);
    
    user.save(function(e, rows) {
      if (e)
        return callback(common.error(e, 500));

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

  models.Tag.findOne({where: {name: tag}}, function(e, row) {
    if (e)
      return callback(common.error(e, 500));

    if (!row)
      return callback(common.error(e, 404));

    user.unlink(row, function(e) {
      if (e)
        return callback(common.error(e, 500));

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
