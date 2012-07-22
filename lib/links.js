var models = require('../models/');

var links = exports;

links.all = function(req, res) {
  models.Link.all(function(err, links) {
      if(err) return res.send(500);

      //
      // If no link was found, return a 404
      //
      if(!links.length) return res.send(404);

      //
      // Otherwise JSON.stringify the result and send it back
      //
      res.send(JSON.stringify(links));
  });
};

links.get = function(req, res) {
  var id = req.params.id;

  models.Link.get(id, function(err, link) {
    //
    // If no link was found, return a 404
    //
    if (err) return res.send(404);

    //

    //
    // Otherwise JSON.stringify the result and send it back
    //
    res.send(JSON.stringify(links));
  });
};

links.create = function(req, res) {
  var body = req.body;

  if (!body || !body.uri || !body.tags) return res.send(400);

  req.user.createLink({uri: body.uri}, function(err, link) {
    
    if (err) {
      if (err.validate && !err.validate.valid)
        return res.send(400);
      else
        return res.send(500);
    }

    link.tags = [];
    body.tags.split(',').forEach(function(t) {
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
    
    res.send(JSON.stringify(link));
  });
}
