var models = require('../models/'),
    common = require('./common');

var client = exports;

client.create = function(req, res) {
  var client_id    =  req.body.client_id,
      redirect_uri =  req.body.redirect_uri;
  
  if(
    typeof client_id === 'undefined' ||
    typeof redirect_uri === 'undefined'
  ) return res.end(res.writeHead(400)); 
  
  models.Client.create({
    id: client_id,
    user_id: req.user.id,
    redirect_uri: redirect_uri,
    client_secret: common.client_secret()
  }, function(err, client) {
    if(err) return res.send(500);

    res.redirect('/');
  });
};

client.createForm = function(req, res) {
  res.render('client');
};
