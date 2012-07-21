var models = require('../models/');

var links = exports;

links.all = function(req, res) {
  models.Link.all(function(err, links) {
      if(err) return res.end(res.writeHead(500));

      //
      // If no link was found, return a 404
      //
      if(!links.length) return res.end(res.writeHead(404));

      //
      // Otherwise JSON.stringify the result and send it back
      //
      res.writeHead(200);
      res.end(JSON.stringify(links));
  });
};

links.get = function(req, res) {
  var id = req.params.id;

  models.Link.get(id, function(err, link) {
    //
    // If there's an error return a 500
    //
    if (err) return res.end(res.writeHead(500));

    //
    // If no link was found, return a 404
    //
    if (!links.length) return res.end(res.writeHead(404));

    //
    // Otherwise JSON.stringify the result and send it back
    //
    res.writeHead(200);
    res.end(JSON.stringify(links));
  });
};

links.create = function(req, res) {
  var body = req.body;

  if (!body || !body.uri || !body.tags) return res.end(res.writeHead(400));

  req.user.createLink({uri: body.uri}, function(err, link) {
    
    if (err) {
      if (err.validate && !err.validate.valid)
        return res.end(res.writeHead(400));
      else
        return res.end(res.writeHead(500));
    }

    link.tags = [];
    body.tags.split(',').forEach(function(t) {
      models.Tag.find({name: t}, function(e, tag) {
        if(tag.length) {
          link.tags.push(tag);
          return link.createTag(tag);
        }
        
        link.createTag({name: t}, function(e, tag) {
          link.tags.push(tag);
        });
      });
    });
    
    res.writeHead(200);
    return res.end(JSON.stringify(link));
  });
}