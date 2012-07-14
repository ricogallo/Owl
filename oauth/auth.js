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
    
    return user.password === pwd ?
      done(null, user) :
      done(null, false)  ;
  });
});