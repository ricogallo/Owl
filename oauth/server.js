var oauth  = require('oauth2orize'),
    passpr = require('passport'),
    models = require('../models/'),
    common = require('../lib/common'),
    login  = require('connect-ensure-login'),
    views  = require('consolidate'),
    server = oauth.createServer(),
    config = exports;

server.serializeClient(function(client, done) {
  done(null, client.id);
});

server.deserializeClient(function(id, done) {
  models.Client.get(id, function(err, client) {
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
        : code.id !== client ? true
        : code.redirect_uri === redirect_uri ? true
        : false
      ) return done(null, false); 

      var token = common.token();
      models.Token.create({
        client_id: code.id,
        access_token: token,
        user_id: code.id 
      }, function(err, tok) {
        if(err) return done(err);

        done(null, tok);
      });

    });
  })
);

var authorizeClient = function(client_id, redirect_uri, done) {
  models.Client.get(client_id, function(err, client) {
    if(err) return done(err);

    return redirect_uri === client.redirect_uri ?
      done(null, client, redirect_uri) :
      done(null, false) ;
  });
};

config.auth = [
  login.ensureLoggedIn(),
  server.authorization(authorizeClient),
  function(req, res) {
    res.render('dialog', {
    transaction_id: req.oauth2.transactionID,
    user: req.user,
    client: req.oauth2.client
    });
  }
];

config.decision = [
  login.ensureLoggedIn(),
  server.decision()
];

config.token = [
  passpr.authenticate(['basic', 'oauth2-client-password'], { session: false }),
  server.token(),
  server.errorHandler()
]
