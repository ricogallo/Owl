var oauth  = require('oauth2orize'),
    passpr = require('passport'),
    models = require('../models/'),
    common = require('../core/common'),
    login  = require('connect-ensure-login'),
    views  = require('consolidate'),
    server = oauth.createServer(),
    config = exports;

server.serializeClient(function(client, done) {
  done(null, client.get('id'));
});

server.deserializeClient(function(id, done) {
  models.Client.findOne({ where: { client: id } }, function(err, client) {
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
      code: code,
      redirect_uri: redirect_uri,
      client_id: client.get('id'),
      user_id: user.get('id')
    }, function(err, code) {
      if(err) return done(err); 

      done(null, code.get('code'));
    });
  })
);

server.exchange(
  oauth.exchange.code(function(client, id, redirect_uri, done) {
    models.Code.findOne({ where: { code: id } }, function(err, code) {
      if(err) return done(err);
      if(
        !code ? true
        : code.get('client_id') !== client.id ? true
        : code.get('redirect_uri') !== redirect_uri ? true
        : false
      ) return done(null, false); 

      var token = common.token();
      models.Token.create({
        client_id: client.get('id'),
        token: token,
        user_id: code.get('user_id')
      }, function(err, tok) {
        if(err) return done(err);

        done(null, tok.get('token'));
      });

    });
  })
);

var authorizeClient = function(client_id, redirect_uri, done) {
  models.Client.findOne({ where: { client: client_id } }, function(err, client) {
    if(err) return done(err);

    return redirect_uri === client.get('redirect_uri') ?
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
];
