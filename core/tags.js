var models = require('../models/'),
    hater  = require('hater');

var tags = exports;

tags.get = function(obj, callback) {
  models.Tag.get(obj.id, function(e, tag) {
    if(e) {
      return e.error === 'not_found' ?
        callback(new Error(404)) :
        callback(new Error(500)) ;
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
      return callback(new Error(500));

    if (!rows)
      return callback(new Error(404));

    user.set('tags', [rows]);
    
    user.save(function(err, rows) {
      if (err)
        return callback(new Error(500));

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
      return callback(new Error(500));

    if (!row)
      return callback(new Error(404));

    user.unlink(row, function(err) {
      if (err)
        return callback(new Error(500));

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
