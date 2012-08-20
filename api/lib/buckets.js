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
