var passport = require('passport'),
    models   = require('../models/'),
    Local    = require('passport-local').Strategy,
    Basic    = require('passport-http').BasicStrategy,
    Client   = require('passport-oauth2-client-password').Strategy,
    Bearer   = require('passport-http-bearer').Strategy,
    common   = require('../core/common');

passport.use(new Local(function(usr, pwd, done) {
  models.User.findOne({ where: { username: usr }, fetch: ['tags'] }, function(err, user) {
    if(err || !user) {
      return done(null, false);
    }
    
    done(null, common.crypt(user.get('salt') + pwd) === user.get('password') ? user : false);
  });
}));

passport.serializeUser(function(user, done) {
  done(null, user.get('id'));
});

passport.deserializeUser(function(id, done) {
  models.User.findOne({ where: { id: id }, fetch: ['buckets', 'tags'] }, done);
});

var findClient = function(id, secret, done) {
  models.Client.findOne({ where: { client: id } }, function(err, client) {
    if(err || !client) {
      return !err ?
        done(null, false) :
        done(err) ;
    }

    done(null, client.get('client_secret') === secret ? client : false);
  });
};

passport.use(new Basic(findClient));
passport.use(new Client(findClient));

passport.use(new Bearer(function(tkn, done) { 
  models.Token.findOne({ where: { token: tkn } }, function(err, token) {
    if(err || !token) {
      return !err ?
        done(null, false) :
        done(err);
    }

    models.User.findOne({ where: { id: token.get('user_id') } }, function(e, usr) {
      if(e || !usr) {
        return !e ?
          done(null, false) :
          done(e);
      }

      done(null, usr, {scope: '*'});
    });
  }); 
}));
