var oauth  = require('oauth2rize'),
    models = require('../models/'),
    common = require('../lib/commons');
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

server.grant(
  oauth.grant.code(function(client, redirect_uri, user, ares, done) {
    var code = common.code();

    models.Code.create({
      authorization_code: code,
      redirect_uri: redirect_uri,
      client_id: client.id,
      user_id: user.id
    }, function(err, code) {
      if(err) return done(err); 

      done(null, code);
    });
  })
);
