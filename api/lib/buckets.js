var core        = require('../../core/buckets'),
    handleError = require('./common').handleError;

var buckets = exports;

buckets.create = function(req, res) {
  core.create({ user: req.user, name: req.body.name }, function(e, bucket) {
    if(e)
      return handleError(e, res);

    res.send(201); 
  });
};

buckets.addLink = function(req, res) {
  core.addLink(req.body, function(e) {
    if(e) return handleError(e, res);

    res.send(204);
  });
};

buckets.show = function(req, res) {
  core.show(req.params, function(e, buckets) {
    if(e) return handleError(e, res);
    
    res.json(buckets);
  });
};

buckets.showOne = function(req, res) {
  core.showOne(req.params, function(e, bucket) {
    if(e) return handleError(e, res);

    res.json(bucket);
  });
};
