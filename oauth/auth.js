var passport = require('passport'),
    models   = require('../models/'),
    Local    = require('passport-local').Strategy,
    Twitter  = require('passport-twitter').Strategy,
    Github   = require('passport-github').Strategy,
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

passport.use(new Twitter({
    consumerKey   : process.env.TWITTER_ID,
    consumerSecret: process.env.TWITTER_SECRET,
    callback      : 'http://alpha.urlship.com:8000/twitter/callback'
  }, function(token, tokenSecret, profile, done) {
    models.User.findOrCreate({ where: {
      username: profile.username,
      email   : 'default@default.com' 
    }}, function(e, user) {
      if(e || !user) return done(null, false);

      done(null, user);      
    });
}));

passport.use(new Github({
    clientID    : process.env.GITHUB_ID,
    clientSecret: process.env.GITHUB_SECRET,
    callbackURL : 'http://alpha.urlship.com:8000/github/callback'
  }, function(accessToken, refreshToken, profile, done) {
    models.User.findOrCreate({ where: {
      username: profile.username,
      email   : profile.emails[0].value
    }}, function(e, user) {
      if(e || !user) return done(null, false);

      done(null, user);
    });
}));

passport.serializeUser(function(user, done) {
  done(null, user.get('id'));
});

passport.deserializeUser(function(id, done) {
  models.User.findOne({ where: { id: id }, fetch: ['buckets', 'tags', 'links'] }, done);
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
