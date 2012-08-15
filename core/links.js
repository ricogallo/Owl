var models = require('../models/');

var links = exports;

links.get = function(obj, callback) {
  var id = obj.id;

  models.Link.findOne({where: {id: id}}, function(err, docs) {
    if (!docs)
      return callback(new Error(404));

    if (err)
      return callback(new Error(500));

    callback(err, docs);
  });
};

links.user = function(obj, callback) {
  var id = obj.id;

  models.User.find({where: {id: id}, fetch: ["links"]}, function(e, docs) {
    if (e)
      return callback(new Error(500));

    callback(e, docs);
  });
};

links.all = function(callback) {
  models.Link.find({}, function(err, docs) {
    if (err)
      return callback(new Error(500));

    callback(err, docs);
  });
};

// TO BE REWRITTEN
links.create = function(obj, callback) {
  var uri = obj.uri,
      tags = obj.tags,
      user = obj.user;

  user.createLink({uri: uri}, function(err, link) {
    if (err) {
      if (err.validate)
        return callback(new Error(400));
      else
        return callback(new Error(500));
    }

    link.tags = [];
    (function iterate(a_tags) {
      var t = a_tags.shift();
      
      models.Tag.get(t, function(e, tag) {
        if(tag) {
          link.createTag(tag, function(e, tag) {
            link.tags.push(tag);
            return a_tags.length ?
              iterate(a_tags) :
              callback(null, link);
          });
        } else {
          link.createTag({id: t}, function(e, tag) {
            link.tags.push(tag);
            return a_tags.length ?
              iterate(a_tags) :
              callback(null, link);
          });
        }
      });
    })([].slice.call(tags, 0));
 });
};

links.del = function(obj, callback) {
  var id = obj.id,
      uri = obj.uri,
      user = obj.user;

  models.Link.findOne({where: {id: id}}, function(err, docs) {
    if (err)
      return callback(new Error(500));

    if(!docs)
      return callback(new Error(404));

    update.uri = uri;

    if (docs.get('userId') === id) { // TODO: change this with real column from hater
      docs.destroy(function(err, docs) {
        if (err) return callback(new Error(500));
        
        callback(err, docs);
      });
    } else {
      callback(new Error(401));
    }
  });
};

links.update = function(obj, callback) {
  var id = obj.id,
      uri = obj.uri,
      user = obj.user;

  models.Link.findOne({where: {id: id}}, function(err, docs) {
    var update = {};

    if (err)
      return callback(new Error(500));

    if(!docs)
      return callback(new Error(404));

    update.uri = uri;

    if (docs.get('userId') === id) { // TODO: change this with real column from hater
      models.Link.update(update, {id: id}, function(err, docs) {
        if (err) return callback(new Error(500));
        
        callback(err, docs);
      });
    } else {
      callback(new Error(401));
    }
  });
};
