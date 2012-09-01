var core        = require('../../core/links'),
    handleError = require('./common').handleError;

var links = exports;

links.all = function(req, res) {
  core.all(handleError(function(_, links) {
    res.json(links);
  }));
};

links.timeline = function(req, res) {
  core.timeline({
    user: req.user
  }, handleError(function(_, links) {
    res.json(links);
  }));
};

links.get = function(req, res) {
  core.get({
    id   : req.params.id,
    user : req.user
  }, handleError(function(_, link) {
    res.json(link);
  }));
};

links.del = function(req, res) {
  core.del({
    id   : req.params.id,
    user : req.user
  }, handleError(function() {
    res.send(204); 
  }));
};

links.update = function(req, res) {
  if(!req.body.uri) 
    return res.send(400);

  core.update({
    id   : req.params.id, 
    uri  : req.body.uri,
    user : req.user
  }, handleError(function(_, link) {
    res.json(link);
  }));
};

links.create = function(req, res) {
  if(
    !req.body.uri  ? true :
    !req.body.tags ? true :
    false
  ) return res.send(400);

  core.create({
    uri  : req.body.uri,
    tags : req.body.tags.split(','),
    user : req.user
  }, handleError(function(e, link) {
    res.json(link, 201);
  }));
};

links.user = function(req, res) {
  core.user({
    user: req.user
  }, handleError(function(_, links) {
    res.json(links);
  }));
};
