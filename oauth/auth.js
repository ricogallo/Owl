var passport = require('passport'),
    Local    = require('passport-local').Strategy,
    Basic    = require('passport-http').BasicStrategy,
    Client   = require('passport-oauth2-client-password').Strategy,
    Bearer   = require('passport-http-bearer').Strategy,
    common   = require('../lib/common'),
    models   = require('../models/');

var auth     = exports;

auth.Local = new Local(function(usr, pwd, done) {
  models.User.find({ username: usr }, function(err, users) {
    var user = users.shift();
    if(err || !user) {
      return err ?
        done(err) :
        done(null, false) ;
    }
    
   pwd = common.crypt(user.salt + pwd); 
    
   done(null, user.password === pwd ? user : false);
  });
});

auth.serializeUser = function(usr, done) {
  done(null, user.username);
};

auth.deserializeUser = function(usr, done) {
  models.User.find({ username: usr }, function(err, users) {
    done(err, users.shift());
  });
};

auth.Basic = new Basic(function(client_id, client_secret, done ) {
  db.Client.find({
    client_id: client_id,
    client_secret: client_secret
    }, function(err, clients) {
    
    var client = clients.shift();

    if(err || !client) {
      return err ?
        done(err) :
        done(null, false);
    }
    done(null, client.client_secret === client_secret ? client : false);
  });
});
