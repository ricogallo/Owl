var links = exports,
    common = require('./common');
    core = require('../../core');

links.createForm = function(req, res) {
  res.render('createLink');
};

links.create = function(req, res) {
  if (
    !req.body.uri ||
    !req.body.tags
  ) return res.send(res.writeHead(400));

  core.links.create({
    user: req.user, 
    uri: req.body.uri, 
    tags: JSON.parse(req.body.tags)
  }, function(err, docs) {
    if (err)
<<<<<<< HEAD
      return common.handleError(err, res);
=======
      return common.errorHandler(err, res);

>>>>>>> 06cabb966e6a7db74d8e271b9afcf2fc2cf94673
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
