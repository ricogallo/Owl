var express  = require('express'),
    passport = require('passport'),
    links    = require('./lib/links'),
    web      = require('./lib/web'),
    users    = require('./lib/users'),
    client   = require('./lib/client'),
    hbs      = require('hbs'),
    fs       = require('fs'),
    login    = require('connect-ensure-login'),
    server   = require('../oauth/server');

var app = module.exports = express.createServer();

app.set('views', __dirname + '/views');
app.set('view engine', 'hbs');

/* 
 * Set up locales
*/
app.use(express.csrf());
app.use(function(req, res, next) {
  res.locals.user = req.user;
  res.locals.csrf = req.session._csrf;
  next();
});

hbs.registerPartial('rightMenu', fs.readFileSync(__dirname + '/views/right-menu.hbs', 'utf8'));
hbs.registerPartial('linkEntry', fs.readFileSync(__dirname + '/views/link-entry.hbs', 'utf8'));

require('../oauth/auth');

app.get('/', function(req, res) {
  if (req.user)
    return res.redirect('/me');

  res.render('index');
});

app.post('/sign_up', users.create);

/* 
 * User routes
*/

app.get('/sign_up', web.signUp);
app.get('/login', web.signIn);
app.post('/login', web.login);
app.get('/logout', [login.ensureLoggedIn(), web.logout]);
app.get('/users/:id', [login.ensureLoggedIn(), users.get]);
app.get('/me', [login.ensureLoggedIn(), users.me]);
app.get('/account/:id', [login.ensureLoggedIn(), users.account]);

/*
 * Oauth routes
*/
app.get('/oauth/authorize', server.auth);
app.post('/oauth/decision', server.decision);
app.post('/oauth/token', server.token);

/*
 * Client routes
*/

app.get('/client/new', [login.ensureLoggedIn(), client.createForm]);
app.post('/clients', [login.ensureLoggedIn(), client.create]); 

/*
 * Links routes
*/

app.get('/new', [login.ensureLoggedIn(), links.createForm]);
app.post('/links/new', [login.ensureLoggedIn(), links.create]);
