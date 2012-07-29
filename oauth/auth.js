var passport = require('passport'),
    models   = require('../models/'),
    Local    = require('passport-local').Strategy,
    Basic    = require('passport-http').BasicStrategy,
    Client   = require('passport-oauth2-client-password').Strategy,
    Bearer   = require('passport-http-bearer').Strategy,
    common   = require('../core/common');

passport.use(new Local(function(usr, pwd, done) {
  models.User.get(usr, function(err, user) {
    if(err || !user) {
      return done(null, false);
    }
    done(null, common.crypt(user.salt + pwd) === user.password ? user : false);
  });
}));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  models.User.get(id, function(err, u) {
    done(err, u);
  });
});

var findClient = function(id, secret, done) {
  models.Client.get(id, function(err, client) {
    if(err || !client) {
      return !err ?
        done(null, false) :
        done(err) ;
    }

    done(null, client.client_secret === secret ? client : false);
  });
};

passport.use(new Basic(findClient));
passport.use(new Client(findClient));

passport.use(new Bearer(function(tkn, done) { 
  models.Token.get(tkn, function(err, token) {
    if(err || !token) {
      return !err ?
        done(null, false) :
        done(err);
    }

    models.User.get(token.user_id, function(e, usr) {
      if(e || !usr) {
        return !e ?
          done(null, false) :
          done(e);
      }

      done(null, usr, {scope: '*'});
    });
  }); 
}));
