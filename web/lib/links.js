var links = exports,
    core = require('../../core');

links.createForm = function(req, res) {
  res.render('createLink', { user: req.user });
};

links.create = function(req, res) {
  if (
    !req.body.uri ||
    !req.body.tags
  ) return res.send(res.writeHead(400));

  core.links.create({
    user: req.user, 
    uri: req.body.uri, 
    tags: req.body.tags
  }, function(err, docs) {
    if (err)
      return core.common.errorHandler(e, res);

    res.redirect('/');
  });
};

links.me = function(req, res) {
  core.links.user({id: req.user.id}, function(err, docs) {
    if (err)
      return core.common.errorHandler(err, res);

    res.render('links', {links: docs});
  });
};

links.account = function(req, res) {
  var id = req.params.id;

  core.links.user({id: id}, function(err, docs) {
    if (err)
      return core.common.errorHandler(err, res);

    res.render('links', {links: docs});
  });
};