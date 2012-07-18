var passport = require('passport'),
    models   = require('../models/'),
    Local    = require('passport-local').Strategy,
    Basic    = require('passport-http').BasicStrategy,
    Client   = require('passport-oauth2-client-password').Strategy,
    Bearer   = require('passport-http-bearer').Strategy,
    common   = require('../lib/common');

passport.use(new Local(function(usr, pwd, done) {
  models.User.get(usr, function(err, user) {
    if(err || !user) {
      return !err ?
        done(null, false) :
        done(err) ;
    }
    
    done(null, common.crypt(user.salt + pwd) === user.password ? user : false);
  });
}));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(user, done) {
  models.User.get(user.id, function(err, u) {
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

    done(null, client.secret === secret ? client : false);
  });
};

passport.use(new Basic(findClient));
passport.use(new Client(findClient));

passport.use(new Bearer(function(tkn, done) { 
  models.Token.find({ access_token: tkn }, function(err, tokens) {
    var token = tokens.shift();

    if(err || !token) {
      return !err ?
        done(null, false) :
        done(err);
    }

    models.User.get(token.parent_id, function(e, usr) {
      if(e || !user) {
        return !e ?
          done(null, false) :
          done(e);
      }

      done(null, user, {scope: '*'});
    });
  }); 
}));
