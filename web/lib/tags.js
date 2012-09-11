var tags = exports,
    common = require('./common');
    core = require('../../core');

tags.showForm = function(req, res) {
  core.tags.get(req.params.id, common.handleError(res, function(_, tag) {
    res.render('showTag', { tag: tag });
  }));
};

tags.byTag = function(req, res) {
  var tag = req.params.tag;

  core.links.byTag({tag: tag, search: req.route.path.split('/')[1] === 'search'}, common.handleError(res, function(_, rows) {
    req.user.load({fetch: ['tags']}, common.handleError(res, function() {
      var usertags = (req.user.get('tags') || []).map(function(x) {
        return x.get('name');
      });

      res.render('taglinks', {links: rows, tag: tag, usertags: usertags, search: req.route.path.split('/')[1] === 'search'});
    }));
  }));
};

tags.subscribe = function(req, res) {
  var tag  = req.params.tag,
      user = req.user;

  core.tags.subscribe({tag: tag, user: user}, common.handleError(res, function(_, rows) {
    res.redirect('/tags/'+tag);
  }));
};

tags.unsubscribe = function(req, res) {
  var tag  = req.params.tag,
      user = req.user;

  core.tags.unsubscribe({tag: tag, user: user}, common.handleError(res, function(_, rows) {
    res.redirect('/tags/'+tag);
  }));
};

tags.timeline = function(req, res) {
  var user = req.user;

  core.links.timeline({user: user}, common.handleError(res, function(_, rows) {
    res.render('linksc', { links: rows.filter(function(v) { return v !== null; }) });
  }));
};
