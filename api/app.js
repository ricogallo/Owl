var express  = require('express'),
    passport = require('passport'),
    users    = require('./lib/users'),
    links    = require('./lib/links');

var app = module.exports = express.createServer();

var oauth_login = function(fn) {
  return [
    passport.authenticate('bearer', { session: false }),
    fn
  ];
};

app.get('/', function(req, res) {
  res.send(200);
});

app.post('/links', oauth_login(links.create));
app.get('/links', oauth_login(links.all));
app.del('/links/:id', oauth_login(links.del));
app.get('/links/:id', oauth_login(links.get));
app.put('/links/:id', oauth_login(links.update));

app.get('/users/:id', oauth_login(users.get));
app.get('/me', oauth_login(users.me));