var tags = exports,
    common = require('./common');
    core = require('../../core');

tags.showForm = function(req, res) {
  core.tags.get(req.params.id, function(e, tag) {
    if(e)
      return common.handleError(e, res);
    
    res.render('showTag', { tag: tag });
  });
};

tags.byTag = function(req, res) {
  var tag = req.params.tag;

  core.links.byTag({tag: tag, search: req.route.path.split('/')[1] === 'search'}, function(err, rows) {
    if (err)
      return common.handleError(err, res);

    if (!rows)
      return common.handleError(new Error(404), res);

    res.render('taglinks', {links: rows});
  });
};