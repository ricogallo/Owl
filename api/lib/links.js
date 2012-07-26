var core   = require('../../core/links'),
    status = require('http').STATUS_CODES;

var links = exports;

function handleError(e, res) {
  res.send(codes[e.message], parseInt(e.message, 10));
}

links.get = function(req, res) {
  if(req.params.id) return res.send(400);

  core.get({
    id   : req.params.id,
    user : req.user
  }, function(e, link) {
    if(e)
      return handleError(e, res);

    res.json(link);
  });
};

links.del = function(req, res) {
  if(!req.params.id) return res.send(400);

  core.del({
    id   : req.params.id,
    user : req.user
  }, function(e) {
    if(e)
      return handleError(e, res);

    res.send(204); 
  });
};

links.update = function(req, res) {
  if(
    !req.params.id ? true :
    !req.body.uri  ? true :
    false
  ) return res.send(400);

  core.update({
    id   : req.params.id, 
    uri  : req.body.uri,
    user : req.user
  }, function(e, link) {
    if(e)
      return handleError(e, res);
    
    res.json(link);
  });
};

links.create = function(req, res) {
  if(
    !req.body.uri  ? true :
    !req.body.tags ? true :
    false
  ) return res.send(400);

  core.create({
    uri  : req.body.uri,
    tags : req.body.tags,
    user : req.user
  }, function(e, link) {
    if(e)
      return handleError(e, res);

    res.json(link, 201);
  });
};
