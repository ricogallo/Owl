var models = require('../models/');

var links = exports;

links.get = function(obj, callback) {
  var id = obj.id;

  models.Link.get(id, function(err, docs) {
    if (err) {
      if (err.error && err.error === 'not_found')
        return callback(new Error(404));
      else
        return callback(new Error(500));
    }

    docs.id = docs.id.split('/').pop();

    callback(err, docs);
  });
}

links.user = function(obj, callback) {
  var id = obj.id;

  models.User.get(id, function(err, user) {
    if (err) {
      if (err.error && err.error === 'not_found')
        return callback(new Error(404));
      else
        return callback(new Error(500));
    }

    user.links(function(err, docs) {
      if (err) {
        if (err.error && err.error === 'not_found')
          docs = [];
        else
          return callback(new Error(500));
      }

      docs = docs.map(function(x) {
        console.dir(x);
        x.id = x.id.split('/').pop();

        return x;
      });

      callback(err, docs, user);
    });
  });
}

links.all = function(callback) {
  models.Link.all(function(err, docs) {
    if (err)
      return callback(new Error(500));

    docs = docs.map(function(x) {
      console.dir(x);
      x.id = x._id.split('/').pop();

      return x;
    });

    callback(err, docs);
  });
}

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
