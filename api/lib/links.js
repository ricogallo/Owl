var core   = require('../../core/links'),
    status = require('http').STATUS_CODES;

var links = exports;

function handleError(e, res) {
  res.send(codes[e.message], parseInt(e.message, 10));
}

links.get = function(req, res) {
  core.get(links.params.id, req.body.tags, req.user, function(e, link) {
    if(e)
      return handleError(e, res);

    res.json(link);
  });
};

links.del = function(req, res) {
  core.del(req.params.id, req.user, function(e) {
    if(e)
      return handleError(e, res);
    

  });
};
