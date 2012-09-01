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
  }, common.handleError(res, function() {
    res.redirect('/' + req.user.get('username') + '/buckets/' + req.body.bucket);
  }));
};

buckets.showOne = function(req, res) {
  core.buckets.showOne(req.params, common.handleError(res, function(_, bucket) {
    res.render('showOneBucket', { bucket: bucket });
  }));
};

buckets.show = function(req, res) {
  core.buckets.show(req.params, common.handleError(res, function(_, buckets) {
    res.render('showBuckets', { buckets: buckets });
  }));
};

buckets.addForm = function(req, res) {
  req.user.load({ fetch: ['buckets']}, common.handleError(res, function() {
    res.render('addLink', { link: req.params.id, buckets: req.user.get('buckets') });
  }));
};

buckets.addLink = function(req, res) {
  core.buckets.addLink(req.body, common.handleError(res, function() {
    res.redirect('/');
  }));
};
