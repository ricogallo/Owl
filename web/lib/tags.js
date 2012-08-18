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

