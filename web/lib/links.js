var links = exports,
    common = require('./common');
    core = require('../../core');

links.createForm = function(req, res) {
  res.render('createLink');
};

links.create = function(req, res) {
  if (
    !req.body.uri ||
    !req.body.hiddenTagList
  ) return res.send(res.writeHead(400));
  
  core.links.create({
    user: req.user, 
    uri: req.body.uri, 
    tags: req.body.hiddenTagList.split(',')
  }, common.handleError(res, function(_, docs) {
    res.redirect('/');
  }));
};

links.vote = function(req, res) {
  core.links.vote({
    linkId: req.params.id,
    user  : req.user
  }, common.handleError(res, function() {
    res.redirect('/');
  }));
};

links.delete = function(req, res) {
  core.links.del({id: req.params.id, user: req.user}, common.handleError(res, function(_, docs) {
    res.redirect('/');
  }));
};
