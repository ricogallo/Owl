var models  = require('../models/'),
    buckets = require('./buckets'),
    hater   = require('hater'),
    async   = require('utile').async,
    jerry   = require('jerry');

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
  
  models.User.findOne({where: { id: id }, fetch: ["links.{tags,user}", 'bucket', 'tags']}, function(e, doc) {
    if (e)
      return callback(new Error(500));

    doc.tags = (doc.get('tags') || []).map(function(i) {
      return i.get('name');
    });
    
    exports.findVote(doc.get('links'), function() {
      callback(e, doc.get('links'));
    });
  });
};

links.all = function(callback) {
  models.Link.find({}, function(err, docs) {
    if (err)
      return callback(new Error(500));

    callback(err, docs);
  });
};

links.create = function(obj, callback) {
  var uri = obj.uri,
      user = obj.user,
      tags = [];
  
  function done() {
    jerry(uri, function(e, infos) {
      infos = infos || {};

      user.set('links', [
        new models.Link({ 
          uri    : uri, 
          tags   : tags,
          title  : (infos.title && infos.title.length > 30 ? infos.title.slice(0,25) + '...' : infos.title) || '',
          favicon: infos.favicon || ''
        })
      ]);
      
      user.save(function(e) {
        if (e) {
          if (e[0] && e[0].message === 'invalid input')
            return callback(new Error(400));
          else
            return callback(new Error(500));
        }

        buckets.addLink({link: user.get('links')[0].get('id'), bucket: user.get('bucket').get('id')}, callback);
      });
    });
  }


  (function iterate(names) {
    var tag = names.shift();

    if(!tag) { return done(); }

    models.Tag.findOrCreate({ where: { name: tag } }, function(e, instance) {
      if(e) return callback(new Error(500));
      
      tags.push(instance);

      var Q = new hater.builder.Query();
      Q.query = 'UPDATE tags SET hits = CASE WHEN hits IS NULL THEN 1 ELSE hits+1 END';
      Q.where({'name': tag});
      Q.exec(function(e) {
        if (e) return callback(new Error(500));

        iterate(names);
      });
    });

  })(obj.tags);

};

links.vote = function(obj, callback) { 
  var voteObj = {
    link_id: obj.linkId,
    user_id: obj.user.get('id')
  };

  models.Vote.findOne({ where: voteObj }, function(e, vote) {
    if(vote) {
      vote.destroy(callback);
    }
    else {
      models.Vote.create(voteObj, callback);
    }
  });
};

links.del = function(obj, callback) {
  var id = obj.id,
      uri = obj.uri,
      user = obj.user;

  models.Link.findOne({where: {id: id}, fetch: ['tags']}, function(err, docs) {
    if (err)
      return callback(new Error(500));

    if(!docs)
      return callback(new Error(404));

    var tags = docs.get('tags').map(function(i) {
      return i.get('name');
    });

    if (docs.get('user_id') === user.get('id')) {
      var Q = new hater.builder.Query();
      Q.query = 'UPDATE tags SET hits=hits-1';
      Q.where({name: tags});
      
      Q.exec(function(err, rows) {
        if (err) return callback(new Error(500));

        docs.destroy(function(err, docs) {
          if (err) return callback(new Error(500));
        
          callback(err, docs);
        });
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

    if (docs.get('user_id') === id) { // TODO: change this with real column from hater
      models.Link.update(update, {id: id}, function(err, docs) {
        if (err) return callback(new Error(500));
        
        callback(err, docs);
      });
    } else {
      callback(new Error(401));
    }
  });
};

links.byTag = function(obj, callback) {
  var limit = obj.limit || 10,
      tag   = (obj.search) ? new RegExp('%'+obj.tag+'%') : obj.tag;

  models.Tag.findOne({where: {name: tag}, fetch: ["links.{tags,user}"]}, function(err, rows) {
    var links;

    if (err)
      return callback(new Error(500));

    if (!rows)
      return callback(new Error(404));

    callback(err, rows.get('links'));
  });
};

links.timeline = function(obj, callback) {
  var user = obj.user;

  models.User.findOne({where: {id: user.get('id')}, fetch: ["tags.links.{user,tags}"], orderby: {id: "desc"}}, function(err, docs) {
    var links = [];

    if (err)
      return callback(new Error(500));
    
    if(docs.get('tags') && docs.get('tags').length) {
      links = links.concat.apply(links, 
        docs.get('tags').map(function(x) {
          return x.get('links');
        })
      );
    }

    exports.findVote(links, function() {
      callback(err, links);
    });
  });
};

links.findVote = function(links, callback) {
  if(!links) return callback();

  async.forEach(links, function(item, cbl) {
    models.Vote.find({ where: { link_id: item.get('id') } }, function(e, res) {
      item.votes = (res && res.length) || 0;
      cbl();
    });
  }, callback);
};
