var models = require('../models/');

var links = exports;

links.all = function() {
  var res = this.res,
      req = this.req;

  models.Link.all(function(err, links) {
    //
    // If there's an error return a 500
    //
    if(err) {
      res.writeHead(500);
      return res.end();
    }

    //
    // If no link was found, return a 404
    //
    if (links.length === 0) {
      res.writeHead(404);
      return res.end();
    }

    //
    // Otherwise JSON.stringify the result and send it back
    //
    res.writeHead(200);
    res.end(JSON.stringify(links));
  });
};

links.get = function(id) {
  var res = this.res,
      req = this.req;

  models.Link.get(id, function(err, link) {
    //
    // If there's an error return a 500
    //
    if (err) {
      res.writeHead(500);
      return res.end();
    }

    //
    // If no link was found, return a 404
    //
    if (links.length === 0) {
      res.writeHead(404);
      return res.end();
    }

    //
    // Otherwise JSON.stringify the result and send it back
    //
    res.writeHead(200);
    res.end(JSON.stringify(links));
  });
};

links.create = function() {
  var req = this.req,
      res = this.res,
      body = req.body;

  if (!body || !body.uri || !body.tags) {
    res.writeHead(400);
    return res.end();
  }

  req.account.createLink({uri: body.uri}, function(err, link) {
    if (err) {
      res.writeHead(500);
      return res.end();
    }
    
    body.tags.split(',').forEach(function(t) {
      models.Tag.find({name: t}, function(e, tag) {
        if(tag.length) {
          return link.createTag(tag);
        }
        
        link.createTag({name: t});
      });
    });
    
    res.writeHead(200);
    return res.end(JSON.stringify(link));
  });
}