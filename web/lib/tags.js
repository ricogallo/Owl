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

    req.user.load({fetch: ['tags']}, function(err) {
      if (err)
        return common.handleError(new Error(500), res);

      var usertags = (req.user.get('tags') || []).map(function(x) {
        return x.get('name');
      });

      res.render('taglinks', {links: rows, tag: tag, usertags: usertags});
    });
  });
};

tags.subscribe = function(req, res) {
  var tag  = req.params.tag,
      user = req.user;

  core.tags.subscribe({tag: tag, user: user}, function(err, rows) {
    if (err)
      return common.handleError(err, res);

    res.redirect('/tags/'+tag);
  });
};

tags.unsubscribe = function(req, res) {
  var tag  = req.params.tag,
      user = req.user;

  core.tags.unsubscribe({tag: tag, user: user}, function(err, rows) {
    if (err)
      return common.handleError(err, res);

    res.redirect('/tags/'+tag);
  });
};

tags.timeline = function(req, res) {
  var user = req.user;

  core.links.timeline({user: user}, function(err, rows) {
    if (err)
      return common.handleError(err, res);
    
    res.render('linksc', { links: rows.filter(function(v) { return v !== null; }) });
  });
};
