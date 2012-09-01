var buckets = exports,
    common  = require('./common'),
    core    = require('../../core');

buckets.createForm = function(req, res) {
  res.render('createBucket');
}; 

buckets.create = function(req, res) {
  core.buckets.create({
    name: req.body.bucket,
    user: req.user
  }, common.handleError(function() {
    res.redirect('/' + req.user.get('username') + '/buckets/' + req.body.bucket);
  }));
};

buckets.showOne = function(req, res) {
  core.buckets.showOne(req.params, common.handleError(function(_, bucket) {
    res.render('showOneBucket', { bucket: bucket });
  }));
};

buckets.show = function(req, res) {
  core.buckets.show(req.params, common.handleError(function(_, buckets) {
    res.render('showBuckets', { buckets: buckets });
  }));
};

buckets.addForm = function(req, res) {
  req.user.load({ fetch: ['buckets']}, common.handleError(function() {
    res.render('addLink', { link: req.params.id, buckets: req.user.get('buckets') });
  }));
};

buckets.addLink = function(req, res) {
  core.buckets.addLink(req.body, common.handleError(function() {
    res.redirect('/');
  }));
};
