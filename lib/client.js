var models = require('../models/'),
    common = require('./common');

var client = exports;

client.create = function() {
  var res          =  this.res,
      req          =  this.req,
      client_id    =  req.body.client_id,
      redirect_uri =  req.body.redirect_uri;
  
  if(
    typeof client_id === 'undefined' ||
    typeof redirect_uri === 'undefined'
  ) return res.end(res.writeHead(400)); 
  
  models.Client.create({
    id: client_id,
    redirect_uri: redirect_uri,
    client_secret: common.client_secret()
  }, function(err, client) {
    if(err) return res.end(res.writeHead(500));

    res.writeHead(200);
    res.end(client);
  });
};
