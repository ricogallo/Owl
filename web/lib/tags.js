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

  core.links.byTag({tag: tag}, function(err, rows) {
    res.render('taglinks', {links: rows});
  });
};