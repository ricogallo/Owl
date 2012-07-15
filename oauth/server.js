var oauth  = require('oauth2rize'),
    passpr = require('passport'),
    models = require('../models/'),
    common = require('../lib/commons'),
    login  = require('connect-ensure-login'),
    views  = require('consolidate'),
    server = oauth.createServer(),
    config = exports;

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

server.exchange(
  oauth.exchange.code(function(client, code, redirect_uri, done) {
    models.Code.find({authorization_code: code}, function(err, codes) {
      var code = codes.shift();

      if(err) return done(err);

      if(
        !code ? true
        : code.client_id !== client ? true
        : code.redirect_uri === redirect_uri ? true
        : false
      ) return done(null, false); 

      var token = common.token();
      models.Token.create({
        client_id: code.client_id,
        access_token: token,
        user_id: code.user_id 
      }, function(err, tok) {
        if(err) return done(err);

        done(null, tok);
      });

    });
  })
);

var authorizeClient = function(client_id, redirect_uri, done) {
  models.Client.find({
    client_id: client_id,
    redirect_uri: redirect_uri
  }, function(err, clients) {
    var client = clients.shift();
    
    if(err) return done(err);

    return client ?
      done(null, client, redirect_uri) :
      done(null, false) ;
  });
};

config.auth = [
  login.ensureLogin(),
  server.authorization(authorizeClient),
  function(req, res) {
    views.hogan('../views/dialog', {
    transactionId: req.oauth2.transactionId,
    user: req.user,
    client: req.oauth2.client
    }, function(err, html) {
      res.end(html);
    });
  }
];

config.decision = [
  login.ensureLogin(),
  server.decision()
];

config.token = [
  passport.authenticate(['basic', 'oauth2-client-password'], { session: false }),
  server.token(),
  server.errorHandler()
]
