var oauth  = require('oauth2rize'),
    models = require('../models/'),
    server = oauth.createServer();

server.serializeClient(function(client, done) {
  done(null, client.client_id);
});

server.deserializeClient(function(id, done) {
  models.Client.find({ client_id: id }, function(err, clients) {
    var client = clients.shift();

    if(err || !client) {
      return err ?
        done(err) :
        done(null, false) ;
    }

    done(null, client);
  });
});
