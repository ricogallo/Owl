var models = require('../models/');

var links = exports;

links.get = models.Links.get;

links.create = function(obj, callback) {
  var uri = obj.uri,
      tags = obj.tags,
      user = obj.user;

  user.createLink({uri: uri}, function(err, link) {
    
    if (err) return callback(new Error(500));

    link.tags = [];
    tags.forEach(function(t) {
      models.Tag.get(t, function(e, tag) {
        if(tag) {
          link.tags.push(tag);
          return link.createTag(tag);
        }
        
        link.createTag({ id: t }, function(e, tag) {
          link.tags.push(tag);
        });
      });
    });
    
    callback(err, link);
  });
}

links.del = function(obj, callback) {
  var id = obj.id,
      user = obj.user;

  user.links(function(err, docs) { // no way to get doc by id, thx resourceful, really
    if (err) {
      if (err.error && err.error === 'not_found')
        return callback(new Error(404));
      else
        return callback(new Error(500));
    }

    docs = docs.map(function(x) {
      return x.id.match(/.+?\/.+?\/(.+)/)[1];
    });

    if (~docs.indexOf(id)) {
      models.Link.destroy('user/'+user.id+'/'+id, function(err, docs) {
        if (err)
          return callback(new Error(500));

        callback(err, docs);
      });
    } else {
      callback(new Error(401));
    }
  });
}

links.update = function(obj, callback) {
  var id = obj.id,
      uri = obj.uri,
      user = obj.user;

  user.links(function(err, docs) { // no way to get doc by id, thx resourceful, really
    var update = {};

    if (err) {
      if (err.error && err.error === 'not_found')
        return callback(new Error(404));
      else
        return callback(new Error(500));
    }

    update.uri = uri;

    docs = docs.map(function(x) {
      return x.id.match(/.+?\/.+?\/(.+)/)[1];
    });

    if (~docs.indexOf(id)) {
      models.Link.update('user/'+user.id+'/'+id, update, function(err, docs) {
        if (err) return callback(new Error(500));
        
        callback(err, docs);
      });
    } else {
      callback(new Error(401));
    }
  });
}
