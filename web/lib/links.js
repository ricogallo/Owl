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
  }, function(err, docs) {
    if (err)
      return common.handleError(err, res);
    res.redirect('/');
  });
};

links.delete = function(req, res) {
  core.links.del({id: req.params.id, user: req.user}, function(e, docs) {
    if (e)
      return common.handleError(e, res);

    res.redirect('/');
  });
};
