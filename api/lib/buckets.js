var core        = require('../../core/buckets'),
    handleError = require('./common').handleError;

var buckets = exports;

buckets.create = function(req, res) {
  core.create({ user: req.user, name: req.body.name }, handleError(function(_, bucket) {
    res.send(201); 
  }));
};

buckets.addLink = function(req, res) {
  core.addLink(req.body, handleError(function() {
    res.send(204);
  }));
};

buckets.show = function(req, res) {
  core.show(req.params, handleError(function(_, buckets) {
    res.json(buckets);
  }));
};

buckets.showOne = function(req, res) {
  core.showOne(req.params, handleError(function(_, bucket) {
    res.json(bucket);
  }));
};
