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
  }, function(e) {
    if(e) return common.handleError(e, res);

    res.redirect('/' + req.user.get('username') + '/buckets/' + req.body.bucket);
  });
};

buckets.showOne = function(req, res) {
  core.buckets.showOne(req.params, function(e, bucket) {
    if(e) return common.handleError(e, res);

    res.render('showOneBucket', { bucket: bucket });
  });
};

buckets.show = function(req, res) {
  core.buckets.show(req.params, function(e, buckets) {
    if(e) return common.handleError(e, res);

    res.render('showBuckets', { buckets: buckets });
  });
};
