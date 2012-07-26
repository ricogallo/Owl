var core   = require('../../core/links'),
    status = require('http').STATUS_CODES;

var links = exports;

function handleError(e, res) {
  res.send(codes[e.message], parseInt(e.message, 10));
}

links.get = function(req, res) {
  core.get({
    links : links.params.id,
    tags  : req.body.tags,
    user  : req.user
  }, function(e, link) {
    if(e)
      return handleError(e, res);

    res.json(link);
  });
};

links.del = function(req, res) {
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
  core.update({
    id   : req.params.id, 
    url  : req.body.url,
    user : req.user
  }, function(e, link) {
    if(e)
      return handleError(e, res);
    
    res.json(link);
  });
};
