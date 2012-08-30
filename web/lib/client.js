var models      = require('../../models/'),
    handleError = require('./common'),
    common      = require('../../core/common');

var client = exports;

client.create = function(req, res) {
  var client_id    =  req.body.client_id,
      redirect_uri =  req.body.redirect_uri;
  
  if(
    typeof client_id === 'undefined' ||
    typeof redirect_uri === 'undefined'
  ) return handleError(new Error(400), res); 
  
  models.Client.create({
    client_id: client_id,
    user_id: req.user.get('id'),
    redirect_uri: redirect_uri,
    client_secret: common.client_secret()
  }, function(err, client) {
    if(err) return handleError(new Error(500), res);

    res.redirect('/');
  });
};

client.createForm = function(req, res) {
  res.render('client');
};

client.show = function(req, res) {
  models.Client.find({ where: {
    user_id: req.user.get('id')
  }}, function(e, clients) {
    if(e) return handleError(new Error(500), res);
    
    res.render('showClients', { clients: clients });
  });
};
